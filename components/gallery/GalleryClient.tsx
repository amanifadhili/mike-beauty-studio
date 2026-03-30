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
                : 'bg-transparent border border-gray-300 text-gray-600 hover:border-gold hover:text-charcoal'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Masonry Layout using Framer Motion for Layout animations */}
      {/* Native CSS Masonry: columns-2 on mobile to columns-4 depending on breakpoint */}
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 md:gap-6 space-y-4 md:space-y-6">
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
              {/* Using aspect-[4/5] on mobile to prevent extreme height, and [3/4] on larger screens */}
              <div className="w-full relative bg-[#2a2a2a] aspect-[4/5] md:aspect-[3/4]">
                <Image 
                  src={item.url} 
                  alt={item.service?.name || 'Uncategorized'} 
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority={localIndex < 4} // Load first 4 images immediately for LCP
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
