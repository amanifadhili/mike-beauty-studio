'use client';

import { useState } from 'react';
import { PaymentMethod } from '@prisma/client';
import { updateBookingStatus } from '@/app/actions/adminBookings';
import { convertBookingToTransaction } from '@/actions/bookings';
import { StatusBadge, ActionButton } from '@/components/ui';

type BookingWithService = {
  id: string;
  client: { name: string; phone: string };
  preferredDate: Date;
  preferredTime: string;
  notes: string | null;
  status: string;
  createdAt: Date;
  depositPaid: number;
  service: {
    id?: string;
    name: string;
    price: number;
  };
};

export function BookingTable({ initialBookings, staff = [] }: { initialBookings: BookingWithService[]; staff?: any[] }) {
  const [bookings, setBookings] = useState<BookingWithService[]>(initialBookings);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [convertingBooking, setConvertingBooking] = useState<BookingWithService | null>(null);
  const [selectedWorker, setSelectedWorker] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [converting, setConverting] = useState(false);

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    if (newStatus === 'CONVERTED') {
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
    const target = convertingBooking;
    setConverting(true);
    setConvertingBooking(null);

    const result = await convertBookingToTransaction({ bookingId: target.id, userId: selectedWorker, paymentMethod: paymentMethod as PaymentMethod });
    if (result.success) {
      setBookings(prev => prev.map(b => b.id === target.id ? { ...b, status: 'CONVERTED' } : b));
    } else {
      alert(`Conversion failed: ${result.error}`);
    }
    setConverting(false);
    setIsUpdating(null);
  };

  if (bookings.length === 0) {
    return (
      <div className="admin-card p-16 text-center">
        <svg className="w-10 h-10 mx-auto mb-4" style={{ color: 'var(--admin-text-faint)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="font-sans text-sm" style={{ color: 'var(--admin-text-muted)' }}>No booking requests found.</p>
      </div>
    );
  }

  const StatusSelect = ({ booking }: { booking: BookingWithService }) => (
    <select
      value={booking.status}
      onChange={e => handleStatusChange(booking.id, e.target.value)}
      disabled={isUpdating === booking.id || booking.status === 'CONVERTED' || converting}
      className="admin-select w-full text-xs uppercase tracking-wider disabled:opacity-40"
    >
      <option value="NEW">New</option>
      <option value="CONFIRMED">Confirmed</option>
      <option value="COMPLETED">Completed</option>
      <option value="CANCELLED">Cancelled</option>
      <option value="CONVERTED">Convert to Sale ✦</option>
    </select>
  );

  return (
    <>
      {/* Desktop Table */}
      <div className="admin-card overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full font-sans text-sm text-left whitespace-nowrap">
            <thead className="text-[10px] uppercase tracking-[0.15em]" style={{ color: 'var(--admin-text-muted)', borderBottom: '1px solid var(--admin-border-subtle)' }}>
              <tr>
                {['Status', 'Client', 'Service', 'Appointment', 'Notes', 'Update / Convert'].map(col => (
                  <th key={col} className={`px-6 py-3 ${col === 'Update / Convert' ? 'text-right' : ''}`}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ ['--tw-divide-opacity' as string]: 1 }}>
              {bookings.map(booking => (
                <tr key={booking.id} className="transition-colors hover:bg-white/[0.02]">
                  <td className="px-6 py-4"><StatusBadge status={booking.status} /></td>
                  <td className="px-6 py-4">
                    <p className="font-medium" style={{ color: 'var(--admin-text-primary)' }}>{booking.client.name}</p>
                    <a href={`https://wa.me/${booking.client.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="text-xs font-mono transition-colors mt-0.5 block hover:text-emerald-400" style={{ color: 'var(--admin-text-muted)' }}>{booking.client.phone}</a>
                  </td>
                  <td className="px-6 py-4">
                    <p style={{ color: 'var(--admin-text-secondary)' }}>{booking.service.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--admin-text-muted)' }}>{booking.service.price.toLocaleString()} RWF</p>
                  </td>
                  <td className="px-6 py-4">
                    <p style={{ color: 'var(--admin-text-secondary)' }}>{new Date(booking.preferredDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--admin-text-muted)' }}>{booking.preferredTime}</p>
                  </td>
                  <td className="px-6 py-4 max-w-[180px]">
                    {booking.notes ? (
                      <p className="text-xs truncate" style={{ color: 'var(--admin-text-secondary)' }} title={booking.notes}>{booking.notes}</p>
                    ) : (
                      <span className="text-xs italic" style={{ color: 'var(--admin-text-faint)' }}>None</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right"><StatusSelect booking={booking} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card Stack */}
        <div className="md:hidden divide-y" style={{ borderColor: 'var(--admin-border-subtle)' }}>
          {bookings.map(booking => (
            <div key={booking.id} className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <StatusBadge status={booking.status} />
                <span className="text-xs font-sans" style={{ color: 'var(--admin-text-muted)' }}>
                  {new Date(booking.preferredDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · {booking.preferredTime}
                </span>
              </div>
              <div>
                <p className="font-sans font-medium text-sm" style={{ color: 'var(--admin-text-primary)' }}>{booking.client.name}</p>
                <a href={`https://wa.me/${booking.client.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="text-xs font-mono hover:text-emerald-400" style={{ color: 'var(--admin-text-muted)' }}>{booking.client.phone}</a>
              </div>
              <div className="flex items-center justify-between rounded-lg px-3 py-2" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <p className="font-sans text-sm" style={{ color: 'var(--admin-text-secondary)' }}>{booking.service.name}</p>
                <p className="font-sans text-xs" style={{ color: 'var(--admin-text-muted)' }}>{booking.service.price.toLocaleString()} RWF</p>
              </div>
              {booking.notes && <p className="font-sans text-xs italic pl-3" style={{ color: 'var(--admin-text-secondary)', borderLeft: '2px solid var(--admin-border)' }}>{booking.notes}</p>}
              <div className="pt-1"><StatusSelect booking={booking} /></div>
            </div>
          ))}
        </div>
      </div>

      {/* Convert to Transaction Modal */}
      {convertingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
          <div className="admin-card p-6 w-full max-w-md animate-fade-in-up" style={{ background: 'var(--admin-elevated)' }}>
            <h2 className="font-playfair text-xl mb-2" style={{ color: 'var(--admin-text-primary)' }}>Convert to Transaction</h2>
            <p className="text-sm mb-6 font-sans" style={{ color: 'var(--admin-text-secondary)' }}>
              Convert <strong style={{ color: 'var(--admin-text-primary)' }}>{convertingBooking.client.name}</strong>'s appointment into a finalized revenue record.
            </p>
            <form onSubmit={handleConvertSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-sans uppercase tracking-wider mb-1.5" style={{ color: 'var(--admin-text-muted)' }}>Assign Worker</label>
                <select value={selectedWorker} onChange={e => setSelectedWorker(e.target.value)} className="admin-select w-full" required>
                  <option value="">-- Choose Staff --</option>
                  {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-sans uppercase tracking-wider mb-1.5" style={{ color: 'var(--admin-text-muted)' }}>Payment Method</label>
                <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className="admin-select w-full">
                  <option value="CASH">Cash</option>
                  <option value="MOBILE_MONEY">Mobile Money</option>
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                  <option value="CREDIT">Client Credit</option>
                </select>
              </div>
              <div className="flex justify-between items-center p-4 rounded-lg" style={{ background: 'var(--admin-surface)', border: '1px solid var(--admin-border)' }}>
                <p className="text-xs font-sans" style={{ color: 'var(--admin-text-secondary)' }}>Revenue to Log</p>
                <div className="text-right">
                  <p className="font-playfair text-2xl text-gold">{(convertingBooking.service.price - convertingBooking.depositPaid).toLocaleString()} RWF</p>
                  {convertingBooking.depositPaid > 0 && (
                     <p className="text-xs text-gray-400 font-sans">(-{convertingBooking.depositPaid} Deposit)</p>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setConvertingBooking(null)} className="px-4 py-2 text-sm font-sans transition-colors" style={{ color: 'var(--admin-text-secondary)' }}>Cancel</button>
                <ActionButton type="submit" variant="gold" loading={converting} loadingText="Converting..." disabled={!selectedWorker} className="w-auto px-6">
                  Finalize Sale
                </ActionButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
