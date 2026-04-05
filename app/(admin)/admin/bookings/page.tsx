import { prisma } from '@/lib/prisma';
import { BookingGrid } from '@/components/admin/BookingGrid';

export const metadata = {
  title: 'Manage Bookings | Mike Beauty Studio Admin',
};

// Force dynamic rendering to ensure fresh data whenever the admin checks it
export const dynamic = 'force-dynamic';

export default async function AdminBookingsPage() {
  
  // Fetch all bookings, newest first — include client and service
  const bookings = await prisma.booking.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      client: {
        select: { name: true, phone: true }
      },
      service: {
        select: {
          name: true,
          price: true,
        }
      }
    }
  });

  // Fetch active Staff Users for the booking conversion modal
  const staff = await prisma.user.findMany({
    where: { role: 'WORKER' },
    select: { id: true, name: true }
  });

  return (
    <div className="animate-fade-in-up flex flex-col h-[calc(100vh-80px)] pt-2 md:pt-4">
      {/* Compact Header optimized for vertical space */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <h1 className="font-playfair text-xl sm:text-2xl" style={{ color: 'var(--admin-text-primary)' }}>
          Booking Requests
        </h1>
        <div className="flex items-center gap-2 px-3 py-1 lg:px-4 lg:py-2 rounded-full border border-white/10" style={{ background: 'var(--admin-surface)' }}>
          <span className="font-sans text-xs tracking-wider uppercase opacity-50" style={{ color: 'var(--admin-text-muted)' }}>Total</span>
          <span className="font-semibold font-sans text-sm sm:text-base" style={{ color: 'var(--admin-text-primary)' }}>{bookings.length}</span>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <BookingGrid initialBookings={bookings} staff={staff} />
      </div>
      
    </div>
  );
}
