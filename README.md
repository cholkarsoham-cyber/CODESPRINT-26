# Subscription Billing & Dunning Engine

**CodeSprint 2026 — PS 07**

A production-grade subscription billing engine with plan catalogs, automated invoicing, intelligent dunning flows, MRR analytics, and a Time Machine for live demos.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (strict)
- **Database:** PostgreSQL + Prisma ORM
- **Styling:** Tailwind CSS 3
- **Charts:** Recharts
- **Icons:** Lucide React
- **Validation:** Zod

## Features

- ✅ Plan catalog (monthly/yearly with trial days)
- ✅ Customer signup with mock payment tokens
- ✅ Server-enforced subscription state machine (trial → active → past_due → suspended → cancelled)
- ✅ Automatic invoice generation per billing cycle
- ✅ Failed-payment dunning flow (retry after 3 days, suspend on 2nd failure)
- ✅ Time Machine — skip N days to demo billing cycles in seconds
- ✅ MRR dashboard with churn rate, status counts, invoice list, and event log

## Prerequisites

- **Node.js 20+** — download from https://nodejs.org
- **PostgreSQL 14+** — download from https://www.postgresql.org/download/windows/

## Setup & Run

### 1. Clone the repo

```bash
git clone https://github.com/cholkarsoham-cyber/CODESPRINT-26.git
cd CODESPRINT-26
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up the database

Create a PostgreSQL database:

```bash
psql -U postgres -c "CREATE DATABASE billing_dev;"
```

Or use pgAdmin to create a database called `billing_dev`.

### 4. Configure environment

```bash
copy .env.example .env
```

Edit `.env` and set your PostgreSQL connection string:

```
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/billing_dev"
```

### 5. Push the schema & seed data

```bash
npx prisma db push
npm run db:seed
```

### 6. Start the dev server

```bash
npm run dev
```

Open **http://localhost:3000** in your browser.

## How to Demo

1. **Landing Page** (http://localhost:3000) — Shows plans, customers, and lets you create subscriptions.
2. Click **"Seed Demo Data"** to populate 2 plans + 3 customers (Alice & Bob with successful cards, Charlie with a failing card).
3. Subscribe all 3 customers to "Pro Monthly".
4. Go to the **Dashboard** (http://localhost:3000/dashboard).
5. Click **"Skip 31 Days"** → 3 invoices generated. Alice & Bob paid ✅. Charlie failed → Past Due ⚠️.
6. Click **"Skip 3 Days"** → Dunning retry for Charlie fails again → Suspended 🚫.
7. MRR updates live. Event log narrates the full story.

## Project Structure

```
├── app/
│   ├── page.tsx                          # Landing page (plans + signup)
│   ├── dashboard/page.tsx                # Revenue dashboard
│   ├── layout.tsx                        # Root layout
│   ├── globals.css                       # Tailwind + dark theme
│   └── api/
│       ├── plans/route.ts                # CRUD plans
│       ├── customers/route.ts            # CRUD customers
│       ├── subscriptions/route.ts        # Create/list subscriptions
│       ├── subscriptions/[id]/cancel/    # Cancel subscription
│       ├── time/skip/route.ts            # Time Machine (core billing job)
│       ├── time/route.ts                 # Get/reset simulated clock
│       ├── dashboard/route.ts            # MRR, churn, invoices, events
│       └── seed/route.ts                 # Seed demo data via API
├── components/
│   ├── metric-card.tsx                   # Dashboard metric cards
│   ├── status-badge.tsx                  # Status badges (trial/active/etc.)
│   ├── time-machine.tsx                  # Time skip controls
│   ├── invoice-table.tsx                 # Invoice list table
│   └── event-log.tsx                     # Event timeline
├── lib/
│   ├── db.ts                             # Prisma client singleton
│   ├── state-machine.ts                  # Subscription lifecycle rules
│   ├── billing-engine.ts                 # Core billing + dunning logic
│   └── mock-gateway.ts                   # Mock payment processor
├── prisma/
│   ├── schema.prisma                     # Database schema
│   └── seed.ts                           # Seed script
└── package.json
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/plans` | List all plans |
| POST | `/api/plans` | Create a plan |
| GET | `/api/customers` | List all customers |
| POST | `/api/customers` | Create a customer |
| GET | `/api/subscriptions` | List all subscriptions |
| POST | `/api/subscriptions` | Create a subscription |
| POST | `/api/subscriptions/[id]/cancel` | Cancel a subscription |
| POST | `/api/time/skip` | Skip N days (runs billing engine) |
| GET | `/api/time` | Get current simulated time |
| POST | `/api/time` | Reset clock |
| GET | `/api/dashboard` | Get dashboard metrics |
| POST | `/api/seed` | Seed demo data |

## Benchmarks

| Feature | Stripe Billing | Chargebee | Our Engine |
|---------|---------------|-----------|------------|
| Plan Catalog | ✅ | ✅ | ✅ |
| State Machine | ✅ | ✅ | ✅ Server-enforced |
| Dunning | ✅ | ✅ | ✅ Configurable |
| MRR Dashboard | ✅ | ✅ | ✅ Real-time |
| Time Machine | ❌ | ❌ | ✅ Unique |
| Self-Hosted | ❌ | ❌ | ✅ $0 |