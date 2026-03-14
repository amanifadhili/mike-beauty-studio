'use client';

import { useState } from 'react';
import { updateBookingStatus } from '@/app/actions/adminBookings';
import { convertBookingToTransaction } from '@/actions/bookings';

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
    id?: string;
    name: string;
    price: number;
  };
};

const STATUS_STYLES: Record<string, string> = {
  NEW: 'border-amber-500/40 text-amber-400 bg-amber-500/[0.08]',
  CONFIRMED: 'border-blue-500/40 text-blue-400 bg-blue-500/[0.08]',
  COMPLETED: 'border-green-500/40 text-green-400 bg-green-500/[0.08]',
  CANCELLED: 'border-red-500/40 text-red-400 bg-red-500/[0.08]',
  CONVERTED: 'border-purple-500/40 text-purple-400 bg-purple-500/[0.08]',
};

export function BookingTable({ initialBookings, workers = [] }: { initialBookings: BookingWithService[], workers?: any[] }) {
  const [bookings, setBookings] = useState<BookingWithService[]>(initialBookings);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  
  // Checkout Modal State
  const [convertingBooking, setConvertingBooking] = useState<BookingWithService | null>(null);
  const [selectedWorker, setSelectedWorker] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CASH');

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    if (newStatus === 'CONVERTED') {
      // Open the conversion modal instead of firing the standard update
      setConvertingBooking(booking);
      return;
    }

    setIsUpdating(bookingId);
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
    const result = await updateBookingStatus(bookingId, newStatus);
    if (!result.success) {
      alert('Failed to update status.');
      setBookings(initialBookings);
    }
    setIsUpdating(null);
  };

  const handleConvertSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!convertingBooking || !selectedWorker) return;

    setIsUpdating(convertingBooking.id);
    setConvertingBooking(null); // close modal immediately

    const result = await convertBookingToTransaction({
      bookingId: convertingBooking.id,
      workerId: selectedWorker,
      paymentMethod
    });

    if (result.success) {
       setBookings(prev => prev.map(b => b.id === convertingBooking.id ? { ...b, status: 'CONVERTED' } : b));
    } else {
       alert(`Conversion failed: ${result.error}`);
    }
    setIsUpdating(null);
  }

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

  const StatusSelect = ({ booking }: { booking: BookingWithService }) => (
    <select
      value={booking.status}
      onChange={(e) => handleStatusChange(booking.id, e.target.value)}
      disabled={isUpdating === booking.id || booking.status === 'CONVERTED'}
      className="w-full bg-[#1e1e1e] border border-white/10 text-white text-xs uppercase tracking-wider py-2 px-3 rounded-lg focus:outline-none focus:border-gold cursor-pointer disabled:opacity-40 transition-colors hover:border-white/20"
    >
      <option value="NEW">New</option>
      <option value="CONFIRMED">Confirm</option>
      <option value="COMPLETED">Complete</option>
      <option value="CANCELLED">Cancel</option>
      <option value="CONVERTED">Convert to Sale</option>
    </select>
  );

  return (
    <>
      <div className="bg-[#161616] border border-white/[0.06] rounded-xl overflow-hidden">

        {/* ─── Desktop Table (md+) ─── */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full font-sans text-sm text-left whitespace-nowrap">
            <thead className="text-[10px] text-gray-600 uppercase tracking-[0.15em] border-b border-white/[0.05]">
              <tr>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Client</th>
                <th className="px-6 py-3">Service</th>
                <th className="px-6 py-3">Appointment</th>
                <th className="px-6 py-3">Notes</th>
                <th className="px-6 py-3 text-right">Update / Convert</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${STATUS_STYLES[booking.status] || 'border-gray-600/40 text-gray-400 bg-white/5'}`}>
                      {booking.status}
                    </span>
                  </td>
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
                  <td className="px-6 py-4">
                    <p className="text-gray-300">{booking.service.name}</p>
                    <p className="text-gray-600 text-xs mt-0.5">{booking.service.price.toLocaleString()} RWF</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-300">{new Date(booking.preferredDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    <p className="text-gray-600 text-xs mt-0.5">{booking.preferredTime}</p>
                  </td>
                  <td className="px-6 py-4 max-w-[180px]">
                    {booking.notes ? (
                      <p className="text-gray-500 text-xs truncate" title={booking.notes}>{booking.notes}</p>
                    ) : (
                      <span className="text-gray-700 text-xs italic">None</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <StatusSelect booking={booking} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ─── Mobile Card Stack (below md) ─── */}
        <div className="md:hidden divide-y divide-white/[0.05]">
          {bookings.map((booking) => (
            <div key={booking.id} className="p-4 space-y-3">

              {/* Top row: Status badge + date */}
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${STATUS_STYLES[booking.status] || 'border-gray-600/40 text-gray-400 bg-white/5'}`}>
                  {booking.status}
                </span>
                <span className="text-gray-600 font-sans text-xs">
                  {new Date(booking.preferredDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · {booking.preferredTime}
                </span>
              </div>

              {/* Client */}
              <div>
                <p className="text-white font-sans font-medium text-sm">{booking.name}</p>
                <a
                  href={`https://wa.me/${booking.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank" rel="noreferrer"
                  className="text-gray-600 hover:text-emerald-400 text-xs font-mono transition-colors"
                >
                  {booking.phone}
                </a>
              </div>

              {/* Service */}
              <div className="flex items-center justify-between bg-white/[0.03] rounded-lg px-3 py-2">
                <p className="text-gray-300 font-sans text-sm">{booking.service.name}</p>
                <p className="text-gray-500 font-sans text-xs">{booking.service.price.toLocaleString()} RWF</p>
              </div>

              {/* Notes */}
              {booking.notes && (
                <p className="text-gray-500 font-sans text-xs italic border-l-2 border-white/10 pl-3">
                  {booking.notes}
                </p>
              )}

              {/* Status Updater */}
              <div className="pt-1">
                <StatusSelect booking={booking} />
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Convert to Transaction Modal */}
      {convertingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#1e1e1e] border border-white/10 p-6 rounded-xl shadow-2xl w-full max-w-md animate-fade-in-up">
            <h2 className="text-xl font-playfair text-white mb-2">Convert to Transaction</h2>
            <p className="text-gray-400 text-sm mb-6">Convert {convertingBooking.name}'s appointment into a finalized financial record to recognize revenue and calculate worker commission.</p>
            
            <form onSubmit={handleConvertSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-sans text-gray-500 uppercase tracking-wider mb-2">Assign Worker</label>
                <select 
                  value={selectedWorker} 
                  onChange={e => setSelectedWorker(e.target.value)}
                  className="w-full bg-[#161616] border border-white/10 text-white py-3 px-4 rounded-lg focus:border-gold outline-none"
                  required
                >
                  <option value="">-- Choose Staff --</option>
                  {workers.map(w => (
                    <option key={w.id} value={w.id}>{w.user.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-sans text-gray-500 uppercase tracking-wider mb-2">Payment Method</label>
                <select 
                  value={paymentMethod} 
                  onChange={e => setPaymentMethod(e.target.value)}
                  className="w-full bg-[#161616] border border-white/10 text-white py-3 px-4 rounded-lg focus:border-gold outline-none"
                >
                  <option value="CASH">Cash</option>
                  <option value="MOBILE_MONEY">Mobile Money</option>
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                  <option value="CREDIT">Client Credit (Incomplete)</option>
                </select>
              </div>

              <div className="bg-[#161616] p-4 rounded-lg border border-white/5 mt-4">
                <p className="text-gray-400 text-xs">Total Revenue Logged</p>
                <p className="text-2xl font-playfair text-gold">{convertingBooking.service.price.toLocaleString()} RWF</p>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button 
                  type="button" 
                  onClick={() => setConvertingBooking(null)}
                  className="px-4 py-2 text-sm text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={!selectedWorker}
                  className="px-5 py-2 bg-gold hover:bg-gold/90 text-black font-semibold rounded-lg text-sm disabled:opacity-50"
                >
                  Finalize Sale
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
