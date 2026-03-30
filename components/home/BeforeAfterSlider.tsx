'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import { SectionHeading } from '../ui/SectionHeading';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function BeforeAfterSlider() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const beforeWrapperRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const beforeLabelRef = useRef<HTMLDivElement>(null);
  const afterLabelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !beforeWrapperRef.current || !handleRef.current || !beforeLabelRef.current || !afterLabelRef.current) return;

    let ctx = gsap.context(() => {
      // Reset initial states for GSAP
      gsap.set(beforeWrapperRef.current, { clipPath: 'inset(0% 0% 0% 0%)' });
      gsap.set(handleRef.current, { left: '100%' });
      // Text labels start states
      gsap.set(beforeLabelRef.current, { opacity: 1 });
      gsap.set(afterLabelRef.current, { opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'center center',
          end: '+=800', // Pins the section for 800px of scrolling
          pin: true,
          scrub: 1, // Appends a 1-second momentum smoothing effect
          anticipatePin: 1, // Prevents layout jumping when pin kicks in
        }
      });

      // 1. Core Slider Reveal Animation (Duration 1 for easy percentage math)
      tl.to(beforeWrapperRef.current, {
        clipPath: 'inset(0% 100% 0% 0%)',
        duration: 1,
        ease: 'none',
      }, 0)
      .to(handleRef.current, {
        left: '0%',
        duration: 1,
        ease: 'none',
      }, 0)
      
      // 2. Cinematic Label Crossfades
      // As the slider moves leftwards:
      // The After label on the right is uncovered by the handle at ~15% progress. So we fade it in gracefully slightly after.
      .to(afterLabelRef.current, {
        opacity: 1,
        duration: 0.2, // Takes 20% of the total scroll
        ease: 'power1.inOut',
      }, 0.2)
      // The Before label on the left is sliced by the handle at ~85% progress. So we gently fade it out right before the blade hits it.
      .to(beforeLabelRef.current, {
        opacity: 0,
        duration: 0.2, // Takes 20% of the total scroll
        ease: 'power1.inOut',
      }, 0.6);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="w-full relative">
      <section ref={sectionRef} className="py-12 md:py-20 bg-white relative overflow-hidden h-[100svh] min-h-[100svh] flex flex-col justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          
          <SectionHeading 
            title="The Transformation"
            subtitle="Watch the dramatic difference a professional volume set makes as you scroll down."
            alignment="center"
          />

          <div className="mt-10 md:mt-16 flex justify-center w-full">
            <div 
              ref={containerRef}
              className="relative w-full max-w-4xl aspect-[3/2] md:aspect-[16/9] overflow-hidden bg-gray-100 shadow-2xl border border-[#eaeaea] group"
            >
              {/* After Image (Background - always visible) */}
              <div className="absolute inset-0 w-full h-full">
                <Image 
                  src="https://images.pexels.com/photos/3997384/pexels-photo-3997384.jpeg?auto=compress&cs=tinysrgb&w=2000"
                  alt="After volume lash extensions"
                  fill
                  priority
                  className="object-cover pointer-events-none"
                  sizes="(max-width: 768px) 100vw, 1000px"
                />
                {/* After Label (Fades In) */}
                <div ref={afterLabelRef} className="absolute top-3 right-3 md:top-6 md:right-6 z-20">
                  <span className="bg-white/90 backdrop-blur px-3 py-1.5 md:px-5 md:py-2.5 font-sans text-[0.65rem] md:text-xs tracking-[0.2em] uppercase text-charcoal shadow-sm rounded-sm">
                    <span className="md:hidden">After</span>
                    <span className="hidden md:inline">After (Volume Set)</span>
                  </span>
                </div>
              </div>

              {/* Before Image (Foreground overlay - clipped dynamically by GSAP) */}
              <div 
                ref={beforeWrapperRef}
                className="absolute inset-0 w-full h-full z-10"
                style={{ clipPath: 'inset(0% 0% 0% 0%)' }}
              >
                <Image 
                  src="https://images.pexels.com/photos/3986970/pexels-photo-3986970.jpeg?auto=compress&cs=tinysrgb&w=2000"
                  alt="Before volume lash extensions"
                  fill
                  priority
                  className="object-cover pointer-events-none"
                  sizes="(max-width: 768px) 100vw, 1000px"
                />
                {/* Before Label (Fades Out) */}
                <div ref={beforeLabelRef} className="absolute top-3 left-3 md:top-6 md:left-6 z-20">
                  <span className="bg-white/90 backdrop-blur px-3 py-1.5 md:px-5 md:py-2.5 font-sans text-[0.65rem] md:text-xs tracking-[0.2em] uppercase text-charcoal shadow-sm rounded-sm">Before</span>
                </div>
              </div>

              {/* The Handle / Divider Line */}
              <div 
                ref={handleRef}
                className="absolute top-0 bottom-0 w-[3px] bg-white shadow-[0_0_20px_rgba(0,0,0,0.5)] z-30 pointer-events-none"
                style={{ left: '100%', transform: 'translateX(-50%)' }}
              >
                <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 bg-white rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.2)] flex items-center justify-center flex-col gap-1.5 border border-[#eaeaea]">
                  {/* Grip Lines */}
                  <div className="w-[2px] h-3 bg-gold"></div>
                  <div className="w-[2px] h-5 bg-gold"></div>
                  <div className="w-[2px] h-3 bg-gold"></div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
