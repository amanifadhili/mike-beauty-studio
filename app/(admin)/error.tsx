'use client';

import { useEffect } from 'react';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service in production
    console.error('Admin Error Boundary caught:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 animate-fade-in-up">
      <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-2xl flex flex-col items-center text-center max-w-md shadow-2xl">
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
          <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        
        <h2 className="text-white font-playfair text-2xl mb-3">System Recovery</h2>
        
        <p className="text-red-300/80 font-sans text-sm tracking-wide mb-8 leading-relaxed">
          {error.message || 'An unexpected segmentation fault occurred during data retrieval.'}
        </p>
        
        <button
          onClick={() => reset()}
          className="bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 hover:text-white transition-all px-8 py-2.5 rounded-lg font-sans text-sm tracking-wider uppercase"
        >
          Attempt Restart
        </button>
      </div>
    </div>
  );
}
