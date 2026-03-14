# Phase 2 Implementation Plan: Mike Beauty Studio

## 1. Analysis of Current Project State

**Current Tech Stack:**
- **Framework**: Next.js 16.1.6 (App Router) with React 19
- **Database**: PostgreSQL mapped via Prisma ORM
- **Auth**: Next-Auth v5 beta, bcryptjs

**Current Database Schema:**
- `User` (Basic RBAC role placeholder "ADMIN")
- `Service` (Prices, durations)
- `Media`, `Booking`, `Review`, `AppSetting`

**Conclusion**: Phase 1 established a strong, public-facing lead-generation tier and a basic back-office. Phase 2 transitions the application into a **Full Fledged Enterprise Resource Planning (ERP) System**.

---

## 2. Phase 2 Architectural Changes

### 2.1 Database Expansion (Prisma Schema)
We will introduce the following models:
- **`Worker`**: Linked to `User` for auth but distinct for HR rules (Commission Rate, Status).
- **`Transaction`**: The ultimate source of truth for revenue. Links Client Name, `Service`, `Worker`, Price, Payment Method, and Source (Booking vs Walk-In).
- **`Expense`**: Tracks out-of-pocket costs with categories (Rent, Supplies, etc.).
- **`WorkerPayment`** & **`WorkerAdvance`**: Distinct ledgers for worker HR financials.
- **`ClientCredit`**: To trace split-payments or outstanding debt.
- **`AuditLog`**: Simple event sourcing (Actor, Action, Target ID, Before/After states) to prevent fraud.

### 2.2 Backend Logic Layers (Engines)
To avoid bloated Next.js API routes, we will implement pure TypeScript classes/functions in `lib/`:
- **`lib/commission-engine.ts`**: Handles logic to split percentage/fixed commissions upon transaction creation.
- **`lib/accounting-engine.ts`**: Handles balance updates, expense creation on worker payout, and advance deduction.
- **`lib/report-engine.ts`**: Standardized Prisma aggregations for fetching Daily/Weekly/Monthly Net Profits and Staff Leaderboards.

### 2.3 Route Structure Updates

#### Admin Portals (`app/(admin)/admin/...`)
- **`/pos`**: A fast, checkout-style UI for recording walk-in sales.
- **`/workers`**: CRUD for workers, viewing their commissions & unpaid balances.
- **`/bookings`**: Update to include a "Convert to Transaction" modal for scheduled/completed bookings.
- **`/transactions`**: Master ledger of all sales.
- **`/expenses` , `/loans`**: Financial tracking portals.
- **`/reports`**: High-level financial cards (Revenue, Expenses, Profit).

#### Worker Portal (`app/(worker)/worker/dashboard/...`)
- A constrained layout securely mapped by their `User.role === 'WORKER'`. They will see their `Transactions` for the day and aggregated `Worker` balance, but no global financial data.

---

## 3. Step-by-Step Execution Plan

### Step 1: Database Migration
1. Update `schema.prisma` with the new models.
2. Generate and run the migration (`npx prisma migrate dev`).
3. Seed test data for workers, expenses, and transactions to aid UI development.

### Step 2: Core Engines Development
1. Write the `commission-engine`, `accounting-engine`, and `report-engine` utility functions.
2. Write isolated server actions (`actions/transactions.ts`, etc.) encapsulating these engines.

### Step 3: Admin POS & Booking Conversion
1. Build the POS Interface: Service selection -> Worker assignment -> Payment method -> Confirm.
2. Update Bookings panel: Add action to convert a booking into a paid transaction.

### Step 4: Worker Management & Payouts
1. Build the `/workers` UI to add staff and configure commission models.
2. Build the Payout flow: Settle unpaid balances and automatically log them as expenses.

### Step 5: Financials & Reporting
1. Build the `/expenses` ledger.
2. Build the main Dashboard showing Today's Revenue, Net Profit, and Payment Method splits.

### Step 6: Worker Portal & Security
1. Set up Next-Auth Role-based routing (Admin vs Worker).
2. Build the Worker Dashboard.
3. Integrate Audit Logging across all financial server actions.

---

## 4. Verification & Testing
- **POS Flow**: Ring up a Walk-In and verify 1 Transaction is created and the assigned worker's balance increases.
- **Booking Conversion**: Convert a booking and verify financial metrics update.
- **Payroll Simulation**: Process a worker advance, run a payout, and verify the system outputs the correct net payment, creates an Expense record, and resets the balance to 0.
- **Access Control**: Attempt to load `/admin/reports` while logged in as a `WORKER` and verify it blocks access.
