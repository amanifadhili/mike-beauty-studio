'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Public Error Boundary caught:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-cream px-4">
      <div className="max-w-lg text-center bg-white p-12 shadow-sm rounded-none border border-[#eaeaea]">
        <span className="font-sans text-gold tracking-widest uppercase text-sm mb-4 block animate-pulse">
          Connection Interrupted
        </span>
        
        <h1 className="font-playfair text-4xl sm:text-5xl text-charcoal mb-6 leading-tight">
          Our servers are taking a <br /> <span className="italic text-soft-pink">beauty rest.</span>
        </h1>
        
        <p className="text-gray-600 font-sans mb-10 leading-relaxed max-w-md mx-auto">
          We apologize for the inconvenience. Our technical team has been notified. Please try refreshing your browser.
        </p>
        
        <Button variant="primary" onClick={() => reset()} className="px-10 py-5 text-sm tracking-widest uppercase">
          Refresh Experience
        </Button>
      </div>
    </div>
  );
}
