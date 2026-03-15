# Architectural Reset (Phase 3 Reboot): Tracking Checklist

Use this checklist to track the live progress of the deep database normalization and code transplant. I will check these off as I complete each step.

## Phase 1: Database Schema Overhaul & Data Wipe
- [x] Add explicit `Enum` blocks for `Role`, `PaymentMethod`, `BookingStatus`, `ExpenseCategory` in `schema.prisma`.
- [x] Collapse `Worker` properties (`phone`, `roleTitle`, `commissionType`, `commissionRate`, `status`, `balance`) directly into the `User` model.
- [x] Create a standalone `Client` model (`name`, `phone`, `email`).
- [x] Introduce `depositPaid` to the `Booking` model.
- [x] Create `expenseId` relation on `WorkerPayment`.
- [x] Update all foreign keys in `Transaction`, `Booking`, `ClientCredit`, `Service`, etc., to use `userId` and `clientId` where applicable.
- [x] Push schema wiping current mock data: `npx prisma db push --accept-data-loss`.
- [x] Regenerate types: `npx prisma generate`.

## Phase 2: Seed Engine Rewrite
- [x] Refactor `prisma/seed.ts` to insert unified `User` entities with roles.
- [x] Add logic to generate `Client` entities before creating transactions/bookings.
- [x] Ensure valid native Enums are used across all seeded records.
- [x] Execute `npx prisma db seed` to safely repopulate the environment.

## Phase 3: Core Logic & Server Actions Porting
- [x] Update `lib/commission-engine.ts` to calculate from the new unified `User` object.
- [x] Update `lib/accounting-engine.ts` to generate and link an `Expense` ID on `WorkerPayment` creation.
- [x] Refactor `actions/pos.ts` to find/create a `Client` instantly and assign to the new `Transaction`.
- [x] Refactor `actions/bookings.ts` handling of conversion, incorporating the `depositPaid` field and linking to `Client`.
- [x] Update `actions/adminServices.ts` to handle `User` relations instead of `Worker`.

## Phase 4: API Routes Re-Wiring
- [x] Patch `/api/admin/workers/route.ts` to read/write `User` with `role: 'WORKER' | 'ADMIN'`.
- [x] Patch `/api/admin/workers/payout/route.ts` backend to strictly log `expenseId` Foreign Key.
- [x] Patch `/api/admin/client-credits/route.ts` to resolve `clientId` instead of disconnected strings.

## Phase 5: UI & Admin Frontend Transplantation
- [x] Refactor `/admin/workers` UI interface to eliminate the old "promotion" logic and directly manage `User` records.
- [x] Refactor `ServiceModal` to loop over all eligible `User`s rather than `Worker`s.
- [x] Refactor `/admin/pos` checkout form to feature a unified `Client` lookup/creation.
- [x] Refactor `/admin/bookings` table to natively handle a "Deposit Amount".
- [x] Finalize `/admin/client-credits` to list the normalized `Client` relations.

## Phase 6: Final Verification & Type Safety Audit ✅ COMPLETE
- [x] Fix all TypeScript schema mismatches across all admin pages and server actions.
- [x] Fix `worker/dashboard/page.tsx` to use unified User model (removed legacy `workerProfile`).
- [x] Fix `app/actions/index.ts` public booking to upsert `Client` before creating `Booking`.
- [x] Fix `admin/reports/page.tsx` to use `userId` instead of deleted `workerId`.
- [x] Run `npm run build` — **✅ Passed: 28 routes compiled, 0 TypeScript errors, exit code 0**.
