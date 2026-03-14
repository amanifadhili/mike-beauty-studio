/**
 * Mike Beauty Studio — Full Test Seed
 * ====================================
 * Populates ALL tables with realistic data for pre-deployment testing.
 * Images use Pexels CDN (free, consistent, beauty-focused, no 404s).
 * Run with: npx prisma db seed
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// ---------------------------------------------------------------------------
// Pexels image URLs (beauty/lash/makeup themed, all verified accessible)
// ---------------------------------------------------------------------------
const IMAGES = {
  lash_classic_1:  'https://images.pexels.com/photos/3997991/pexels-photo-3997991.jpeg?auto=compress&cs=tinysrgb&w=800',
  lash_classic_2:  'https://images.pexels.com/photos/3986970/pexels-photo-3986970.jpeg?auto=compress&cs=tinysrgb&w=800',
  lash_volume_1:   'https://images.pexels.com/photos/2773977/pexels-photo-2773977.jpeg?auto=compress&cs=tinysrgb&w=800',
  lash_volume_2:   'https://images.pexels.com/photos/2997374/pexels-photo-2997374.jpeg?auto=compress&cs=tinysrgb&w=800',
  lash_hybrid:     'https://images.pexels.com/photos/1580267/pexels-photo-1580267.jpeg?auto=compress&cs=tinysrgb&w=800',
  lash_mega:       'https://images.pexels.com/photos/3997384/pexels-photo-3997384.jpeg?auto=compress&cs=tinysrgb&w=800',
  brow_1:          'https://images.pexels.com/photos/2697787/pexels-photo-2697787.jpeg?auto=compress&cs=tinysrgb&w=800',
  brow_2:          'https://images.pexels.com/photos/3764013/pexels-photo-3764013.jpeg?auto=compress&cs=tinysrgb&w=800',
  makeup_1:        'https://images.pexels.com/photos/1382733/pexels-photo-1382733.jpeg?auto=compress&cs=tinysrgb&w=800',
  makeup_2:        'https://images.pexels.com/photos/2531533/pexels-photo-2531533.jpeg?auto=compress&cs=tinysrgb&w=800',
  makeup_3:        'https://images.pexels.com/photos/1961792/pexels-photo-1961792.jpeg?auto=compress&cs=tinysrgb&w=800',
  nail_1:          'https://images.pexels.com/photos/3997386/pexels-photo-3997386.jpeg?auto=compress&cs=tinysrgb&w=800',
  nail_2:          'https://images.pexels.com/photos/704815/pexels-photo-704815.jpeg?auto=compress&cs=tinysrgb&w=800',
  beauty_salon_1:  'https://images.pexels.com/photos/3622608/pexels-photo-3622608.jpeg?auto=compress&cs=tinysrgb&w=800',
  beauty_salon_2:  'https://images.pexels.com/photos/3738350/pexels-photo-3738350.jpeg?auto=compress&cs=tinysrgb&w=800',
  portrait_1:      'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=800',
  portrait_2:      'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=800',
  skincare_1:      'https://images.pexels.com/photos/3764583/pexels-photo-3764583.jpeg?auto=compress&cs=tinysrgb&w=800',
  tools_1:         'https://images.pexels.com/photos/3997989/pexels-photo-3997989.jpeg?auto=compress&cs=tinysrgb&w=800',
  studio_1:        'https://images.pexels.com/photos/3997385/pexels-photo-3997385.jpeg?auto=compress&cs=tinysrgb&w=800',
};

// ---------------------------------------------------------------------------
// Helper: random date N days from now (offset can be negative = past)
// ---------------------------------------------------------------------------
function daysFromNow(offset: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d;
}

async function main() {
  console.log('\n🌱 Starting full test seed...\n');

  // ── 0. Clear existing data (order matters due to FK constraints) ──────────
  console.log('  ↳ Clearing existing records...');
  await prisma.appSetting.deleteMany();
  await prisma.review.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.media.deleteMany();
  await prisma.service.deleteMany();

  // ── 1. Admin User ──────────────────────────────────────────────────────────
  const adminEmail    = process.env.ADMIN_EMAIL    || 'admin@mikebeautystudio.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Password123!';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where:  { email: adminEmail },
    update: { password: hashedPassword },
    create: { email: adminEmail, name: 'Studio Admin', password: hashedPassword, role: 'ADMIN' },
  });
  console.log(`  ✔ Admin user: ${admin.email} (password: ${adminPassword})`);

  // ── 2. Services ──────────────────────────────────────────────────────────
  console.log('  ↳ Creating services + service media...');
  const servicesData = [
    {
      name: 'Classic Full Set',
      description: 'A 1:1 lash application for a natural, elegant mascara-like finish. Perfect for first-timers or those who prefer an understated, everyday look.',
      price: 35000,
      duration: '2 hours',
      active: true,
      medias: { create: [
        { url: IMAGES.lash_classic_1, type: 'image', category: 'Classic' },
        { url: IMAGES.lash_classic_2, type: 'image', category: 'Classic' },
      ]},
    },
    {
      name: 'Hybrid Full Set',
      description: 'A balanced mix of classic and volume lashes for a textured, fluffy, multi-dimensional look. Great for special occasions.',
      price: 47000,
      duration: '2.5 hours',
      active: true,
      medias: { create: [
        { url: IMAGES.lash_hybrid,  type: 'image', category: 'Hybrid' },
        { url: IMAGES.lash_volume_1, type: 'image', category: 'Hybrid' },
      ]},
    },
    {
      name: 'Light Volume Set',
      description: '2D-4D volume fans applied to each natural lash for a soft, fuller appearance without the dramatic weight of mega volume.',
      price: 52000,
      duration: '2.5 hours',
      active: true,
      medias: { create: [
        { url: IMAGES.lash_volume_2, type: 'image', category: 'Volume' },
        { url: IMAGES.lash_mega,     type: 'image', category: 'Volume' },
      ]},
    },
    {
      name: 'Mega Volume Set',
      description: '5D-16D ultra-fine volume fans for maximum fullness and drama. The darkest, most glamorous lash experience we offer.',
      price: 68000,
      duration: '3 hours',
      active: true,
      medias: { create: [
        { url: IMAGES.lash_mega,    type: 'image', category: 'Mega Volume' },
        { url: IMAGES.studio_1,     type: 'image', category: 'Mega Volume' },
      ]},
    },
    {
      name: 'Eyebrow Design & Tinting',
      description: 'Professional brow mapping, threading, and tinting customized to your face shape. Achieve defined, natural-looking brows that frame your eyes perfectly.',
      price: 18000,
      duration: '45 mins',
      active: true,
      medias: { create: [
        { url: IMAGES.brow_1, type: 'image', category: 'Brows' },
        { url: IMAGES.brow_2, type: 'image', category: 'Brows' },
      ]},
    },
    {
      name: 'Bridal Glam Makeup',
      description: 'Full luxury bridal makeup service including skin prep, airbrush foundation, eye design, and long-lasting setting. Free trial session included.',
      price: 120000,
      duration: '4 hours',
      active: true,
      medias: { create: [
        { url: IMAGES.makeup_1, type: 'image', category: 'Makeup' },
        { url: IMAGES.makeup_3, type: 'image', category: 'Makeup' },
      ]},
    },
    {
      name: 'Lash Removal',
      description: 'Safe and gentle professional removal of all lash extension types using a specially formulated solvent. Includes lash conditioning treatment.',
      price: 10000,
      duration: '30 mins',
      active: true,
    },
    {
      name: 'Lash Refill (2–3 Weeks)',
      description: 'Refresh your existing lash set with a precision infill to replace any grown-out or shed extensions, restoring fullness and shape.',
      price: 25000,
      duration: '1.5 hours',
      active: true,
    },
  ];

  const createdServices: { id: string; name: string }[] = [];
  for (const s of servicesData) {
    const svc = await prisma.service.create({ data: s });
    createdServices.push({ id: svc.id, name: svc.name });
    console.log(`    ✔ Service: "${svc.name}"`);
  }

  // ── 3. Standalone Gallery Media ──────────────────────────────────────────
  console.log('  ↳ Creating standalone gallery media...');
  const classicService   = createdServices.find(s => s.name === 'Classic Full Set')!;
  const hybridService    = createdServices.find(s => s.name === 'Hybrid Full Set')!;
  const volumeService    = createdServices.find(s => s.name === 'Light Volume Set')!;
  const megaService      = createdServices.find(s => s.name === 'Mega Volume Set')!;
  const browService      = createdServices.find(s => s.name === 'Eyebrow Design & Tinting')!;
  const makeupService    = createdServices.find(s => s.name === 'Bridal Glam Makeup')!;

  const galleryMedia = [
    // Classic gallery shots
    { url: IMAGES.portrait_1,      type: 'image', category: 'Classic',     serviceId: classicService.id },
    { url: IMAGES.portrait_2,      type: 'image', category: 'Classic',     serviceId: classicService.id },
    // Hybrid shots
    { url: IMAGES.makeup_2,        type: 'image', category: 'Hybrid',      serviceId: hybridService.id },
    // Volume
    { url: IMAGES.skincare_1,      type: 'image', category: 'Volume',      serviceId: volumeService.id },
    // Mega
    { url: IMAGES.tools_1,         type: 'image', category: 'Mega Volume', serviceId: megaService.id },
    // Brows
    { url: IMAGES.beauty_salon_1,  type: 'image', category: 'Brows',       serviceId: browService.id },
    // Makeup
    { url: IMAGES.beauty_salon_2,  type: 'image', category: 'Makeup',      serviceId: makeupService.id },
    { url: IMAGES.nail_1,          type: 'image', category: 'Nails',        serviceId: null },
    { url: IMAGES.nail_2,          type: 'image', category: 'Nails',        serviceId: null },
    { url: IMAGES.studio_1,        type: 'image', category: 'Studio',       serviceId: null },
  ];

  await prisma.media.createMany({ data: galleryMedia });
  console.log(`    ✔ ${galleryMedia.length} gallery items created`);

  // ── 4. Bookings ──────────────────────────────────────────────────────────
  console.log('  ↳ Creating booking requests...');
  const classicId  = classicService.id;
  const hybridId   = hybridService.id;
  const volumeId   = volumeService.id;
  const megaId     = megaService.id;
  const browId     = browService.id;
  const makeupId   = makeupService.id;
  const removalId  = createdServices.find(s => s.name === 'Lash Removal')!.id;
  const refillId   = createdServices.find(s => s.name === 'Lash Refill (2–3 Weeks)')!.id;

  const bookings = [
    // Pending / new requests
    {
      name: 'Aisha Niyonkuru', phone: '+250788123456',
      preferredDate: daysFromNow(3),  preferredTime: '10:00 AM',
      serviceId: classicId, status: 'NEW',
      notes: 'First time getting lashes. Would prefer a natural look.',
    },
    {
      name: 'Grace Uwase', phone: '+250722987654',
      preferredDate: daysFromNow(5),  preferredTime: '02:00 PM',
      serviceId: hybridId, status: 'NEW',
      notes: null,
    },
    {
      name: 'Claudette Mukamana', phone: '+250789345678',
      preferredDate: daysFromNow(7),  preferredTime: '11:00 AM',
      serviceId: megaId, status: 'NEW',
      notes: 'I have sensitive eyes. Please let me know what products you use.',
    },
    {
      name: 'Sandrine Ingabire', phone: '+250738456789',
      preferredDate: daysFromNow(2),  preferredTime: '09:00 AM',
      serviceId: browId, status: 'NEW',
      notes: null,
    },
    // Confirmed appointments
    {
      name: 'Diane Kaneza', phone: '+250722111222',
      preferredDate: daysFromNow(1),  preferredTime: '03:00 PM',
      serviceId: volumeId, status: 'CONFIRMED',
      notes: 'Confirmed via WhatsApp. She is bridal party prep.',
    },
    {
      name: 'Yvonne Habimana', phone: '+250788333444',
      preferredDate: daysFromNow(4),  preferredTime: '01:00 PM',
      serviceId: makeupId, status: 'CONFIRMED',
      notes: 'Wedding on Saturday. Bridal trial confirmed for today.',
    },
    {
      name: 'Patricia Murebwayire', phone: '+250728555666',
      preferredDate: daysFromNow(6),  preferredTime: '10:30 AM',
      serviceId: refillId, status: 'CONFIRMED',
      notes: '3-week refill. Previous set was Hybrid.',
    },
    // Completed bookings (past)
    {
      name: 'Jacqueline Nzeyimana', phone: '+250784777888',
      preferredDate: daysFromNow(-3), preferredTime: '11:00 AM',
      serviceId: classicId, status: 'COMPLETED',
      notes: null,
    },
    {
      name: 'Flavia Uwimana', phone: '+250788999000',
      preferredDate: daysFromNow(-7), preferredTime: '02:30 PM',
      serviceId: megaId, status: 'COMPLETED',
      notes: 'Client loved the result. Booked next refill.',
    },
    {
      name: 'Esperance Ishimwe', phone: '+250722100200',
      preferredDate: daysFromNow(-5), preferredTime: '10:00 AM',
      serviceId: browId, status: 'COMPLETED',
      notes: null,
    },
    // Cancelled booking
    {
      name: 'Annette Rutagengwa', phone: '+250789300400',
      preferredDate: daysFromNow(-2), preferredTime: '12:00 PM',
      serviceId: removalId, status: 'CANCELLED',
      notes: 'Client cancelled 2 hours before appointment.',
    },
  ];

  for (const booking of bookings) {
    await prisma.booking.create({ data: booking });
  }
  console.log(`    ✔ ${bookings.length} bookings created (4 NEW, 3 CONFIRMED, 3 COMPLETED, 1 CANCELLED)`);

  // ── 5. Reviews ──────────────────────────────────────────────────────────
  console.log('  ↳ Creating reviews...');
  const reviews = [
    {
      name: 'Diane K.', rating: 5,
      comment: 'Absolutely stunning work! My lashes have never looked this good. The attention to detail and the care taken throughout the appointment made me feel so pampered. Will definitely be back for my refill!',
      approved: true,
    },
    {
      name: 'Grace U.', rating: 5,
      comment: 'Mike Beauty Studio is hands down the best lash studio in Kigali. The hybrid set I got lasted over 5 weeks with minimal shedding. Professional, clean, and luxurious environment.',
      approved: true,
    },
    {
      name: 'Sandrine I.', rating: 5,
      comment: 'The eyebrow tinting was exactly what I needed. My brows look so defined and natural at the same time. Quick, painless, and affordable!',
      approved: true,
    },
    {
      name: 'Flavia U.', rating: 4,
      comment: 'Mega volume is no joke — these lashes made me feel like a celebrity! Would have given 5 stars but had to wait 10 minutes past my appointment time. The result made up for it though.',
      approved: true,
    },
    {
      name: 'Jacqueline N.', rating: 5,
      comment: 'I was nervous getting lashes for the first time but the team made me feel so comfortable. The classic set is perfect for work — natural and polished. 100% recommend!',
      approved: true,
    },
    // Pending approval review (good for testing the approval flow if you build one)
    {
      name: 'Anonymous Client', rating: 3,
      comment: 'Good work overall, but I wish there were more time slots available on weekends.',
      approved: false,
    },
  ];

  await prisma.review.createMany({ data: reviews });
  console.log(`    ✔ ${reviews.length} reviews created (5 approved, 1 pending)`);

  // ── 6. App Settings ─────────────────────────────────────────────────────
  console.log('  ↳ Creating app settings...');
  const settings = [
    // ── GENERAL ──
    { key: 'STUDIO_NAME',        value: 'Mike Beauty Studio',                                    category: 'GENERAL' },
    { key: 'STUDIO_ADDRESS',     value: 'KG 11 Ave, Kacyiru, Kigali, Rwanda',                    category: 'GENERAL' },
    { key: 'STUDIO_PHONE',       value: '+250 788 123 456',                                      category: 'GENERAL' },
    { key: 'STUDIO_EMAIL',       value: 'hello@mikebeautystudio.com',                            category: 'GENERAL' },
    { key: 'STUDIO_HOURS',       value: 'Mon – Sat: 8:00 AM – 7:00 PM  |  Sun: 10:00 AM – 4:00 PM', category: 'GENERAL' },
    { key: 'WHATSAPP_NUMBER',    value: '250788123456',                                          category: 'GENERAL' },
    { key: 'WHATSAPP_MESSAGE',   value: 'Hello! I would like to book an appointment at Mike Beauty Studio. Please advise on availability.', category: 'GENERAL' },

    // ── BOOKING ──
    { key: 'DEPOSIT_REQUIRED',   value: 'true',                                                  category: 'BOOKING' },
    { key: 'DEPOSIT_AMOUNT',     value: '5000',                                                  category: 'BOOKING' },
    { key: 'CANCELLATION_HOURS', value: '24',                                                    category: 'BOOKING' },
    { key: 'MAX_BOOKING_DAYS',   value: '30',                                                    category: 'BOOKING' },
    { key: 'BOOKING_NOTE',       value: 'Please arrive 5 minutes before your appointment. Patch tests may be required for new clients.', category: 'BOOKING' },

    // ── SOCIAL / SEO ──
    { key: 'INSTAGRAM_URL',      value: 'https://instagram.com/mikebeautystudio',                category: 'SOCIAL' },
    { key: 'FACEBOOK_URL',       value: 'https://facebook.com/mikebeautystudio',                 category: 'SOCIAL' },
    { key: 'TIKTOK_URL',         value: 'https://tiktok.com/@mikebeautystudio',                  category: 'SOCIAL' },
    { key: 'SEO_DESCRIPTION',    value: 'Mike Beauty Studio — Kigali\'s premier destination for luxury lash extensions, eyebrow design, and bridal makeup. Book your appointment today.', category: 'SOCIAL' },
    { key: 'SEO_KEYWORDS',       value: 'lash extensions Kigali, beauty studio Rwanda, eyelash extensions Kigali, mega volume lashes, hybrid lashes, bridal makeup Kigali', category: 'SOCIAL' },
  ];

  await prisma.appSetting.createMany({ data: settings });
  console.log(`    ✔ ${settings.length} app settings populated`);

  // ── Summary ──────────────────────────────────────────────────────────────
  console.log(`
  ─────────────────────────────────────────
  ✅ Seed Complete!

  Admin Login:
     Email:    ${adminEmail}
     Password: ${adminPassword}

  Data Created:
     Services:  ${createdServices.length}
     Gallery:   ${galleryMedia.length + servicesData.flatMap(s => (s as any).medias?.create || []).length} items
     Bookings:  ${bookings.length} (4 NEW · 3 CONFIRMED · 3 COMPLETED · 1 CANCELLED)
     Reviews:   ${reviews.length} (5 approved · 1 pending)
     Settings:  ${settings.length} keys
  ─────────────────────────────────────────
  `);
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
