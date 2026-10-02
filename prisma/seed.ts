import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function runSeed() {
  // Plans
  await prisma.plan.upsert({
    where: { id: 'plan_pro_monthly' },
    update: {},
    create: {
      id: 'plan_pro_monthly',
      name: 'Pro Monthly',
      price: 29,
      interval: 'month',
      trialDays: 0,
    },
  });

  await prisma.plan.upsert({
    where: { id: 'plan_pro_yearly' },
    update: {},
    create: {
      id: 'plan_pro_yearly',
      name: 'Pro Yearly',
      price: 290,
      interval: 'year',
      trialDays: 14,
    },
  });

  // Customers
  await prisma.customer.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: {
      name: 'Alice',
      email: 'alice@example.com',
      paymentToken: 'tok_success',
    },
  });

  await prisma.customer.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: {
      name: 'Bob',
      email: 'bob@example.com',
      paymentToken: 'tok_success',
    },
  });

  await prisma.customer.upsert({
    where: { email: 'charlie@example.com' },
    update: {},
    create: {
      name: 'Charlie',
      email: 'charlie@example.com',
      paymentToken: 'tok_fail',
    },
  });

  // SimulatedClock
  const clocks = await prisma.simulatedClock.findMany();
  if (clocks.length === 0) {
    await prisma.simulatedClock.create({
      data: {
        id: 'clock_1',
        currentTime: new Date(),
      },
    });
  } else {
    await prisma.simulatedClock.update({
      where: { id: clocks[0].id },
      data: { currentTime: new Date() },
    });
  }
}

if (require.main === module) {
  runSeed()
    .then(() => {
      console.log('Seed successful');
      process.exit(0);
    })
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}
