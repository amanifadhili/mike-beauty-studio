'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Link from 'next/link';
import { SectionHeading } from '../ui/SectionHeading';

// Mock reviews removed per user request

type ReviewProp = { id: string | number; name: string; role: string; text: string; rating: number; };

export function ReviewsCarousel({ reviews = [] }: { reviews?: ReviewProp[] }) {
  const carouselRef = useRef<HTMLDivElement>(null);
  
  // Create an active reference for the rendering logic
  const activeReviews = reviews;

  useEffect(() => {
    if (!carouselRef.current || activeReviews.length === 0) return;

    let ctx = gsap.context(() => {
      // We clone the reviews for an infinite seamless CSS/GSAP marquee effect
      const carousel = carouselRef.current;
      
      // Simple infinite horizontal scroll using GSAP
      gsap.to(carousel, {
        xPercent: -50,
        ease: "none",
        duration: 30,
        repeat: -1,
      });
    }, carouselRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="py-16 md:py-32 bg-background overflow-hidden text-charcoal relative pl-4 md:pl-8">
      <div className="max-w-7xl mx-auto mb-16 px-4">
        <SectionHeading 
          title="Client Experiences"
          subtitle="Don't just take our word for it. Read what Kigali's most discerning clients have to say about their transformations."
          alignment="left"
          className="text-charcoal [&>h2]:text-charcoal [&>p]:text-gray-600"
        />
      </div>

      {activeReviews.length === 0 ? (
        <div className="w-full flex items-center justify-center p-8 bg-white border border-charcoal/10 shadow-sm max-w-2xl mx-auto">
          <p className="font-playfair text-lg text-gray-400 italic">More client stories coming soon.</p>
        </div>
      ) : activeReviews.length < 4 ? (
        /* Static Row layout for a small number of reviews */
        <div className="flex flex-wrap md:flex-nowrap justify-center gap-6 md:gap-8 px-4 w-full">
          {activeReviews.map((review, index) => (
            <div 
              key={`${review.id}-${index}`}
              className="w-full sm:w-[300px] md:w-[400px] shrink-0 bg-white p-8 border border-charcoal/10 shadow-sm"
            >
              <div className="flex gap-1 mb-6">
                {[...Array(review.rating)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-gold fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              
              <p className="font-playfair text-lg md:text-xl text-gray-700 leading-relaxed mb-8 italic min-h-[5rem]">
                "{review.text}"
              </p>
              
              <div>
                <p className="font-sans font-medium text-charcoal tracking-wide uppercase text-sm">{review.name}</p>
                <p className="font-sans text-xs text-gray-500 mt-1">{review.role}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* GSAP Marquee Container for 4+ reviews */
        <div className="flex w-fit" ref={carouselRef}>
          {/* Double the array to create the infinite scroll illusion */}
          {[...activeReviews, ...activeReviews].map((review, index) => (
            <div 
              key={`${review.id}-${index}`}
              className="w-[260px] sm:w-[300px] md:w-[400px] shrink-0 mr-8 bg-white p-8 border border-charcoal/10 shadow-sm"
            >
              <div className="flex gap-1 mb-6">
                {[...Array(review.rating)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-gold fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              
              <p className="font-playfair text-lg md:text-xl text-gray-700 leading-relaxed mb-8 italic">
                "{review.text}"
              </p>
              
              <div>
                <p className="font-sans font-medium text-charcoal tracking-wide uppercase text-sm">{review.name}</p>
                <p className="font-sans text-xs text-gray-500 mt-1">{review.role}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Call to Action Button */}
      <div className="w-full flex justify-center mt-12 md:mt-16 px-4">
        <Link 
          href="/review"
          className="inline-flex items-center gap-3 px-8 py-4 border border-charcoal text-charcoal font-sans text-xs tracking-[0.2em] uppercase hover:bg-charcoal hover:text-white transition-all duration-300"
        >
          Share Your Experience
          <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
