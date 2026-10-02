import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const customerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  paymentToken: z.string().min(1),
});

export async function GET() {
  try {
    const customers = await prisma.customer.findMany({
      include: { subscriptions: true }
    });
    return NextResponse.json({ success: true, data: customers });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = customerSchema.parse(body);
    const customer = await prisma.customer.create({ data: parsed });
    return NextResponse.json({ success: true, data: customer }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}
