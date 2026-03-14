'use client';

import { useState } from 'react';
import { updateBookingStatus } from '@/app/actions/adminBookings';

// Mirroring the extended type we expect from Prisma
type BookingWithService = {
  id: string;
  name: string;
  phone: string;
  preferredDate: Date;
  preferredTime: string;
  notes: string | null;
  status: string;
  createdAt: Date;
  service: {
    name: string;
    price: number;
  };
};

export function BookingTable({ initialBookings }: { initialBookings: BookingWithService[] }) {
  const [bookings, setBookings] = useState<BookingWithService[]>(initialBookings);
  const [isUpdating, setIsUpdating] = useState<string | null>(null); // tracks ID of booking being updated

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    setIsUpdating(bookingId);
    
    // Optimistic UI update
    setBookings(prev => 
      prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b)
    );

    const result = await updateBookingStatus(bookingId, newStatus);
    
    if (!result.success) {
      // Revert on failure (simple implementation, real app might want a toast notification here)
      alert("Failed to update status.");
      setBookings(initialBookings);
    }
    
    setIsUpdating(null);
  };

  if (bookings.length === 0) {
    return (
      <div className="bg-[#1a1a1a] border border-white/5 p-12 text-center text-gray-500 font-sans">
        No booking requests found.
      </div>
    );
  }

  return (
    <div className="bg-[#1a1a1a] border border-white/5 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full font-sans text-sm text-left whitespace-nowrap">
          <thead className="text-xs text-gray-400 uppercase bg-[#222222]">
            <tr>
              <th scope="col" className="px-6 py-4">Status</th>
              <th scope="col" className="px-6 py-4">Client Details</th>
              <th scope="col" className="px-6 py-4">Service Requested</th>
              <th scope="col" className="px-6 py-4">Requested Date/Time</th>
              <th scope="col" className="px-6 py-4">Notes</th>
              <th scope="col" className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 text-xs uppercase tracking-widest rounded-full border ${
                    booking.status === 'NEW' ? 'border-amber-500/50 text-amber-500 bg-amber-500/10' :
                    booking.status === 'CONFIRMED' ? 'border-blue-500/50 text-blue-500 bg-blue-500/10' :
                    booking.status === 'COMPLETED' ? 'border-green-500/50 text-green-500 bg-green-500/10' :
                    booking.status === 'CANCELLED' ? 'border-red-500/50 text-red-500 bg-red-500/10' :
                    'border-gray-500/50 text-gray-400 bg-gray-500/10'
                  }`}>
                    {booking.status}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <div className="font-medium text-white">{booking.name}</div>
                  <div className="text-gray-400 text-xs mt-1 font-mono">
                    <a href={`https://wa.me/${booking.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="hover:text-gold transition-colors">
                      {booking.phone}
                    </a>
                  </div>
                </td>
                
                <td className="px-6 py-4 text-gray-300">
                  <div className="font-medium">{booking.service.name}</div>
                  <div className="text-gray-500 text-xs mt-1">{booking.service.price.toLocaleString()} RWF</div>
                </td>
                
                <td className="px-6 py-4 text-gray-300">
                  <div className="font-medium">{new Date(booking.preferredDate).toLocaleDateString()}</div>
                  <div className="text-gray-500 text-xs mt-1">{booking.preferredTime}</div>
                </td>

                <td className="px-6 py-4 text-gray-400 max-w-xs truncate" title={booking.notes || ''}>
                  {booking.notes ? booking.notes : <span className="text-gray-600 italic">None</span>}
                </td>

                <td className="px-6 py-4 text-right">
                  <div className="flex gap-2 justify-end">
                    <select 
                      value={booking.status}
                      onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                      disabled={isUpdating === booking.id}
                      className="bg-[#2a2a2a] border border-white/10 text-white text-xs uppercase tracking-wider py-2 px-3 focus:outline-none focus:border-gold cursor-pointer disabled:opacity-50"
                    >
                      <option value="NEW">New</option>
                      <option value="CONFIRMED">Confirm</option>
                      <option value="COMPLETED">Complete</option>
                      <option value="CANCELLED">Cancel</option>
                    </select>
                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
