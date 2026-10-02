export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const timeSchema = z.object({
  reset: z.boolean(),
});

export async function GET() {
  try {
    let clock = await prisma.simulatedClock.findFirst();
    if (!clock) {
      clock = await prisma.simulatedClock.create({ data: { currentTime: new Date() } });
    }
    return NextResponse.json({ success: true, data: { simulatedTime: clock.currentTime } }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { reset } = timeSchema.parse(body);
    
    if (reset) {
      let clock = await prisma.simulatedClock.findFirst();
      if (!clock) {
        clock = await prisma.simulatedClock.create({ data: { currentTime: new Date() } });
      } else {
        clock = await prisma.simulatedClock.update({
          where: { id: clock.id },
          data: { currentTime: new Date() }
        });
      }
      return NextResponse.json({ success: true, data: { simulatedTime: clock.currentTime } }, { status: 200 });
    }
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}
