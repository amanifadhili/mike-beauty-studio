'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useBooking } from './BookingContext';
import { BookingForm } from './BookingForm';
import { useEffect } from 'react';

export function BookingModal() {
  const { isOpen, closeBooking, services, preSelectedServiceId } = useBooking();

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12 overflow-hidden">
          
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeBooking}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl bg-white shadow-2xl flex flex-col max-h-[95vh] overflow-hidden rounded-sm"
          >
            {/* Header */}
            <div className="flex justify-between items-center px-4 py-3 sm:px-6 sm:py-4 border-b border-[#eaeaea] shrink-0 bg-white">
              <h2 className="font-playfair text-lg sm:text-xl text-charcoal">Secure Your Slot</h2>
              
              <button 
                onClick={closeBooking}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#eaeaea] transition-colors text-gray-500 hover:text-charcoal"
                title="Close"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Scrollable Form Container */}
            <div className="p-4 sm:p-6 overflow-y-auto w-full custom-scrollbar">
               <BookingForm 
                 services={services} 
                 preSelectedServiceId={preSelectedServiceId || ''} 
                 onClose={closeBooking} 
               />
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
