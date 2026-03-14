'use client';

import { useState } from 'react';
import { updateBookingStatus } from '@/app/actions/adminBookings';

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

const STATUS_STYLES: Record<string, string> = {
  NEW: 'border-amber-500/40 text-amber-400 bg-amber-500/[0.08]',
  CONFIRMED: 'border-blue-500/40 text-blue-400 bg-blue-500/[0.08]',
  COMPLETED: 'border-green-500/40 text-green-400 bg-green-500/[0.08]',
  CANCELLED: 'border-red-500/40 text-red-400 bg-red-500/[0.08]',
};

export function BookingTable({ initialBookings }: { initialBookings: BookingWithService[] }) {
  const [bookings, setBookings] = useState<BookingWithService[]>(initialBookings);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    setIsUpdating(bookingId);
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
    const result = await updateBookingStatus(bookingId, newStatus);
    if (!result.success) {
      alert('Failed to update status.');
      setBookings(initialBookings);
    }
    setIsUpdating(null);
  };

  if (bookings.length === 0) {
    return (
      <div className="bg-[#161616] border border-white/[0.06] rounded-xl p-16 text-center">
        <svg className="w-10 h-10 text-gray-700 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-gray-600 font-sans text-sm">No booking requests found.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#161616] border border-white/[0.06] rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full font-sans text-sm text-left whitespace-nowrap">
          <thead className="text-[10px] text-gray-600 uppercase tracking-[0.15em] border-b border-white/[0.05]">
            <tr>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Client</th>
              <th className="px-6 py-3">Service</th>
              <th className="px-6 py-3">Appointment</th>
              <th className="px-6 py-3">Notes</th>
              <th className="px-6 py-3 text-right">Update</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {bookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-white/[0.02] transition-colors">

                {/* Status Badge */}
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${STATUS_STYLES[booking.status] || 'border-gray-600/40 text-gray-400 bg-white/5'}`}>
                    {booking.status}
                  </span>
                </td>

                {/* Client */}
                <td className="px-6 py-4">
                  <p className="text-white font-medium">{booking.name}</p>
                  <a
                    href={`https://wa.me/${booking.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank" rel="noreferrer"
                    className="text-gray-600 hover:text-emerald-400 text-xs font-mono transition-colors mt-0.5 block"
                  >
                    {booking.phone}
                  </a>
                </td>

                {/* Service */}
                <td className="px-6 py-4">
                  <p className="text-gray-300">{booking.service.name}</p>
                  <p className="text-gray-600 text-xs mt-0.5">{booking.service.price.toLocaleString()} RWF</p>
                </td>

                {/* Date */}
                <td className="px-6 py-4">
                  <p className="text-gray-300">{new Date(booking.preferredDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  <p className="text-gray-600 text-xs mt-0.5">{booking.preferredTime}</p>
                </td>

                {/* Notes */}
                <td className="px-6 py-4 max-w-[180px]">
                  {booking.notes ? (
                    <p className="text-gray-500 text-xs truncate" title={booking.notes}>{booking.notes}</p>
                  ) : (
                    <span className="text-gray-700 text-xs italic">None</span>
                  )}
                </td>

                {/* Status Selector */}
                <td className="px-6 py-4 text-right">
                  <select
                    value={booking.status}
                    onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                    disabled={isUpdating === booking.id}
                    className="bg-[#1e1e1e] border border-white/10 text-white text-xs uppercase tracking-wider py-2 px-3 rounded-lg focus:outline-none focus:border-gold cursor-pointer disabled:opacity-40 transition-colors hover:border-white/20"
                  >
                    <option value="NEW">New</option>
                    <option value="CONFIRMED">Confirm</option>
                    <option value="COMPLETED">Complete</option>
                    <option value="CANCELLED">Cancel</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
