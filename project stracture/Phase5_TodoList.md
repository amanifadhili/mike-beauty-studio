# Phase 5: Public Website - Services & Single Service Pages (Implementation Checklist)

**Goal:** Present offerings elegantly to drive desire by building the master services menu and deep-dive detail pages.

- [x] **1. Main Services Listing Page** (`app/services/page.tsx`)
  - [x] Build the static introductory header section for the services menu.
  - [x] Fetch all active services using Server Components (`getServices()`).
  - [x] Render the full `ServicesGrid` component.

- [x] **2. Dynamic Single Service Page** (`app/services/[id]/page.tsx`)
  - [x] Scaffold the dynamic Next.js App Router component.
  - [x] Fetch the specific service data using `getServiceById(id)`.
  - [x] Implement graceful `notFound()` error handling for invalid IDs.
  - [x] Build the Left Column: Media layout (Hero image/video).
  - [x] Build the Right Column: Sticky service details (Title, Price, description) and prominent CTA.

- [ ] **3. Quality Assurance**
  - [ ] Verify routing from the Homepage grid into the specific `[id]` route.
  - [ ] Ensure mobile responsiveness of the split-column detail layout.
