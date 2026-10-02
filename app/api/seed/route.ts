export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { runSeed } from '@/prisma/seed';

export async function POST() {
  try {
    await runSeed();
    return NextResponse.json({ success: true, data: 'Seed successful' }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
