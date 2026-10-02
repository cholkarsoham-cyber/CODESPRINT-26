import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const planSchema = z.object({
  name: z.string().min(1),
  price: z.number().min(0),
  interval: z.enum(['month', 'year']),
  trialDays: z.number().min(0).default(0),
});

export async function GET() {
  try {
    const plans = await prisma.plan.findMany();
    return NextResponse.json({ success: true, data: plans });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = planSchema.parse(body);
    const plan = await prisma.plan.create({ data: parsed });
    return NextResponse.json({ success: true, data: plan }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}
