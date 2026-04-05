'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown } from 'lucide-react';
import { ActionButton, StatusBadge } from '@/components/ui';

type BookingDrawerProps = {
  booking: any | null;
  onClose: () => void;
  onConvert: (booking: any) => void;
  onStatusChange?: (status: string) => void;
  isUpdating?: boolean;
};

export function BookingDrawer({ booking, onClose, onConvert, onStatusChange, isUpdating }: BookingDrawerProps) {
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onStatusChange) {
      onStatusChange(e.target.value);
    }
  };

  return (
    <AnimatePresence>
      {booking && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-[#1a1a1a] border-l border-white/10 z-50 p-6 overflow-y-auto shadow-2xl"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-playfair text-white/90">Booking Details</h2>
              <button onClick={onClose} className="p-2 text-white/50 hover:text-white rounded-full hover:bg-white/5 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className={`space-y-6 ${isUpdating ? 'opacity-50 pointer-events-none' : ''}`}>
              <div className="flex flex-col">
                <p className="text-xs uppercase tracking-widest text-white/40 mb-2 font-sans">Current Status</p>
                <div className="flex items-center gap-3">
                  <div className="inline-block pointer-events-none">
                    <StatusBadge status={booking.status} />
                  </div>
                  
                  {onStatusChange && (
                    <div className="relative flex-1">
                      <select
                        value={booking.status}
                        onChange={handleStatusChange}
                        disabled={isUpdating || booking.status === 'CONVERTED'}
                        className="appearance-none w-full bg-black/40 text-white/90 text-sm px-4 py-2 pr-10 rounded-xl border border-white/10 focus:border-white/30 focus:outline-none transition-colors cursor-pointer hover:bg-black/60 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="NEW">New</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                        <option value="CONVERTED">Convert to Sale ✨</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-white/40">
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest text-white/40 mb-2 font-sans">Client Information</p>
                <div className="bg-white/5 border border-white/5 rounded-xl p-4">
                  <p className="font-medium text-white/90 font-sans">{booking.client.name}</p>
                  <a href={`https://wa.me/${booking.client.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="text-sm font-mono text-emerald-400 mt-1 inline-block hover:underline">
                    {booking.client.phone}
                  </a>
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest text-white/40 mb-2 font-sans">Appointment Details</p>
                <div className="bg-white/5 border border-white/5 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/60 font-sans">Service</span>
                    <span className="text-sm font-medium text-white/90 font-sans">{booking.service.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/60 font-sans">Price</span>
                    <span className="text-sm font-medium text-gold font-sans">{booking.service.price.toLocaleString()} RWF</span>
                  </div>
                  {booking.depositPaid > 0 && (
                    <div className="flex justify-between items-center pt-2 border-t border-white/10">
                      <span className="text-sm text-white/60 font-sans">Deposit Paid</span>
                      <span className="text-sm font-medium text-emerald-400 font-sans">{booking.depositPaid.toLocaleString()} RWF</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-2 border-t border-white/10">
                    <span className="text-sm text-white/60 font-sans">Date</span>
                    <span className="text-sm font-medium text-white/90 font-sans">
                      {new Date(booking.preferredDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/60 font-sans">Time</span>
                    <span className="text-sm font-medium text-white/90 font-sans">{booking.preferredTime}</span>
                  </div>
                </div>
              </div>

              {booking.notes && (
                <div>
                  <p className="text-xs uppercase tracking-widest text-white/40 mb-2 font-sans">Notes</p>
                  <div className="bg-white/5 border-l-2 border-gold/50 rounded-r-xl p-4">
                    <p className="text-sm text-white/70 italic font-sans">{booking.notes}</p>
                  </div>
                </div>
              )}

              <div className="pt-8 mt-auto">
                <ActionButton
                  variant="gold"
                  className="w-full py-4 text-sm font-bold tracking-wide"
                  onClick={() => onConvert(booking)}
                  disabled={booking.status === 'CONVERTED'}
                >
                  {booking.status === 'CONVERTED' ? 'Already Converted' : 'CONVERT TO SALE ✦'}
                </ActionButton>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
