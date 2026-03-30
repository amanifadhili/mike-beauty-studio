'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { useBooking } from '@/components/booking/BookingContext';

const HERO_IMAGES = [
  '/hero/hero_image_one.png',
  '/hero/lash_mega_1.png',
  '/hero/hero_image_three.png',
  '/hero/hero_image_four.png',
];

export function Hero() {
  const { openBooking } = useBooking();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const textRef = useRef<HTMLDivElement>(null);

  // Cross-fade image slideshow logic
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000); // 5 seconds per image

    return () => clearInterval(interval);
  }, []);

  // GSAP Text Reveal Animation
  useEffect(() => {
    if (!textRef.current) return;

    let ctx = gsap.context(() => {
      gsap.fromTo(
        textRef.current!.children,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.5,
          stagger: 0.2,
          ease: 'power3.out',
          delay: 0.5,
        }
      );
    }, textRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative h-[100svh] min-h-[100svh] w-full overflow-hidden bg-black flex items-center justify-center">
      
      {/* Background Image Carousel */}
      {HERO_IMAGES.map((src, index) => {
        const isActive = index === currentImageIndex;
        return (
          <div
            key={src}
            className={`absolute inset-0 z-0 transition-opacity duration-[1500ms] ease-in-out ${
              isActive ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* The scale-110 to scale-100 gives the Ken Burns zoom-in/out effect */}
            <Image
              src={src}
              alt={`Mike Beauty Studio Premium Detail ${index + 1}`}
              fill
              priority={index === 0}
              className={`object-cover transition-transform duration-[10000ms] ease-linear ${
                isActive ? 'scale-110' : 'scale-100'
              }`}
            />
          </div>
        );
      })}

      {/* Overlay Gradient for readability (Text contrast) */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/60 via-black/30 to-black/80 pointer-events-none" />

      {/* Top Navigation Anchor / Gap spacer if needed */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black/60 to-transparent z-10 pointer-events-none" />

      {/* Content */}
      <div 
        ref={textRef}
        className="relative z-20 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto mt-20 sm:mt-16"
      >
        <span className="text-[var(--color-gold)] font-sans tracking-[0.2em] text-sm md:text-base uppercase mb-4 block drop-shadow-md">
          Award-Winning Beauty Studio
        </span>
        
        <h1 className="text-white font-playfair text-4xl sm:text-5xl md:text-7xl lg:text-8xl leading-tight mb-6 drop-shadow-xl">
          Elevate Your <br/> <span className="italic text-[var(--color-gold)]">Natural Beauty</span>
        </h1>
        
        <p className="text-gray-200 font-sans text-lg md:text-xl max-w-2xl mb-10 font-light drop-shadow-md">
          Premium lash extensions crafted with precision in Kigali. Experience the absolute pinnacle of luxury service.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Button 
            variant="primary" 
            size="lg" 
            className="w-full sm:w-auto text-lg px-8 py-6 rounded-none tracking-wide"
            onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Discover Services
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="w-full sm:w-auto text-lg px-8 py-6 rounded-none tracking-wide border-white/50 text-white hover:bg-white/10 transition-colors"
            // Hooking into the global booking modal context instead of a hard redirect
            onClick={() => openBooking()} 
          >
            Book Appointment
          </Button>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-10 left-0 right-0 z-20 flex justify-center gap-3 pointer-events-none">
        {HERO_IMAGES.map((_, index) => (
          <div
            key={index}
            className={`h-1.5 rounded-full transition-all duration-[800ms] bg-white ${
              index === currentImageIndex 
                ? 'w-8 opacity-100 shadow-[0_0_10px_rgba(255,255,255,0.8)]' 
                : 'w-2 opacity-30 shadow-none'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
