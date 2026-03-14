# Phase 11: Admin Authentication & Security (Implementation Checklist)

**Goal:** Secure the Admin Dashboard by implementing a robust login system, session management, and route protection.

- [ ] **1. Library Installation**
  - [ ] Install `next-auth@beta` and `bcryptjs`.

- [x] **2. Configuration & Logic**
  - [x] Create `auth.config.ts` (Edge compatible).
  - [x] Create `auth.ts` (Node.js compatible) with Credentials provider.
  - [x] Implement `middleware.ts` to protect `/admin/*` routes.
  - [ ] Create `app/actions/authActions.ts` for login execution.

- [x] **3. User Interface**
  - [x] Build `/login` page (`app/(auth)/login/page.tsx`).
  - [x] Develop `LoginForm.tsx` component.
  - [x] Add "Sign Out" functionality to `AdminSidebar.tsx`.
  - [x] Update `AdminSidebar.tsx` to display logged-in user info.

- [x] **4. Admin Seeding**
  - [x] Update `prisma/seed.ts` to securely hash and insert an Admin User.
