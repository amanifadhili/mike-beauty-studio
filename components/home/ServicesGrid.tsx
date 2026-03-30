'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { ServiceCard } from '@/components/ui/ServiceCard';
import { useBooking } from '@/components/booking/BookingContext';
import { Prisma } from '@prisma/client';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Defining a type that matches what our getServices action returns
type ServiceWithMedia = Prisma.ServiceGetPayload<{
  include: { medias: true }
}>;

interface ServicesGridProps {
  services: ServiceWithMedia[];
}

export function ServicesGrid({ services }: ServicesGridProps) {
  const { openBooking } = useBooking();
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gridRef.current) return;

    let ctx = gsap.context(() => {
      const cards = gridRef.current!.children;

      // Set initial state
      gsap.set(cards, { y: 100, opacity: 0 });

      // Staggered reveal animation triggered by scroll
      ScrollTrigger.create({
        trigger: gridRef.current,
        start: 'top 80%', // Trigger when the top of the grid hits 80% down the viewport
        onEnter: () => {
          gsap.to(cards, {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.2,
            ease: 'power3.out',
          });
        },
        once: true, // Only run the animation once
      });
    }, gridRef);

    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={gridRef}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
    >
      {services.map((service) => {
        // Find a representative image if available (fallback to undefined if not)
        const imageMedia = service.medias.find(m => m.type === 'image');
        
        return (
          <div key={service.id} className="service-card-wrapper h-full">
            <ServiceCard
              title={service.name}
              description={service.description}
              price={`RWF ${service.price.toLocaleString()}`}
              duration={service.duration}
              imageUrl={imageMedia?.url} // We will handle actual image loading in the gallery phase
              onBookClick={() => openBooking(service.id)}
            />
          </div>
        );
      })}
    </div>
  );
}
