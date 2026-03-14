# Phase 6: Public Website - Gallery Page (Implementation Checklist)

**Goal:** Showcase visual proof of quality through a sophisticated, interactive gallery.

- [x] **1. Setup Gallery Components**
  - [x] Create `app/gallery/page.tsx` for the main route.
  - [x] Create `components/gallery/GalleryClient.tsx` for interactive logic.
  - [x] Create `components/gallery/Lightbox.tsx` for the full-screen image viewer.

- [ ] **2. Dependencies & Data**
  - [x] Install `framer-motion` for layout animations.
  - [x] Update `prisma/seed.ts` to include high-quality Unsplash image URLs for dummy services.
  - [x] Execute `npx prisma db seed` to insert mock gallery data.

- [x] **3. Architecture & Implementation**
  - [x] Implement Server-Side data fetching in `page.tsx`.
  - [x] Implement pure CSS Masonry grid in `GalleryClient.tsx`.
  - [x] Implement `framer-motion` `<AnimatePresence>` for smooth category filtering.
  - [x] Build the interactive `Lightbox` with keyboard navigation support.

- [x] **4. Quality Assurance**
  - [x] Verify image shuffling logic on filter click.
  - [x] Verify Lightbox opens, closes, and navigates correctly without scrolling the background body.
