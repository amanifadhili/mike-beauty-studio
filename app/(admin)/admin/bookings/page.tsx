import { prisma } from '@/lib/prisma';
import { BookingKanban } from '@/components/admin/BookingKanban';
import { PageHeader } from '@/components/ui';

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

      <div className="h-[calc(100vh-200px)]">
        <BookingKanban initialBookings={bookings} staff={staff} />
      </div>
      
    </div>
  );
}
