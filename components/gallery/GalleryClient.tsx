'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Lightbox } from './Lightbox';

// Define the type based on the Prisma relation we fetched
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

interface GalleryClientProps {
  items: GalleryItem[];
}

export function GalleryClient({ items }: GalleryClientProps) {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Extract unique categories (Service names) dynamically from the items
  const categories = useMemo(() => {
    const rawCategories = items.map(item => item.service?.name || 'Uncategorized');
    return ['All', ...Array.from(new Set(rawCategories))];
  }, [items]);

  // Filter items based on active category
  const filteredItems = useMemo(() => {
    if (activeFilter === 'All') return items;
    return items.filter(item => (item.service?.name || 'Uncategorized') === activeFilter);
  }, [items, activeFilter]);

  return (
    <div>
      {/* Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-16">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveFilter(category)}
            className={`px-6 py-2 rounded-full font-sans text-sm tracking-wide transition-all duration-300 ${
              activeFilter === category 
                ? 'bg-gold text-charcoal' 
                : 'bg-transparent border border-white/20 text-gray-300 hover:border-gold hover:text-white'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Masonry Layout using Framer Motion for Layout animations */}
      {/* Native CSS Masonry: columns-1 to columns-3 depending on breakpoint */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        <AnimatePresence>
          {filteredItems.map((item, localIndex) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              key={item.id}
              className="relative overflow-hidden group cursor-zoom-in break-inside-avoid"
              onClick={() => {
                // Find the absolute index in the filtered array to pass to the lightbox
                setLightboxIndex(localIndex);
              }}
            >
              {/* Note: since we use unsplash random URLs, sizes are arbitrary, fitting masonry perfectly */}
              <div className="w-full relative bg-[#2a2a2a]">
                <img 
                  src={item.url} 
                  alt={item.service?.name || 'Uncategorized'} 
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <span className="font-sans text-gold text-xs uppercase tracking-widest mb-2 block transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  {item.service?.name || 'Uncategorized'}
                </span>
                <span className="font-playfair text-white text-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                  View Detail
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Lightbox Portal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox 
            items={filteredItems}
            initialIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
