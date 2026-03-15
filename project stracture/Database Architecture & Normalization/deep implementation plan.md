# Architectural Reset (Phase 3 Reboot): Deep Implementation Plan

This document outlines the step-by-step implementation phases for the deep database architectural reset. This refactoring will bring the Mike Beauty Studio ERP to a Senior Database Architect standard by merging redundant models, eliminating string duplications, enforcing native Enums, and guaranteeing strict ledger relationships.

Because this touches the very core of the application, execution must follow these strict phases to ensure data integrity and type safety upon completion.

---

## Phase 1: Database Schema Overhaul & Data Wipe
**Objective:** Rewrite the foundation and enforce PostgreSQL constraints.
- [ ] Implement database-level `enum` types: `Role`, `PaymentMethod`, `BookingStatus`, `ExpenseCategory`.
- [ ] Merge the `Worker` model directly into `User` (move `phone`, `roleTitle`, `commissionType`, `commissionRate`, `status`, `balance` to User).
- [ ] Extract the standalone `Client` model (with `name` and unique `phone`).
- [ ] Add `depositPaid` to the `Booking` model.
- [ ] Enforce rigid referential integrity between `WorkerPayment` and `Expense` (`expenseId`).
- [ ] Run destructive schema push: `npx prisma db push --accept-data-loss`.
- [ ] Regenerate Prisma Client: `npx prisma generate`.

## Phase 2: Seed Engine Rewrite
**Objective:** Ensure the mock data generator matches the new strict constraints.
- [ ] Rewrite `prisma/seed.ts` to create unified `User` records (Admin and Workers).
- [ ] Automate the generation of standalone `Client` records.
- [ ] Update `Transaction`, `Booking`, and `ClientCredit` generation to map to the new `clientId` and `userId` relations.
- [ ] Enforce valid Enums in the seed data arrays.
- [ ] Execute `npx prisma db seed` to securely populate the freshly wiped database.

## Phase 3: Core Logic & Server Actions Porting
**Objective:** Update the backend brain of the ERP to parse the unified architecture.
- [ ] **`lib/commission-engine.ts`**: Refactor to read commission formulas straight from the `User` object instead of `Worker`.
- [ ] **`lib/accounting-engine.ts`**: Ensure payouts tie directly directly into an `Expense` object upon transaction.
- [ ] **`actions/pos.ts`**: Update checkout handling. Implement logic to either `findUnique` or `create` a `Client` on the fly during POS checkout. Map the transaction to `userId`.
- [ ] **`actions/bookings.ts`**: Update the "Convert to Sale" handler to respect the new `depositPaid` field and map to `Client` and `userId`.
- [ ] **`actions/adminServices.ts`**: Update relation logic so Services link to a `userId` array.

## Phase 4: API Routes Re-Wiring
**Objective:** Fix REST endpoints broken by the `Worker` model destruction.
- [ ] **`/api/admin/workers/route.ts`**: Convert this from querying the `Worker` model to querying `User` where `role === 'WORKER'` or `'ADMIN'`.
- [ ] **`/api/admin/workers/payout/route.ts`**: Strictly map the generated payout to create an Expense and link the IDs.
- [ ] **`/api/admin/client-credits/route.ts`**: Query credits through the `Client` relation rather than raw strings.
- [ ] **`/api/admin/reports/route.ts`**: Update aggregate queries (P&L, Top Performers) to group by `Client` and `User` native Enums.

## Phase 5: UI & Admin Frontend Transplantation
**Objective:** Fix all React components to consume the newly shaped objects without throwing errors.
- [ ] **Workers Dashboard (`/admin/workers`) & `WorkerModal`**: Rebuild the UI constraints since you no longer "promote" a User to a Worker, but simply create a User with the `WORKER` role natively.
- [ ] **Service Management (`ServiceModal`)**: Update the staff assignment checkboxes to iterate over `User`s.
- [ ] **POS Terminal UI**: Rebuild the Client input to act as a search/create field for the unified `Client` database.
- [ ] **Bookings UI (`BookingTable`)**: Add deposit inputs and link the display to `Client`.
- [ ] **Client IOUs (`ClientCreditsClient`)**: Reroute the WhatsApp links and names to pull from the `Client` relation object.

## Phase 6: Final Verification & Type Safety Audit
**Objective:** Guarantee absolute stability before calling the reset done.
- [ ] Run `npx tsc --noEmit` and surgically repair any lingering TypeScript typing misalignments in the `.tsx` files.
- [ ] Execute `npm run build` to confirm static and dynamic pages compile flawlessly under Turbopack.
- [ ] Perform a manual end-to-end checkout flow via the POS and Bookings interface to verify financial math and client generation work seamlessly.
