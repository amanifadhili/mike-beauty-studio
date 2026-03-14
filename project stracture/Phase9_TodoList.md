# Phase 9: Admin Dashboard - Management Modules (Implementation Checklist)

**Goal:** Empower the studio owner to control content and handle client requests via professional data tables and CRUD interfaces.

- [ ] **1. Setup Components & Directories**
  - [ ] Create `app/(admin)/admin/bookings/page.tsx`
  - [ ] Create `app/(admin)/admin/services/page.tsx`
  - [ ] Create `app/(admin)/admin/gallery/page.tsx`
  - [ ] Create `components/admin/BookingTable.tsx`
  - [ ] Create `components/admin/ServiceModal.tsx`
  - [ ] Create `components/admin/GalleryUploader.tsx`

- [x] **2. Data Layer (Server Actions)**
  - [x] Implement `app/actions/adminBookings.ts` (Update status)
  - [x] Implement `app/actions/adminServices.ts` (Create, Update, Toggle)
  - [x] Implement `app/actions/adminGallery.ts` (Add URL, Delete)

- [x] **3. Bookings Manager Implementation**
  - [x] Build Admin Bookings Page to fetch all requests.
  - [x] Develop the interactive `BookingTable` to change statuses.

- [x] **4. Services Manager Implementation**
  - [x] Build Services Dashboard view (Table/Grid).
  - [x] Develop `ServiceModal` form for creating/editing services.

- [x] **5. Gallery Manager Implementation**
  - [ ] Build Gallery Dashboard view.
  - [x] Develop UI to add Unsplash/External Image URLs to categories.

- [x] **6. Quality Assurance**
  - [x] Test status changes on a mock booking.
  - [x] Create, edit, and toggle a mock service.
  - [x] Add and remove a mock gallery image.
