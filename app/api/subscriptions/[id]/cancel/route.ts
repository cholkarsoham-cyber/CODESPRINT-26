export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { SubscriptionStatus, validateTransition } from '@/lib/state-machine';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const subscription = await prisma.subscription.findUnique({ where: { id } });
    
    if (!subscription) {
      return NextResponse.json({ success: false, error: 'Subscription not found' }, { status: 404 });
    }

    const currentStatus = subscription.status as SubscriptionStatus;
    if (!validateTransition(currentStatus, 'cancelled')) {
      return NextResponse.json({ success: false, error: 'Invalid transition to cancelled' }, { status: 400 });
    }

    const clock = await prisma.simulatedClock.findFirst();
    const simulatedNow = clock ? clock.currentTime : new Date();

    const updated = await prisma.$transaction(async (tx) => {
      const sub = await tx.subscription.update({
        where: { id },
        data: { status: 'cancelled' }
      });
      
      await tx.billingEvent.create({
        data: {
          subscriptionId: id,
          type: 'subscription_cancelled',
          details: 'User cancelled subscription',
          timestamp: simulatedNow,
        }
      });

      return sub;
    });

    return NextResponse.json({ success: true, data: updated }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
