export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const activeSubs = await prisma.subscription.findMany({
      where: { status: 'active' },
      include: { plan: true }
    });

    let mrr = 0;
    for (const sub of activeSubs) {
      if (sub.plan.interval === 'month') {
        mrr += sub.plan.price;
      } else if (sub.plan.interval === 'year') {
        mrr += sub.plan.price / 12;
      }
    }

    const allSubs = await prisma.subscription.findMany();
    const counts = {
      trial: 0,
      active: 0,
      past_due: 0,
      suspended: 0,
      cancelled: 0,
    };
    
    for (const sub of allSubs) {
      if (sub.status in counts) {
        counts[sub.status as keyof typeof counts]++;
      }
    }

    const activeOrCancelled = counts.active + counts.cancelled;
    const churn = activeOrCancelled > 0 ? (counts.cancelled / activeOrCancelled) * 100 : 0;

    const recentInvoices = await prisma.invoice.findMany({
      take: 20,
      orderBy: { date: 'desc' },
      include: {
        subscription: {
          include: { customer: true, plan: true }
        }
      }
    });

    const events = await prisma.billingEvent.findMany({
      take: 30,
      orderBy: { timestamp: 'desc' },
      include: {
        subscription: { include: { customer: true } }
      }
    });

    let clock = await prisma.simulatedClock.findFirst();
    if (!clock) {
      clock = await prisma.simulatedClock.create({ data: { currentTime: new Date() } });
    }

    return NextResponse.json({
      success: true,
      data: {
        mrr,
        counts,
        churn,
        recentInvoices,
        events,
        simulatedTime: clock.currentTime
      }
    }, { status: 200 });

  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
