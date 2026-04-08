'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useBooking } from './BookingContext';
import { BookingForm } from './BookingForm';
import { useEffect } from 'react';

export function BookingModal() {
  const { isOpen, closeBooking, services, preSelectedServiceId, bookingSettings } = useBooking();

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end overflow-hidden">
          
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeBooking}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer z-[100]"
          />

          {/* Modal Content - Side Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="relative w-full max-w-lg bg-cream-white shadow-[-10px_0_30px_rgba(0,0,0,0.1)] flex flex-col h-[100dvh] overflow-hidden z-[101]"
          >
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-5 sm:px-8 sm:py-6 border-b border-[#eaeaea] shrink-0 bg-cream-white">
              <h2 className="font-playfair text-xl sm:text-2xl text-charcoal tracking-wide">Secure Your Slot</h2>
              
              <button 
                onClick={closeBooking}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gold/10 transition-colors text-gray-400 hover:text-gold"
                title="Close"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Scrollable Form Container */}
            <div className="p-6 sm:p-8 overflow-y-auto w-full flex-grow custom-scrollbar bg-white">
               <BookingForm 
                 services={services} 
                 preSelectedServiceId={preSelectedServiceId || ''} 
                 onClose={closeBooking}
                 bookingSettings={bookingSettings}
               />
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
