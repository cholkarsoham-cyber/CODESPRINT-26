import { prisma } from './db';
import { processPayment } from './mock-gateway';
import { SubscriptionStatus, validateTransition } from './state-machine';

export async function runBillingCycle(simulatedNow: Date) {
  const subscriptions = await prisma.subscription.findMany({
    where: {
      nextBillingDate: { lte: simulatedNow },
      status: { in: ['trial', 'active', 'past_due'] }
    },
    include: {
      customer: true,
      plan: true,
    }
  });

  let processed = 0;
  const results: Array<{ subscriptionId: string; action: string; status: string }> = [];

  for (const sub of subscriptions) {
    try {
      await prisma.$transaction(async (tx) => {
        let currentStatus = sub.status as SubscriptionStatus;
        
        if (currentStatus === 'trial') {
          if (!validateTransition(currentStatus, 'active')) throw new Error('Invalid transition');
          currentStatus = 'active';
          await tx.subscription.update({
            where: { id: sub.id },
            data: { status: currentStatus }
          });
          await tx.billingEvent.create({
            data: {
              subscriptionId: sub.id,
              type: 'trial_ended',
              details: 'Trial ended, transitioning to active',
              timestamp: simulatedNow,
            }
          });
        }

        const invoice = await tx.invoice.create({
          data: {
            subscriptionId: sub.id,
            amount: sub.plan.price,
            status: 'pending',
            date: simulatedNow,
          }
        });

        const paymentRes = processPayment(sub.customer.paymentToken);

        if (paymentRes.success) {
          const nextDate = new Date(simulatedNow);
          if (sub.plan.interval === 'month') {
            nextDate.setMonth(nextDate.getMonth() + 1);
          } else if (sub.plan.interval === 'year') {
            nextDate.setFullYear(nextDate.getFullYear() + 1);
          }

          if (currentStatus !== 'active' && validateTransition(currentStatus, 'active')) {
            currentStatus = 'active';
          }
          
          await tx.subscription.update({
            where: { id: sub.id },
            data: {
              status: currentStatus,
              nextBillingDate: nextDate,
              retryCount: 0,
            }
          });

          await tx.invoice.update({
            where: { id: invoice.id },
            data: { status: 'paid' }
          });

          await tx.billingEvent.create({
            data: {
              subscriptionId: sub.id,
              type: 'payment_succeeded',
              details: paymentRes.message,
              timestamp: simulatedNow,
            }
          });

          results.push({ subscriptionId: sub.id, action: 'charged', status: 'active' });

        } else {
          await tx.invoice.update({
            where: { id: invoice.id },
            data: { status: 'failed' }
          });

          if (sub.retryCount < 1) {
            if (validateTransition(currentStatus, 'past_due')) {
               currentStatus = 'past_due';
            }
            const nextRetry = new Date(simulatedNow);
            nextRetry.setDate(nextRetry.getDate() + 3);

            await tx.subscription.update({
              where: { id: sub.id },
              data: {
                status: currentStatus,
                nextBillingDate: nextRetry,
                retryCount: sub.retryCount + 1,
              }
            });

            await tx.billingEvent.create({
              data: {
                subscriptionId: sub.id,
                type: 'payment_failed',
                details: 'Payment failed, dunning retry scheduled',
                timestamp: simulatedNow,
              }
            });

            results.push({ subscriptionId: sub.id, action: 'payment_failed', status: currentStatus });
          } else {
            if (validateTransition(currentStatus, 'suspended')) {
              currentStatus = 'suspended';
            }

            await tx.subscription.update({
              where: { id: sub.id },
              data: {
                status: currentStatus,
              }
            });

            await tx.billingEvent.create({
              data: {
                subscriptionId: sub.id,
                type: 'subscription_suspended',
                details: 'Max retries reached, subscription suspended',
                timestamp: simulatedNow,
              }
            });
            results.push({ subscriptionId: sub.id, action: 'suspended', status: currentStatus });
          }
        }
      });
      processed++;
    } catch (e) {
      console.error(`Failed to process sub ${sub.id}`, e);
    }
  }

  return { processed, results };
}
