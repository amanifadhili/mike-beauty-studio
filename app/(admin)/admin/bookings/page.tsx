import { prisma } from '@/lib/prisma';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { BookingTable } from '@/components/admin/BookingTable';

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

  return (
    <div className="animate-fade-in-up space-y-8">
      
      <div className="flex justify-between items-end">
        <SectionHeading 
          title="Booking Requests"
          subtitle="Manage all incoming client requests and update their confirmation status."
        />
        <div className="mb-8 font-sans text-sm text-gray-400 bg-[#1a1a1a] px-4 py-2 border border-white/5">
          Total: <span className="text-white font-medium">{bookings.length}</span>
        </div>
      </div>

      <BookingTable initialBookings={bookings} />
      
    </div>
  );
}
