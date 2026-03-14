'use client';

import dynamic from 'next/dynamic';

/**
 * MapWrapper
 * ==========
 * SSR-safe wrapper for the Leaflet interactive map.
 * Uses next/dynamic with { ssr: false } because Leaflet directly
 * accesses browser globals (window, document) that don't exist on the server.
 */

const InteractiveMap = dynamic(() => import('./InteractiveMap'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-[#1a1a1a] flex items-center justify-center">
      {/* Animated loading state matching the dark theme */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-gold/20" />
          <div className="absolute inset-0 rounded-full border-t-2 border-gold animate-spin" />
        </div>
        <p className="font-sans text-xs tracking-widest uppercase text-white/30">
          Loading Map&hellip;
        </p>
      </div>
    </div>
  ),
});

export function MapWrapper() {
  return (
    <div className="relative w-full h-full min-h-[400px] lg:min-h-full">
      <InteractiveMap />
    </div>
  );
}
