import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'outline-light' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center font-sans tracking-wide transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-none';

  const variants = {
    primary:
      'bg-charcoal text-cream hover:bg-charcoal/90 focus:ring-charcoal',
    secondary:
      'bg-soft-pink text-charcoal hover:bg-soft-pink/80 focus:ring-soft-pink',
    outline:
      'border border-charcoal text-charcoal hover:bg-charcoal hover:text-cream focus:ring-charcoal',
    'outline-light':
      'border border-white/70 text-white hover:bg-white hover:text-charcoal focus:ring-white',
    ghost:
      'bg-transparent text-charcoal hover:bg-charcoal/5 focus:ring-charcoal',
  };

  const sizes = {
    sm: 'h-9 px-4 text-xs uppercase',
    md: 'h-12 px-8 text-sm uppercase',
    lg: 'h-14 px-10 text-base uppercase',
  };

  const width = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${width} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
