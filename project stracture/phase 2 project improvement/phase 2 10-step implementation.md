# Phase 2 Implementation: 10-Phase Execution Plan

This document breaks down the implementation of Phase 2 (Enterprise Resource Planning & Financials) into 10 distinct, logical phases to ensure smooth integration without disrupting the existing platform.

---

## Phase 1: Database Architecture & Migration
**Goal:** Establish the foundational data structures required for financial tracking and HR rules.
- **Tasks:**
  - Create the `Worker` model and establish relations with `User`.
  - Create the robust `Transaction` ledger model.
  - Create supporting models: `Expense`, `WorkerPayment`, `WorkerAdvance`, `ClientCredit`.
  - Create the `AuditLog` structure to track financial mutations.
- **Deliverables:** Updated `schema.prisma` and a successful database migration (`npx prisma migrate dev`).

## Phase 2: Core Business Logic (The Engines)
**Goal:** Separate complex financial mathematics from the UI and API routes by creating pure, testable backend services.
- **Tasks:**
  - Build `lib/commission-engine.ts` to calculate real-time fixed/percentage splits.
  - Build `lib/accounting-engine.ts` to execute automated balance adjustments (e.g., deducting advances during payout).
  - Write unit or integration tests to verify accurate math output (down to the smallest currency unit).
- **Deliverables:** Reusable, secure backend logic services.

## Phase 3: Admin POS & Walk-ins Interface
**Goal:** Deploy the fast-checkout interface for immediately recording on-site sales.
- **Tasks:**
  - Build the `/admin/pos` layout heavily optimized for fast data entry.
  - Implement dynamic forms: Select Service -> Assign Worker -> Choose Payment Method (Cash, Mobile, etc.).
  - Connect the POS form submission to the `commission-engine` to instantly log the `Transaction` and update worker balances.
- **Deliverables:** A fully functional Cashier / POS screen.

## Phase 4: Booking Conversion Module
**Goal:** Monetize the existing website bookings by converting them into actionable revenue transactions.
- **Tasks:**
  - Update the existing `/admin/bookings` UI to add a "Convert to Sale" or "Checkout" action on completed appointments.
  - Implement a modal that functions similarly to the POS but pre-fills the Client and Service data.
  - Link the conversion to the `commission-engine`.
- **Deliverables:** Bookings now seamlessly generate financial records upon completion.

## Phase 5: Worker Management & Profiles
**Goal:** Allow administrators to manage staff, roles, and automated compensation rules.
- **Tasks:**
  - Build `/admin/workers` interface (List, Create, Edit, Deactivate).
  - Add configuration fields on worker profiles for "Commission Type" (Fixed vs. Percentage) and "Rate".
  - Build a detailed view for an individual worker to see their historical performance.
- **Deliverables:** Full CRUD capabilities for the Salon's workforce.

## Phase 6: Worker Payroll & Advances
**Goal:** Give administrators the tools to handle cash disbursement safely to staff.
- **Tasks:**
  - Build the Payroll Dashboard (`/admin/payouts` or inside worker profiles) displaying the current "Unpaid Balance" for each worker.
  - Implement the "Issue Advance" feature, recording a deduction for future pay periods.
  - Implement the "Pay Worker" action. This triggers the `accounting-engine` to: reset balance to 0, subtract pending advances, and automatically generate a corresponding business `Expense`.
- **Deliverables:** Automated payroll tracking and disbursement workflows.

## Phase 7: General Ledger & Expenses
**Goal:** Track operational costs to determine true net profit.
- **Tasks:**
  - Build `/admin/expenses` interface.
  - Allow administrators to log daily operational costs (Rent, Utilities, Lash Supplies, Marketing).
  - Implement the `ClientCredit` module for handling IOU's or split-payments from trusted clients.
- **Deliverables:** Total visibility into money leaving the business.

## Phase 8: Financial Dashboards & Reporting
**Goal:** Aggregate all new data points into readable business intelligence.
- **Tasks:**
  - Build a comprehensive `lib/report-engine.ts`.
  - Overhaul the Admin Homepage to feature financial widgets: Today's Revenue, Net Profit, Pending Payouts.
  - Build the `/admin/reports` page for deeper dives (Weekly/Monthly P&L, Payment Method spread, Top Performing Workers).
- **Deliverables:** A live, real-time pulse on the financial health of the studio.

## Phase 9: Worker Portal (Self-Service)
**Goal:** Empower staff with transparency regarding their earnings without exposing global studio revenues.
- **Tasks:**
  - Route users with `User.role === 'WORKER'` exclusively to `/worker/dashboard`.
  - Display their personal metrics: Today's Jobs, Total Unpaid Earnings, and Payment History.
  - Restrict their UI from all Admin panels automatically.
- **Deliverables:** Secure, role-based sub-portal purely for staff.

## Phase 10: Security, Auditing & Final Integration
**Goal:** Harden the platform against unauthorized access and intentional/unintentional data corruption.
- **Tasks:**
  - Implement robust Middleware Role-Based Access Control (RBAC).
  - Bind `AuditLog` interceptors to all sensitive Server Actions (e.g., reversing a transaction, modifying a past expense).
  - Execute end-to-end integration testing simulating a full day's operation (Walk-ins + Bookings + Payouts).
- **Deliverables:** A secure, production-ready ERP system ready for the owner's daily use.
