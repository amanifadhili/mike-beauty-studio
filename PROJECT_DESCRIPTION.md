production domain: https://mikebeautystudio.com

# Mike Beauty Studio - Comprehensive Project Architecture & Technical Description

## 1. Project Purpose & Vision
**Mike Beauty Studio** is an enterprise-grade full-stack web application designed specifically for modern beauty salons and service-based studios. It aims to unify the client-facing experience (marketing and booking) with complex internal operations (staff tracking, point-of-sale, and accounting). It solves the problem of disjointed systems by providing a single platform where clients can explore services, book appointments, and leave reviews, while staff and administration manage finances, payroll, schedules, and operations securely.

---

## 2. Core Technology Stack
The application leverages the Next.js App Router ecosystem and is built purely in TypeScript.

- **Framework:** Next.js (App Router, `v16.1.6`) for full-stack capabilities, server-side rendering, and API routes.
- **Language:** TypeScript (`v5.9.3`) ensuring end-to-end type safety.
- **Database & ORM:** PostgreSQL managed via Prisma ORM (`v6.4.1`).
- **Styling & UI:** Tailwind CSS (`v4`), highly customized for a premium look, integrated with `lucide-react` for iconography.
- **Animations & Micro-interactions:** 
  - `framer-motion` for declarative UI transitions.
  - `gsap` for high-performance scroll triggers and magnetic hover effects.
  - `three.js` to render 3D visuals on the landing pages, contributing to a "wow" aesthetic.
- **Authentication & Security:** NextAuth.js (`v5.0.0-beta.30`) paired with `bcryptjs` and Next.js Edge Middleware for Role-Based Access Control (RBAC).
- **Data Fetching & Validation:** Next.js Server Actions with strict runtime type-checking via `zod`.
- **Media Management:** `next-cloudinary` for serving optimized images and video portfolios.
- **Mapping:** `react-leaflet` to render custom interactive maps showing studio directions.
- **Drag & Drop:** `@dnd-kit/core` utilized within the admin dashboard to sort content (like gallery images or service priorities).

---

## 3. Database Architecture & Schema Sub-Systems
The Prisma schema uses a highly normalized PostgreSQL structure designed for financial accuracy and auditability. It is divided into several interrelated domains:

### 3.1. Identity & Access Management
- **`User`**: Operates on an Enum `Role` (`ADMIN`, `WORKER`). For workers, it natively tracks `commissionType` (Percentage or Fixed), `commissionRate`, and pending layout `balance`.
- **`Client`**: Represents external customers tracked by a unique `phone` number to ensure clean CRM records.

### 3.2. Appointment & Service Engine
- **`Service`**: Stores service offerings, duration, dynamic `price`, and maps Many-to-Many to `User` (the particular workers capable of executing the service).
- **`Media`**: Linked to `Service`, holding Cloudinary URLs for portfolio galleries.
- **`Booking`**: Contains `preferredDate`, `preferredTime`, and moves through state machines `BookingStatus` (`NEW`, `SCHEDULED`, `CONFIRMED`, `COMPLETED`, `CANCELLED`). Can specify initial `depositPaid`.

### 3.3. Financial Ledger & Payroll (Core Logic)
- **`Transaction`**: The lifeblood of the POS loop. Links `Client`, `Worker`, and `Service`. Resolves a final monetary charge and automatically splits the cut into `workerCommission` and `salonShare`. Accepts `PaymentMethod` (CASH, MOBILE MONEY, etc) and `TransactionSource` (WALK-IN vs BOOKING).
- **`Expense`**: General salon ledger tracks `ExpenseCategory` (RENT, MAINTENANCE, UTILITIES, MARKETING).
- **`WorkerPayment`**: Links to `Expense` ensuring that when a worker cashes out their `balance`, it appears as an outflow in the general business ledger.
- **`WorkerAdvance`**: Tracks loans given to staff, preventing payroll disputes by marking status as `DEDUCTED` when resolved.
- **`ExternalIncome`**: Tracks secondary income sources outside of services (e.g. physical product sales, renting a chair out).

### 3.4. Auditing & Dynamics
- **`AuditLog`**: Stringified JSON logs preventing malicious mutation of financial entities securely tied to an admin's ID.
- **`AppSetting`**: Key/Value dynamic config allowing the platform to adjust phone numbers, links, and operational flags globally without deploys.

---

## 4. Application Structure & Route Groups
Following Next.js Best Practices, the application uses **Route Groups** (`(admin)`, `(public)`, etc.) to share distinct layouts and URL boundaries:

### 4.1. The Client-Facing Portal `app/(public)`
- **Pathways**: `/home`, `/about`, `/contact`, `/booking`, `/gallery`, `/review`.
- **Purpose**: High conversion marketing site tailored with a premium aesthetic. Includes seamless GSAP parallax, 3D button hover states, dynamic portfolios fetched directly from Prisma via Server Components, and multi-step forms handling public appointment requests.
- **Layouts**: Maintains a globally interactive `<Navbar />` and unified minimal `<Footer />`.

### 4.2. The Secured Admin Dashboard `app/(admin)`
- **Pathways**: `/admin/*` (dashboard, users, clients, financial ledgers, etc).
- **Purpose**: A rich web application. Uses data-tables, responsive grids, and stat cards.
- **Capabilities**:
  - Point-of-Sale (POS) management to convert bookings into paid transactions.
  - CRUD for Services, Client data, Expenses, and custom settings.
  - Automated Worker Balance deduction endpoints mapping to Expense ledgers.

### 4.3. The Staff Portal `app/(worker)`
- **Pathways**: `/worker/dashboard`, `/worker/schedule`.
- **Purpose**: Streamlined, secure app-like view restricted strictly for staff to check hours, past payments rendered, and upcoming clients securely allocated.

### 4.4. Security `app/(auth)`
- **Pathways**: `/login`, `/register`.
- **Purpose**: Credential handling wrapped in standard Layout boundaries isolating them from navigation overhead. Middlewares enforce redirects for unauthenticated hits to `/admin`.

---

## 5. Key Workflows & Engineering Feats
1. **Server Actions First**: Instead of bloated `/api` REST routes, data mutations occur tightly inside `/actions` (e.g., `pos.ts`, `bookings.ts`). Functions are `zod` validated and wrap database updates in standard Prisma `.transaction()`, removing partial commit race-conditions.
2. **Double-Entry Financial Simulation**: Cashing out a worker decreases their virtual `balance` and inherently yields a `WorkerPayment` which generates an `Expense`. If the worker took a `WorkerAdvance`, this is queried dynamically at checkout to subtract amounts owed.
3. **Optimistic UI / Error Boundaries**: Utilizing `<Suspense />` wrappers and React 19 / Next 15 specific `loading.tsx` and `error.tsx` layers to never freeze the experience.
4. **Environment Consistency**: Seed scripts (`prisma/seed.ts`) run self-cleaning resets ensuring developers and Vercel environments hydrate to deterministic sandbox states during tests.
