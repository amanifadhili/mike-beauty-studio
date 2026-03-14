'use client';

import { useEffect, useCallback, useState } from 'react';
import { motion } from 'framer-motion';

// We reuse the same type definition format
type GalleryItem = {
  id: string;
  url: string;
  type: string;
  serviceId: string | null;
  createdAt: Date;
  service: {
    name: string;
  } | null;
};

interface LightboxProps {
  items: GalleryItem[];
  initialIndex: number;
  onClose: () => void;
}

export function Lightbox({ items, initialIndex, onClose }: LightboxProps) {
  // We use the initialIndex to track current position, 
  // but to keep it simple without complex local state causing re-renders we could just use a mutable ref if preferred,
  // however React state is fine for simple previous/next logic.
  
  // Actually, we do need state to track the *current* index within the lightbox session
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const handleNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev: number) => (prev === items.length - 1 ? 0 : prev + 1));
  }, [items.length]);

  const handlePrev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev: number) => (prev === 0 ? items.length - 1 : prev - 1));
  }, [items.length]);

  // Lock body scroll and handle keyboard navigation
  useEffect(() => {
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, handleNext, handlePrev]);

  const currentItem = items[currentIndex];

  if (!currentItem) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Top Bar Navigation */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10">
        <div className="text-white font-sans">
          <span className="text-gold tracking-widest uppercase text-sm font-semibold block">
            {currentItem.service?.name || 'Uncategorized'}
          </span>
          <span className="text-gray-400 text-xs">{currentIndex + 1} / {items.length}</span>
        </div>
        
        <button 
          onClick={onClose}
          className="text-white/70 hover:text-white transition-colors p-2"
          aria-label="Close Lightbox"
        >
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Main Image Area */}
      <div className="relative w-full h-full max-w-6xl max-h-[85vh] flex items-center justify-center px-4 md:px-16">
        <img 
          src={currentItem.url} 
          alt={currentItem.service?.name || 'Uncategorized'} 
          className="max-w-full max-h-full object-contain pointer-events-none"
        />
      </div>

      {/* Navigation Controls (Hidden on small mobile, kept click/touch on sides) */}
      <button 
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-4 hidden md:block"
        onClick={handlePrev}
      >
        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button 
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-4 hidden md:block"
        onClick={handleNext}
      >
        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      
    </motion.div>
  );
}
