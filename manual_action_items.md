# Remaining Manual SEO Tasks

This is your exact, step-by-step checklist to finalize the SEO infrastructure we just built. **Every item below requires action from you as the business owner.**

### 1. Database Configuration (Required for Schema & Layout)
I have wired the website to pull your business data dynamically. You must ensure these exact keys exist in your **Admin Dashboard Settings** (or directly in your database's `AppSetting` table) with accurate values:
- [ ] `STUDIO_ADDRESS` *(e.g., "Kigali Heights, KG 7 Ave, Kigali, Rwanda")*
- [ ] `PHONE_NUMBER` *(e.g., "+250780000000")*
- [ ] `WHATSAPP_NUMBER` *(Optional)*
- [ ] `SEO_TITLE` *(e.g., "Mike Beauty Studio | Premium Lash Extensions in Kigali")*
- [ ] `SEO_DESCRIPTION` *(e.g., "Award-winning luxury beauty studio offering eyelashes... ")*

### 2. Google Business Profile (Local SEO)
Google Maps is critical for local salons. We need to link the physical map location to the new website structure.
- [ ] Go to [Google Business Profile](https://www.google.com/business/) and Claim "Mike Beauty Studio".
- [ ] Set your **Business Name** to exactly `Mike Beauty Studio`.
- [ ] Set your **Address** to match `STUDIO_ADDRESS` exactly.
- [ ] Set your **Phone** to match `PHONE_NUMBER` exactly.
- [ ] Add your Website URL: `https://mikebeautystudio.com`
- [ ] Add your Booking URL: `https://mikebeautystudio.com/booking`

### 3. Google Search Console (Indexing)
This connects your website directly to Google's indexing engine.
- [ ] Go to [Google Search Console](https://search.google.com/search-console).
- [ ] Click **Add Property** -> **URL Prefix** -> Enter `https://mikebeautystudio.com`.
- [ ] Under verification methods, choose **HTML Tag**.
- [ ] Copy the random string of letters/numbers inside the `content="..."` portion of the code provided.
- [ ] Open your **Admin Dashboard**. Create or edit the setting key: `GSC_VERIFICATION_ID`.
- [ ] Paste the random string into the value and save. 
- [ ] Wait 60 seconds, then return to Google Search Console and click **Verify**.

### 4. Google Analytics 4 (Traffic Tracking)
We built an optimized, non-blocking GA4 loader. It just needs your ID.
- [ ] Go to [Google Analytics](https://analytics.google.com/).
- [ ] Create a property for "Mike Beauty Studio".
- [ ] Find your **Measurement ID** (It starts with "G-", e.g., `G-W32DFX1X`).
- [ ] Open your **Admin Dashboard**. Create or edit the setting key: `GA_TRACKING_ID`.
- [ ] Paste your Measurement ID as the value and save.

### 5. Ongoing Content Habits (Owner Routine)
To keep the SEO engine running smoothly over time:
- [ ] **Collect Reviews**: Ask clients to leave reviews on the `/review` page. When the database accumulates 3+ approved reviews, the website automatically creates Star Ratings on Google Search!
