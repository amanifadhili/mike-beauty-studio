import React from 'react';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  alignment?: 'left' | 'center' | 'right';
  className?: string;
  isH1?: boolean;
}

export function SectionHeading({
  title,
  subtitle,
  alignment = 'center',
  className = '',
  isH1 = false,
}: SectionHeadingProps) {
  const alignments = {
    left: 'text-left',
    center: 'text-center mx-auto',
    right: 'text-right',
  };

  return (
    <div className={`mb-12 md:mb-16 max-w-3xl ${alignments[alignment]} ${className}`}>
      {subtitle && (
        <span className="block text-gold text-xs md:text-sm font-sans tracking-[0.2em] uppercase mb-4">
          {subtitle}
        </span>
      )}
      {isH1 ? (
        <h1 className="font-playfair text-3xl md:text-5xl text-charcoal tracking-tight">
          {title}
        </h1>
      ) : (
        <h2 className="font-playfair text-2xl md:text-4xl text-charcoal tracking-tight">
          {title}
        </h2>
      )}
    </div>
  );
}
