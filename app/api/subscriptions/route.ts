export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const subscriptionSchema = z.object({
  customerId: z.string().min(1),
  planId: z.string().min(1),
});

export async function GET() {
  try {
    const subscriptions = await prisma.subscription.findMany({
      include: { customer: true, plan: true }
    });
    return NextResponse.json({ success: true, data: subscriptions });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customerId, planId } = subscriptionSchema.parse(body);

    const plan = await prisma.plan.findUnique({ where: { id: planId } });
    if (!plan) throw new Error('Plan not found');

    const clock = await prisma.simulatedClock.findFirst();
    const simulatedNow = clock ? clock.currentTime : new Date();

    const isTrial = plan.trialDays > 0;
    const status = isTrial ? 'trial' : 'active';
    
    const nextBillingDate = new Date(simulatedNow);
    if (isTrial) {
      nextBillingDate.setDate(nextBillingDate.getDate() + plan.trialDays);
    } else {
      if (plan.interval === 'month') {
        nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
      } else if (plan.interval === 'year') {
        nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
      }
    }

    const subscription = await prisma.$transaction(async (tx) => {
      const sub = await tx.subscription.create({
        data: {
          customerId,
          planId,
          status,
          nextBillingDate,
        }
      });
      await tx.billingEvent.create({
        data: {
          subscriptionId: sub.id,
          type: 'subscription_created',
          details: `Subscription created in ${status} status`,
          timestamp: simulatedNow,
        }
      });
      return sub;
    });

    return NextResponse.json({ success: true, data: subscription }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}
