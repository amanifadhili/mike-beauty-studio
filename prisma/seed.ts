/**
 * Mike Beauty Studio — Full Test Seed (Rev 2 - Normalized)
 * ====================================
 * Populates ALL tables with realistic data for pre-deployment testing.
 * Updated to match the unified User/Worker model and strict Enums.
 * Run with: npx prisma db seed
 */

import { PrismaClient, Role, CommissionType, UserStatus, BookingStatus, TransactionSource, PaymentMethod, ExpenseCategory, AdvanceStatus } from '@prisma/client';
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// ---------------------------------------------------------------------------
// Pexels image URLs (beauty/lash/makeup themed, all verified accessible)
// ---------------------------------------------------------------------------
const IMAGES = {
  lash_classic_1:  '/portfolio/lash_classic_1.png',
  lash_classic_2:  '/portfolio/lash_classic_2.png',
  lash_volume_1:   '/portfolio/lash_mega_1.png',
  lash_volume_2:   '/hero/hero_image_four.png',
  lash_hybrid:     '/portfolio/lash_hybrid_1.png',
  lash_mega:       '/portfolio/lash_mega_1.png',
  brow_1:          '/portfolio/brow_1.png',
  brow_2:          '/portfolio/brow_2.png',
  makeup_1:        '/portfolio/makeup_bridal_1.png',
  makeup_2:        '/portfolio/makeup_bridal_2.png',
  makeup_3:        '/hero/hero_image_three.png',
  nail_1:          '/hero/hero_image_four.png',
  nail_2:          '/hero/hero_image_one.png',
  beauty_salon_1:  '/hero/hero_image_two.png',
  beauty_salon_2:  '/hero/hero_image_three.png',
  portrait_1:      '/hero/hero_image_four.png',
  portrait_2:      '/hero/hero_image_one.png',
  skincare_1:      '/hero/hero_image_two.png',
  tools_1:         '/hero/hero_image_one.png',
  studio_1:        '/hero/hero_image_two.png',
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
  await prisma.auditLog.deleteMany();
  await prisma.clientCredit.deleteMany();
  await prisma.workerAdvance.deleteMany();
  await prisma.workerPayment.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.expense.deleteMany();
  
  await prisma.appSetting.deleteMany();
  await prisma.review.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.media.deleteMany();
  await prisma.service.deleteMany();
  await prisma.client.deleteMany();
  await prisma.user.deleteMany();

  // ── 1. Unified Users (Admin & Workers) ─────────────────────────────────────
  console.log('  ↳ Creating unified users...');
  const adminEmail    = process.env.ADMIN_EMAIL    || 'admin@mikebeautystudio.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Password123!';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.create({
    data: { 
      email: adminEmail, 
      name: 'Studio Admin', 
      password: hashedPassword, 
      role: Role.ADMIN,
      phone: '+250788999000',
      roleTitle: 'Owner / Manager',
      commissionType: CommissionType.PERCENTAGE,
      commissionRate: 100, // Owner takes 100% of their own services
      status: UserStatus.ACTIVE,
      balance: 0
    },
  });
  console.log(`    ✔ Admin user: ${admin.email}`);

  const worker1 = await prisma.user.create({
    data: { 
      email: 'sarah@mikebeautystudio.com', 
      name: 'Sarah', 
      password: hashedPassword, 
      role: Role.WORKER,
      phone: '+250788111222', 
      roleTitle: 'Lash Technician', 
      commissionType: CommissionType.PERCENTAGE, 
      commissionRate: 40, 
      balance: 120000 
    }
  });

  const worker2 = await prisma.user.create({
    data: { 
      email: 'anna@mikebeautystudio.com', 
      name: 'Anna', 
      password: hashedPassword, 
      role: Role.WORKER,
      phone: '+250788333444', 
      roleTitle: 'Lash Technician', 
      commissionType: CommissionType.FIXED, 
      commissionRate: 15000, 
      balance: 50000 
    }
  });
  console.log(`    ✔ 2 Workers created (Sarah, Anna)`);


  // ── 2. Clients ─────────────────────────────────────────────────────────────
  console.log('  ↳ Creating clients...');
  const client1 = await prisma.client.create({ data: { name: 'Aisha Niyonkuru', phone: '+250788123456' } });
  const client2 = await prisma.client.create({ data: { name: 'Grace Uwase', phone: '+250722987654' } });
  const client3 = await prisma.client.create({ data: { name: 'Diane Kaneza', phone: '+250722111222' } });
  const client4 = await prisma.client.create({ data: { name: 'Jacqueline Nzeyimana', phone: '+250784777888' } });
  const client5 = await prisma.client.create({ data: { name: 'Annette Rutagengwa', phone: '+250789300400' } });
  const walkin1 = await prisma.client.create({ data: { name: 'Walk-In Client 1', phone: '+250780000001' } });
  const walkin2 = await prisma.client.create({ data: { name: 'Walk-In Client 2', phone: '+250780000002' } });
  console.log(`    ✔ 7 Clients created`);

  // ── 3. Services ──────────────────────────────────────────────────────────
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
    const slug = s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const svc = await prisma.service.create({ data: { ...s, slug } });
    createdServices.push({ id: svc.id, name: svc.name });
    console.log(`    ✔ Service: "${svc.name}"`);
  }

  // ── 4. Standalone Gallery Media ──────────────────────────────────────────
  console.log('  ↳ Creating standalone gallery media...');
  const classicId  = createdServices.find(s => s.name === 'Classic Full Set')!.id;
  const hybridId   = createdServices.find(s => s.name === 'Hybrid Full Set')!.id;
  const volumeId   = createdServices.find(s => s.name === 'Light Volume Set')!.id;
  const megaId     = createdServices.find(s => s.name === 'Mega Volume Set')!.id;
  const browId     = createdServices.find(s => s.name === 'Eyebrow Design & Tinting')!.id;
  const makeupId   = createdServices.find(s => s.name === 'Bridal Glam Makeup')!.id;
  const removalId  = createdServices.find(s => s.name === 'Lash Removal')!.id;
  const refillId   = createdServices.find(s => s.name === 'Lash Refill (2–3 Weeks)')!.id;

  const galleryMedia = [
    { url: IMAGES.portrait_1,      type: 'image', category: 'Classic',     serviceId: classicId },
    { url: IMAGES.portrait_2,      type: 'image', category: 'Classic',     serviceId: classicId },
    { url: IMAGES.makeup_2,        type: 'image', category: 'Hybrid',      serviceId: hybridId },
    { url: IMAGES.skincare_1,      type: 'image', category: 'Volume',      serviceId: volumeId },
    { url: IMAGES.tools_1,         type: 'image', category: 'Mega Volume', serviceId: megaId },
    { url: IMAGES.beauty_salon_1,  type: 'image', category: 'Brows',       serviceId: browId },
    { url: IMAGES.beauty_salon_2,  type: 'image', category: 'Makeup',      serviceId: makeupId },
    { url: IMAGES.nail_1,          type: 'image', category: 'Nails',        serviceId: null },
    { url: IMAGES.nail_2,          type: 'image', category: 'Nails',        serviceId: null },
    { url: IMAGES.studio_1,        type: 'image', category: 'Studio',       serviceId: null },
  ];

  await prisma.media.createMany({ data: galleryMedia });
  console.log(`    ✔ ${galleryMedia.length} gallery items created`);

  // ── 5. Bookings & Transactions ──────────────────────────────────────────
  console.log('  ↳ Creating booking requests and transactions...');

  const bookings = [
    {
      clientId: client1.id,
      preferredDate: daysFromNow(3),  preferredTime: '10:00 AM',
      serviceId: classicId, status: BookingStatus.NEW, depositPaid: 5000,
      notes: 'First time getting lashes. Would prefer a natural look.',
    },
    {
      clientId: client2.id,
      preferredDate: daysFromNow(5),  preferredTime: '02:00 PM',
      serviceId: hybridId, status: BookingStatus.NEW, depositPaid: 5000,
      notes: null,
    },
    {
      clientId: client3.id,
      preferredDate: daysFromNow(1),  preferredTime: '03:00 PM',
      serviceId: volumeId, status: BookingStatus.SCHEDULED, depositPaid: 5000,
      notes: 'Confirmed via WhatsApp. She is bridal party prep.',
    },
    {
      clientId: client4.id,
      preferredDate: daysFromNow(-3), preferredTime: '11:00 AM',
      serviceId: classicId, status: BookingStatus.CONVERTED, depositPaid: 5000,
      notes: null,
    },
    {
      clientId: client5.id,
      preferredDate: daysFromNow(-2), preferredTime: '12:00 PM',
      serviceId: removalId, status: BookingStatus.CANCELLED, depositPaid: 0,
      notes: 'Client cancelled 2 hours before appointment.',
    },
  ];

  for (const booking of bookings) {
    const b = await prisma.booking.create({ data: booking });
    
    // If it's converted, create a historical transaction for it.
    if (b.status === BookingStatus.CONVERTED) {
       await prisma.transaction.create({
         data: {
           clientId: b.clientId,
           serviceId: b.serviceId,
           userId: worker1.id,
           bookingId: b.id,
           price: 35000, // Total price
           workerCommission: 14000,
           salonShare: 21000,
           paymentMethod: PaymentMethod.CASH,
           source: TransactionSource.BOOKING,
           date: b.preferredDate
         }
       })
    }
  }

  // Add some walk-in transactions
  await prisma.transaction.create({
     data: {
       clientId: walkin1.id,
       serviceId: hybridId,
       userId: worker2.id,
       price: 47000,
       workerCommission: 15000, // Fixed
       salonShare: 32000,
       paymentMethod: PaymentMethod.MOBILE_MONEY,
       source: TransactionSource.WALK_IN,
       date: daysFromNow(-1)
     }
  });

  await prisma.transaction.create({
     data: {
       clientId: walkin2.id,
       serviceId: megaId,
       userId: worker1.id,
       price: 68000,
       workerCommission: 27200, // 40%
       salonShare: 40800,
       paymentMethod: PaymentMethod.BANK_TRANSFER,
       source: TransactionSource.WALK_IN,
       date: daysFromNow(-2)
     }
  });

  console.log(`    ✔ Bookings and Transactions generated.`);

  // ── 6. Financials (Expenses, Advances, etc.) ──────────────────────────────────────────
  console.log('  ↳ Creating financials (Expenses, Advances)...');
  
  // Create expenses first so we can link them to payouts
  const exp1 = await prisma.expense.create({ data: { title: 'Lash Supplies (Glue, Tape)', amount: 45000, category: ExpenseCategory.SUPPLIES, date: daysFromNow(-4) } });
  const exp2 = await prisma.expense.create({ data: { title: 'Internet Bill', amount: 30000, category: ExpenseCategory.UTILITIES, date: daysFromNow(-10) } });
  const exp3 = await prisma.expense.create({ data: { title: 'Rent (Partial)', amount: 200000, category: ExpenseCategory.RENT, date: daysFromNow(-15) } });
  const payoutExp = await prisma.expense.create({ data: { title: 'Worker Payout: Anna', amount: 100000, category: ExpenseCategory.WORKER_PAYOUT, date: daysFromNow(-7) } });

  await prisma.workerAdvance.create({
    data: { userId: worker1.id, amount: 20000, status: AdvanceStatus.PENDING, date: daysFromNow(-2) }
  });

  await prisma.workerPayment.create({
    data: { userId: worker2.id, expenseId: payoutExp.id, amount: 100000, date: daysFromNow(-7) }
  });

  console.log(`    ✔ Financials generated.`);

  // ── 7. Reviews ──────────────────────────────────────────────────────────
  console.log('  ↳ Creating reviews...');
  const reviews = [
    { name: 'Diane K.', rating: 5, comment: 'Absolutely stunning work! My lashes have never looked this good. The attention to detail and the care taken throughout the appointment made me feel so pampered. Will definitely be back for my refill!', approved: true },
    { name: 'Grace U.', rating: 5, comment: 'Mike Beauty Studio is hands down the best lash studio in Kigali. The hybrid set I got lasted over 5 weeks with minimal shedding. Professional, clean, and luxurious environment.', approved: true },
    { name: 'Sandrine I.', rating: 5, comment: 'The eyebrow tinting was exactly what I needed. My brows look so defined and natural at the same time. Quick, painless, and affordable!', approved: true },
    { name: 'Flavia U.', rating: 4, comment: 'Mega volume is no joke — these lashes made me feel like a celebrity! Would have given 5 stars but had to wait 10 minutes past my appointment time. The result made up for it though.', approved: true },
    { name: 'Jacqueline N.', rating: 5, comment: 'I was nervous getting lashes for the first time but the team made me feel so comfortable. The classic set is perfect for work — natural and polished. 100% recommend!', approved: true },
    { name: 'Anonymous Client', rating: 3, comment: 'Good work overall, but I wish there were more time slots available on weekends.', approved: false },
  ];

  await prisma.review.createMany({ data: reviews });
  console.log(`    ✔ ${reviews.length} reviews created (5 approved, 1 pending)`);

  // ── 8. App Settings ─────────────────────────────────────────────────────
  console.log('  ↳ Creating app settings...');
  const settings = [
    { key: 'STUDIO_NAME',        value: 'Mike Beauty Studio',                                    category: 'GENERAL' },
    { key: 'STUDIO_ADDRESS',     value: 'KG 11 Ave, Kacyiru, Kigali, Rwanda',                    category: 'GENERAL' },
    { key: 'STUDIO_PHONE',       value: '+250 788 123 456',                                      category: 'GENERAL' },
    { key: 'STUDIO_EMAIL',       value: 'hello@mikebeautystudio.com',                            category: 'GENERAL' },
    { key: 'STUDIO_HOURS',       value: 'Mon – Sat: 8:00 AM – 7:00 PM  |  Sun: 10:00 AM – 4:00 PM', category: 'GENERAL' },
    { key: 'WHATSAPP_NUMBER',    value: '250788123456',                                          category: 'GENERAL' },
    { key: 'WHATSAPP_MESSAGE',   value: 'Hello! I would like to book an appointment at Mike Beauty Studio. Please advise on availability.', category: 'GENERAL' },
    { key: 'DEPOSIT_REQUIRED',   value: 'true',                                                  category: 'BOOKING' },
    { key: 'DEPOSIT_AMOUNT',     value: '5000',                                                  category: 'BOOKING' },
    { key: 'CANCELLATION_HOURS', value: '24',                                                    category: 'BOOKING' },
    { key: 'MAX_BOOKING_DAYS',   value: '30',                                                    category: 'BOOKING' },
    { key: 'BOOKING_NOTE',       value: 'Please arrive 5 minutes before your appointment. Patch tests may be required for new clients.', category: 'BOOKING' },
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
     Clients:   7 
     Workers:   2 + Admin mapped as Worker
     Services:  ${createdServices.length}
     Bookings:  ${bookings.length} (2 NEW · 1 CONFIRMED · 1 COMPLETED · 1 CANCELLED)
     Financials Tracker Active.
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
