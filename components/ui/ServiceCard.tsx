import React from 'react';
import Image from 'next/image';
import { Button } from './Button';

interface ServiceCardProps {
  title: string;
  description: string;
  price: string;
  duration?: string;
  imageUrl?: string;
  onBookClick?: () => void;
}

export function ServiceCard({
  title,
  description,
  price,
  duration,
  imageUrl,
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
      </div>
    </div>
  );
}
