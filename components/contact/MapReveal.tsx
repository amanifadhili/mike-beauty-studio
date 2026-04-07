'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger to handle scroll-based animations
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function MapReveal({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.5,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%', // Trigger the animation when the top of the map hits 85% of the viewport height
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="h-[300px] lg:h-auto min-h-[400px] border border-[#eaeaea] relative overflow-hidden flex-1 shadow-2xl shadow-charcoal/5"
    >
      {children}
    </div>
  );
}
