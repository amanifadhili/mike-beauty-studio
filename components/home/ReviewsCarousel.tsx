'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { SectionHeading } from '../ui/SectionHeading';

// Hardcoded reviews for the homepage demonstration
const REVIEWS = [
  {
    id: 1,
    name: "Sarah M.",
    role: "Bride",
    text: "Mike gave me the most stunning volume lashes for my wedding. They lasted through all the happy tears and the entire honeymoon. Absolute perfection!",
    rating: 5,
  },
  {
    id: 2,
    name: "Elena R.",
    role: "Regular Client",
    text: "I've been to many luxury studios in Kigali, but none compare to the attention to detail and care provided here. My natural lashes have never been healthier.",
    rating: 5,
  },
  {
    id: 3,
    name: "Chloe T.",
    role: "First Time Client",
    text: "I was nervous about getting extensions for the first time, but the consultation was so thorough. The hybrid set looks impossibly natural yet glamorous.",
    rating: 5,
  },
  {
    id: 4,
    name: "Jessica B.",
    role: "Model",
    text: "For photoshoots, I need versatility. The mega volume sets here are unclockable on camera. The studio environment is also incredibly relaxing.",
    rating: 5,
  },
  {
    id: 5,
    name: "Aisha K.",
    role: "Regular Client",
    text: "The retention is insane. I easily go 3-4 weeks between fills without them looking sparse. Truly the best investment in my beauty routine.",
    rating: 5,
  }
];

export function ReviewsCarousel() {
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!carouselRef.current) return;

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

      {/* GSAP Marquee Container */}
      <div className="flex w-fit" ref={carouselRef}>
        {/* Double the array to create the infinite scroll illusion */}
        {[...REVIEWS, ...REVIEWS].map((review, index) => (
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
    </section>
  );
}
