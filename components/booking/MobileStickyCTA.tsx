'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBooking } from '@/components/booking/BookingContext';
import { Button } from '@/components/ui/Button';

export function MobileStickyCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const { openBooking } = useBooking();

  useEffect(() => {
    const handleScroll = () => {
      // Only show after the user has scrolled down 200px
      if (window.scrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Initial check in case they refresh while scrolled down
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="fixed bottom-0 left-0 w-full z-40 md:hidden pointer-events-none"
        >
          {/* 
            We use a pointer-events-none wrapper so the invisible gradient doesn't block underlying clicks,
            but restore pointer-events-auto on the inner container so the button works. 
          */}
          <div 
            className="bg-gradient-to-t from-white via-white/80 to-transparent pt-8 px-5 pointer-events-auto"
            style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))' }}
          >
            <Button 
              variant="primary" 
              fullWidth 
              onClick={() => openBooking()}
              className="h-[52px] tracking-widest uppercase shadow-2xl font-sans text-xs sm:text-sm bg-charcoal text-white hover:bg-black transition-colors"
            >
              Book Appointment
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
