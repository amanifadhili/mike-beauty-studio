# Phase 4: Public Website - Homepage & 3D Hero (Implementation Checklist)

**Goal:** Deliver the 5-second "Wow" factor through the Public Website Homepage & 3D Hero.

- [x] **1. Create the 3D Hero Section** (`components/home/Hero.tsx`)
  - [x] Scaffold the full-screen section with luxury typography.
  - [x] Implement `three.js` subtle floating particle effect.
  - [x] Add the primary "Book Appointment" CTA button.

- [x] **2. Services Preview Section** (`components/home/ServicesPreview.tsx`)
  - [x] Create the Server Component to fetch data via `getServices()`.
  - [x] Build the layout grid for the Service Cards.
  - [x] Implement GSAP `ScrollTrigger` staggered reveal animations.

- [x] **3. Interactive Before/After Slider** (`components/home/BeforeAfterSlider.tsx`)
  - [x] Build the image overlay structure.
  - [x] Implement touch/mouse drag logic for the reveal handle.
  - [x] Style the handle to match the luxury aesthetic (Gold/Cream).

- [x] **4. Client Reviews Carousel** (`components/home/ReviewsCarousel.tsx`)
  - [x] Structure the testimonial cards.
  - [x] Implement smooth horizontal scrolling or GSAP infinite loop.

- [x] **5. Main Homepage Assembly** (`app/page.tsx`)
  - [x] Clear Next.js boilerplate.
  - [x] Import and assemble `Hero`, `ServicesPreview`, `BeforeAfterSlider`, and `ReviewsCarousel`.
  - [x] Perform final visual and interactive QA on the assembled page.
