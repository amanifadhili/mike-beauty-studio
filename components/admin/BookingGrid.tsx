'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PaymentMethod } from '@prisma/client';
import { updateBookingStatus } from '@/app/actions/adminBookings';
import { convertBookingToTransaction } from '@/actions/bookings';
import { ActionButton } from '@/components/ui';
import { BookingCard } from './BookingCard';
import { BookingDrawer } from './BookingDrawer';

const FILTERS = [
  { id: 'NEW', label: 'New' },
  { id: 'CONFIRMED', label: 'Confirmed' },
  { id: 'COMPLETED', label: 'Completed' },
  { id: 'CANCELLED', label: 'Cancelled' },
  { id: 'CONVERTED', label: 'Sales' },
  { id: 'ALL', label: 'All' },
];

export function BookingGrid({ initialBookings, staff = [] }: { initialBookings: any[]; staff?: any[] }) {
  const [bookings, setBookings] = useState(initialBookings);
  
  // Sync the optimistic state if the server pushes a new initialBookings array (via revalidatePath)
  useEffect(() => {
    setBookings(initialBookings);
  }, [initialBookings]);

  const [filter, setFilter] = useState('NEW');
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  
  // Conversion state
  const [convertingBooking, setConvertingBooking] = useState<any | null>(null);
  const [selectedWorker, setSelectedWorker] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [converting, setConverting] = useState(false);

  // Status updating state
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const selectedBooking = bookings.find((b) => b.id === selectedBookingId);
  const filteredBookings = filter === 'ALL' ? bookings : bookings.filter(b => b.status === filter);

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    if (newStatus === 'CONVERTED') {
      setConvertingBooking(booking);
      setSelectedBookingId(null);
      return;
    }

    setIsUpdating(bookingId);
    // Optimistic update
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
    
    const result = await updateBookingStatus(bookingId, newStatus);
    if (!result.success) {
      alert('Failed to update status.');
      // Revert optimistic update
      setBookings(initialBookings); // Fallback to last known good state
    }
    setIsUpdating(null);
  };

  const handleConvertSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!convertingBooking || !selectedWorker) return;
    const target = convertingBooking;
    setConverting(true);
    
    const result = await convertBookingToTransaction({
      bookingId: target.id,
      userId: selectedWorker,
      paymentMethod: paymentMethod as PaymentMethod
    });
    
    if (result.success) {
      setBookings((prev) => prev.map((b) => (b.id === target.id ? { ...b, status: 'CONVERTED' } : b)));
      setConvertingBooking(null);
    } else {
      alert(`Conversion failed: ${result.error}`);
    }
    setConverting(false);
  };

  return (
    <div className="flex flex-col h-full animate-fade-in-up">
      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-2 scrollbar-hide">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-4 py-2 rounded-full text-xs font-sans whitespace-nowrap transition-all duration-200 border 
              ${filter === f.id 
                ? 'bg-white/10 border-white/20 text-white shadow-lg' 
                : 'bg-transparent border-transparent text-white/50 hover:text-white/80 hover:bg-white/5'
              }`}
          >
            {f.label}
            <span className="ml-2 opacity-50">
              {f.id === 'ALL' ? bookings.length : bookings.filter(b => b.status === f.id).length}
            </span>
          </button>
        ))}
      </div>

      {/* Grid Layout */}
      <div className="flex-1 overflow-y-auto pb-20">
        {filteredBookings.length === 0 ? (
          <div className="h-64 flex items-center justify-center border border-dashed border-white/10 rounded-2xl">
            <p className="text-white/40 font-sans italic">No bookings found for this filter.</p>
          </div>
        ) : (
          <motion.div 
            layout 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 content-start"
          >
            <AnimatePresence>
              {filteredBookings.map((b) => (
                <motion.div
                  key={b.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <BookingCard 
                    booking={b} 
                    onClick={() => setSelectedBookingId(b.id)} 
                    onStatusChange={(status) => handleStatusChange(b.id, status)}
                    isUpdating={isUpdating === b.id}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Slide-over Drawer for Details */}
      <BookingDrawer
        booking={selectedBooking}
        onClose={() => setSelectedBookingId(null)}
        onConvert={(b) => {
          setSelectedBookingId(null);
          setConvertingBooking(b);
        }}
        onStatusChange={(status) => {
          if (selectedBooking && status !== 'CONVERTED') {
            handleStatusChange(selectedBooking.id, status);
          } else if (status === 'CONVERTED') {
            setConvertingBooking(selectedBooking);
            setSelectedBookingId(null);
          }
        }}
        isUpdating={isUpdating === selectedBookingId}
      />

       {/* Convert to Transaction Modal */}
       {convertingBooking && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setConvertingBooking(null)}>
          <div className="admin-card p-6 w-full max-w-md animate-fade-in-up bg-[#1a1a1a] border border-white/10" onClick={e => e.stopPropagation()}>
            <h2 className="font-playfair text-xl mb-2 text-white">Convert to Transaction</h2>
            <p className="text-sm mb-6 font-sans text-white/60">
              Convert <strong className="text-white">{convertingBooking.client.name}</strong>'s appointment into a finalized revenue record.
            </p>
            <form onSubmit={handleConvertSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-sans uppercase tracking-wider mb-1.5 text-white/40">Assign Worker</label>
                <select value={selectedWorker} onChange={e => setSelectedWorker(e.target.value)} className="admin-select w-full" required>
                  <option value="">-- Choose Staff --</option>
                  {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-sans uppercase tracking-wider mb-1.5 text-white/40">Payment Method</label>
                <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className="admin-select w-full">
                  <option value="CASH">Cash</option>
                  <option value="MOBILE_MONEY">Mobile Money</option>
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                  <option value="CREDIT">Client Credit</option>
                </select>
              </div>
              <div className="flex justify-between items-center p-4 rounded-lg bg-white/5 border border-white/10">
                <p className="text-xs font-sans text-white/60">Revenue to Log</p>
                <div className="text-right">
                  <p className="font-playfair text-2xl text-gold">{(convertingBooking.service.price - convertingBooking.depositPaid).toLocaleString()} RWF</p>
                  {convertingBooking.depositPaid > 0 && (
                     <p className="text-xs text-white/40 font-sans">(-{convertingBooking.depositPaid} Deposit)</p>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setConvertingBooking(null)} className="px-4 py-2 text-sm font-sans text-white/60 hover:text-white transition-colors">Cancel</button>
                <ActionButton type="submit" variant="gold" loading={converting} loadingText="Converting..." disabled={!selectedWorker} className="w-auto px-6">
                  Finalize Sale
                </ActionButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
