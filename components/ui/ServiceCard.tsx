import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from './Button';

interface ServiceCardProps {
  title: string;
  description: string;
  price: string;
  duration?: string;
  imageUrl?: string;
  href?: string;
  onBookClick?: () => void;
}

export function ServiceCard({
  title,
  description,
  price,
  duration,
  imageUrl,
  href,
  onBookClick,
}: ServiceCardProps) {
  return (
    <div className="group relative flex flex-col pt-6 pb-6 px-6 bg-cream border border-[#eaeaea] hover:border-soft-pink transition-colors duration-300">
      <div className="flex-1 flex flex-col items-center text-center">
        {imageUrl && (
          <div className="mb-4 w-full h-48 sm:h-56 relative overflow-hidden">
            <Image
              src={imageUrl}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        )}
        <h3 className="font-playfair text-xl md:text-2xl text-charcoal mb-2">{title}</h3>
        <p className="text-gray-600 font-sans text-sm mb-4 max-w-sm line-clamp-3">
          {description}
        </p>
        
        <div className="mt-auto mb-5 flex flex-col items-center gap-1">
          <span className="font-playfair text-lg md:text-xl text-gold">{price}</span>
          {duration && (
            <span className="text-xs text-gray-500 font-sans tracking-wide uppercase">
              {duration}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-auto">
        <Button variant="primary" fullWidth onClick={onBookClick}>
          Book Now
        </Button>
        {href && (
          <Link href={href} className="text-center font-sans text-[10px] uppercase tracking-widest text-charcoal/60 hover:text-gold transition-colors py-2 mt-1 border border-transparent hover:border-gold/10 rounded">
            View Service Details &rarr;
          </Link>
        )}
      </div>
    </div>
  );
}
