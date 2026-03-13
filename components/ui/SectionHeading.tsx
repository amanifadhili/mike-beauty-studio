import React from 'react';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  alignment?: 'left' | 'center' | 'right';
  className?: string;
}

export function SectionHeading({
  title,
  subtitle,
  alignment = 'center',
  className = '',
}: SectionHeadingProps) {
  const alignments = {
    left: 'text-left',
    center: 'text-center mx-auto',
    right: 'text-right',
  };

  return (
    <div className={`mb-12 md:mb-16 max-w-3xl ${alignments[alignment]} ${className}`}>
      {subtitle && (
        <span className="block text-gold text-sm md:text-base font-sans tracking-[0.2em] uppercase mb-4">
          {subtitle}
        </span>
      )}
      <h2 className="font-playfair text-3xl md:text-5xl text-charcoal tracking-tight">
        {title}
      </h2>
    </div>
  );
}
