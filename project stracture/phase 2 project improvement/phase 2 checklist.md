# Phase 2 Implementation: Actionable Checklist

This checklist tracks the execution of the 10-Phase ERP & Financials project for Mike Beauty Studio.

## Phase 1: Database Architecture & Migration
- [ ] Create `Worker` model and link to `User`
- [ ] Create `Transaction` model (source of revenue truth)
- [ ] Create supporting financial models: `Expense`, `WorkerPayment`, `WorkerAdvance`, `ClientCredit`
- [ ] Create `AuditLog` structure
- [ ] Generate and run Prisma migration (`npx prisma migrate dev`)
- [ ] Add basic seed data (test workers, services)

## Phase 2: Core Business Logic (The Engines)
- [ ] Create `lib/commission-engine.ts` for fixed/percentage calculations
- [ ] Create `lib/accounting-engine.ts` for automated balance adjustments and worker payouts
- [ ] Create `lib/report-engine.ts` for financial metrics aggregation
- [ ] Test calculation accuracy for edge cases

## Phase 3: Admin POS & Walk-ins Interface
- [ ] Build `/admin/pos` interface for fast data entry
- [ ] Implement robust Service & Worker selection logic
- [ ] Wire to Backend: Trigger `Transaction` creation and update `Worker` balance
- [ ] Test walk-in flow end-to-end

## Phase 4: Booking Conversion Module
- [ ] Modify `/admin/bookings` table to include "Convert to Sale" modal
- [ ] Implement conversion logic (pre-fill Client and Service from Booking)
- [ ] Connect conversion to the `commission-engine` to record revenue
- [ ] Test booking-to-transaction flow

## Phase 5: Worker Management & Profiles
- [ ] Build `/admin/workers` list and detailed views
- [ ] Implement staff creation, editing, and deactivation
- [ ] Add fields for "Commission Type" (Fixed/Percentage) and "Commission Rate"
- [ ] Test saving and updating worker compensation formulas

## Phase 6: Worker Payroll & Advances
- [ ] Build Payroll Dashboard (viewing all unpaid balances)
- [ ] Implement "Issue Advance" feature (decreases future payouts)
- [ ] Implement "Pay Worker" action (resets balance, deducts advances, creates `WorkerPayment` log)
- [ ] Configure automatic `Expense` generation upon worker payout

## Phase 7: General Ledger & Expenses
- [ ] Build `/admin/expenses` CRUD interface for operational costs
- [ ] Add categories for tracking (Rent, Utilities, Marketing, etc.)
- [ ] Build `ClientCredit` interface for handling partial payments/IOUs

## Phase 8: Financial Dashboards & Reporting
- [ ] Overhaul Admin Homepage with high-level financial widgets (Revenue, Net Profit, Pending Payouts)
- [ ] Build detailed `/admin/reports` page
- [ ] Implement queries for Weekly/Monthly P&L
- [ ] Implement queries for Payment Method distributions and Top Performing Workers

## Phase 9: Worker Portal (Self-Service)
- [ ] Set up routing to restrict `WORKER` role specifically to `/worker/dashboard`
- [ ] Prevent `WORKER` from accessing global `/admin/*` financial routes
- [ ] Build Worker Dashboard UI (Today's Jobs, Unpaid Balance, Payment History)
- [ ] Test role-based viewing restrictions

## Phase 10: Security, Auditing & Final Integration
- [ ] Ensure Next-Auth Middleware strictly enforces RBAC across all routes
- [ ] Wire `AuditLog` generation into all sensitive accounting Server Actions
- [ ] Run complete system end-to-end test simulating a busy workday
- [ ] Deploy and verify production migration
