export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { runBillingCycle } from '@/lib/billing-engine';
import { z } from 'zod';

const skipSchema = z.object({
  days: z.number().int().min(1),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { days } = skipSchema.parse(body);

    let clock = await prisma.simulatedClock.findFirst();
    if (!clock) {
      clock = await prisma.simulatedClock.create({ data: { currentTime: new Date() } });
    }

    const newTime = new Date(clock.currentTime);
    newTime.setDate(newTime.getDate() + days);

    const updatedClock = await prisma.simulatedClock.update({
      where: { id: clock.id },
      data: { currentTime: newTime }
    });

    const billingResults = await runBillingCycle(newTime);

    return NextResponse.json({ 
      success: true, 
      data: {
        simulatedTime: updatedClock.currentTime,
        ...billingResults
      } 
    }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}
