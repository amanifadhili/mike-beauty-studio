import { prisma } from '@/lib/prisma';
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
    <div className="animate-fade-in-up space-y-6">
      
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[11px] font-sans uppercase tracking-[0.2em] text-gold/70 mb-1">Admin Dashboard</p>
          <h1 className="font-playfair text-3xl text-white">Booking Requests</h1>
          <p className="text-gray-600 text-sm font-sans mt-1">Manage all incoming client requests and update their status.</p>
        </div>
        <div className="flex items-center gap-2 bg-[#161616] border border-white/[0.06] px-4 py-2 rounded-lg">
          <span className="text-gray-600 font-sans text-xs">Total</span>
          <span className="text-white font-semibold font-sans">{bookings.length}</span>
        </div>
      </div>

      <BookingTable initialBookings={bookings} />
      
    </div>
  );
}
