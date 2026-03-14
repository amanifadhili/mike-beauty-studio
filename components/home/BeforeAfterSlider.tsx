'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { SectionHeading } from '../ui/SectionHeading';

export function BeforeAfterSlider() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const { left, width } = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - left, width));
    const percent = (x / width) * 100;
    setSliderPosition(percent);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', () => setIsDragging(false));
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', () => setIsDragging(false));
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', () => setIsDragging(false));
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', () => setIsDragging(false));
    };
  }, [isDragging]);

  return (
    <section className="py-12 md:py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeading 
          title="The Transformation"
          subtitle="Drag the slider to see the dramatic difference a professional volume set can make."
          alignment="center"
        />

        <div className="mt-10 md:mt-16 flex justify-center">
          <div 
            ref={containerRef}
            className="relative w-full max-w-4xl aspect-[3/2] md:aspect-[16/9] overflow-hidden bg-gray-100 select-none cursor-ew-resize border border-[#eaeaea]"
            onMouseDown={(e) => {
              setIsDragging(true);
              handleMove(e.clientX);
            }}
            onTouchStart={(e) => {
              setIsDragging(true);
              handleMove(e.touches[0].clientX);
            }}
          >
            {/* After Image (Background) */}
            <div className="absolute inset-0 w-full h-full">
              {/* Note: Replacing with actual asset later. Using a solid color placeholder for now if NO asset exists */}
              <div className="w-full h-full bg-soft-pink flex items-center justify-center">
                <span className="text-xl font-playfair text-charcoal opacity-50 block md:hidden">After</span>
              </div>
            </div>

            {/* Before Image (Foreground overlay) */}
            <div 
              className="absolute inset-0 w-full h-full overflow-hidden"
              style={{ width: `${sliderPosition}%` }}
            >
              <div className="absolute inset-0 w-[100vw] h-full" style={{ width: containerRef.current?.offsetWidth || '100%' }}>
                  <div className="w-full h-full bg-cream flex items-center justify-center border-r-[3px] border-white">
                    <span className="text-xl font-playfair text-charcoal opacity-50 block md:hidden">Before</span>
                  </div>
              </div>
            </div>

            {/* Labels (Desktop) */}
            <div className="absolute top-6 left-6 hidden md:block z-20">
              <span className="bg-white/80 backdrop-blur px-4 py-2 font-sans text-sm tracking-wider uppercase text-charcoal">Before</span>
            </div>
            <div className="absolute top-6 right-6 hidden md:block z-10">
              <span className="bg-white/80 backdrop-blur px-4 py-2 font-sans text-sm tracking-wider uppercase text-charcoal">After (Volume Set)</span>
            </div>

            {/* The Handle */}
            <div 
              className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-30"
              style={{ left: `calc(${sliderPosition}% - 2px)` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 bg-white rounded-full shadow-[0_0_15px_rgba(0,0,0,0.15)] flex items-center justify-center flex-col gap-1 border border-[#eaeaea]">
                {/* Grip Lines */}
                <div className="w-px h-3 bg-gold"></div>
                <div className="w-px h-4 bg-gold"></div>
                <div className="w-px h-3 bg-gold"></div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
