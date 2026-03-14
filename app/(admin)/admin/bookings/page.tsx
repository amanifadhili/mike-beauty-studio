import { prisma } from '@/lib/prisma';
import { BookingTable } from '@/components/admin/BookingTable';
import { PageHeader } from '@/components/ui';

export const metadata = {
  title: 'Manage Bookings | Mike Beauty Studio Admin',
};

// Force dynamic rendering to ensure fresh data whenever the admin checks it
export const dynamic = 'force-dynamic';

export default async function AdminBookingsPage() {
  
  // Fetch all bookings, newest first
  const bookings = await prisma.booking.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      service: {
        select: {
          name: true,
          price: true,
        }
      }
    }
  });

  // Fetch active workers for the conversion modal
  const workers = await prisma.worker.findMany({
    where: { status: 'ACTIVE' },
    include: { user: { select: { name: true } } }
  });

  return (
    <div className="animate-fade-in-up space-y-6">
      <PageHeader
        title="Booking Requests"
        subtitle="Manage all incoming client requests and update their status."
        right={
          <div className="admin-card flex items-center gap-2 px-4 py-2">
            <span className="font-sans text-xs" style={{ color: 'var(--admin-text-muted)' }}>Total</span>
            <span className="font-semibold font-sans" style={{ color: 'var(--admin-text-primary)' }}>{bookings.length}</span>
          </div>
        }
      />

      <BookingTable initialBookings={bookings} workers={workers} />
      
    </div>
  );
}
