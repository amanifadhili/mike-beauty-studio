# Phase 12: Advanced Admin Settings (Implementation Checklist)

**Goal:** Create a dynamic Key-Value store in the database to manage application settings without hardcoding values in components.

- [x] **1. Schema & Database updates**
  - [x] Add `AppSetting` model to `schema.prisma`.
  - [x] Run Prisma migration.
  - [x] Update `prisma/seed.ts` to insert fallback defaults.

- [x] **2. Actions & Logic**
  - [x] Create `app/actions/adminSettings.ts`.
  - [x] Add `getSettings()` server action.
  - [x] Add `saveSettings()` server action.

- [x] **3. Admin UI**
  - [x] Build `app/(admin)/admin/settings/page.tsx`.
  - [x] Develop `SettingsEditor.tsx` with vertical tabs (General, Booking, SEO).

- [x] **4. Global Site Hookup**
  - [x] Update Navbar, Footer, Floating WhatsApp, and Contact Page to pull `AppSetting` data.
