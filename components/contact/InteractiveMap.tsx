'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// ─── Studio Location ───────────────────────────────────────────────────────────
const STUDIO_LAT = -1.9547517;
const STUDIO_LNG = 30.0881958;
const STUDIO_ZOOM = 15;

// ─── Custom Gold SVG Marker ────────────────────────────────────────────────────
const goldPinSVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 56" width="40" height="56">
  <defs>
    <filter id="shadow" x="-30%" y="-10%" width="160%" height="140%">
      <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="rgba(0,0,0,0.4)"/>
    </filter>
  </defs>
  <!-- Outer ring animation -->
  <circle cx="20" cy="20" r="18" fill="rgba(212,175,55,0.15)" stroke="#D4AF37" stroke-width="1.5"/>
  <!-- Pin body -->
  <path d="M20 2 C11.2 2 4 9.2 4 18 C4 28.5 20 52 20 52 C20 52 36 28.5 36 18 C36 9.2 28.8 2 20 2Z"
        fill="#D4AF37" filter="url(#shadow)" />
  <!-- Inner circle -->
  <circle cx="20" cy="18" r="7" fill="#1a1a1a"/>
  <!-- M letter for Mike -->
  <text x="20" y="22" text-anchor="middle" font-family="Georgia, serif"
        font-size="9" font-weight="bold" fill="#D4AF37">M</text>
</svg>`;

const goldIcon = typeof window !== 'undefined'
  ? L.divIcon({
      html: goldPinSVG,
      className: '',
      iconSize: [40, 56],
      iconAnchor: [20, 56],
      popupAnchor: [0, -58],
    })
  : undefined;

// ─── Map Style Overrides (injected once) ───────────────────────────────────────
const MAP_STYLES = `
  .leaflet-container {
    font-family: inherit;
    background: #1a1a1a;
  }
  .leaflet-popup-content-wrapper {
    background: #1a1a1a;
    border: 1px solid rgba(212,175,55,0.3);
    border-radius: 0;
    box-shadow: 0 8px 32px rgba(0,0,0,0.5);
    color: #FFFDF5;
    padding: 0;
  }
  .leaflet-popup-content {
    margin: 0;
    line-height: 1.5;
  }
  .leaflet-popup-tip {
    background: #1a1a1a;
    border: 1px solid rgba(212,175,55,0.3);
  }
  .leaflet-popup-close-button {
    color: #D4AF37 !important;
    font-size: 20px !important;
    padding: 6px 10px !important;
  }
  .leaflet-popup-close-button:hover {
    color: #FFFDF5 !important;
  }
  .leaflet-control-zoom {
    border: 1px solid rgba(212,175,55,0.2) !important;
    border-radius: 0 !important;
  }
  .leaflet-control-zoom a {
    background: #1a1a1a !important;
    color: #D4AF37 !important;
    border-bottom: 1px solid rgba(212,175,55,0.2) !important;
    width: 34px !important;
    height: 34px !important;
    line-height: 34px !important;
    font-size: 18px !important;
  }
  .leaflet-control-zoom a:hover {
    background: #2a2a2a !important;
    color: #FFFDF5 !important;
  }
  .leaflet-control-attribution {
    background: rgba(26,26,26,0.85) !important;
    color: rgba(255,255,255,0.35) !important;
    font-size: 10px !important;
  }
  .leaflet-control-attribution a {
    color: rgba(212,175,55,0.5) !important;
  }
  /* Pulsing ring around pin */
  @keyframes mb-pulse {
    0%   { transform: scale(1);   opacity: 0.6; }
    100% { transform: scale(2.2); opacity: 0; }
  }
  .mb-pulse-ring {
    position: absolute;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: rgba(212,175,55,0.35);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation: mb-pulse 1.8s ease-out infinite;
    pointer-events: none;
  }
`;

function injectMapStyles() {
  if (document.getElementById('mb-map-styles')) return;
  const style = document.createElement('style');
  style.id = 'mb-map-styles';
  style.textContent = MAP_STYLES;
  document.head.appendChild(style);
}

// ─── Popup HTML ────────────────────────────────────────────────────────────────
const POPUP_HTML = `
  <div style="padding:16px 20px;min-width:220px;">
    <p style="font-family:Georgia,serif;font-size:15px;color:#D4AF37;margin:0 0 6px;letter-spacing:0.04em;">
      Mike Beauty Studio
    </p>
    <p style="font-size:12px;color:rgba(255,253,245,0.7);margin:0 0 12px;line-height:1.6;">
      Kigali Heights, 4th Floor<br/>KG 7 Ave, Kigali, Rwanda
    </p>
    <a
      href="https://www.google.com/maps/dir/?api=1&destination=-1.9547517,30.0881958"
      target="_blank"
      rel="noopener noreferrer"
      style="display:inline-flex;align-items:center;gap:6px;font-size:11px;
             letter-spacing:0.1em;text-transform:uppercase;color:#D4AF37;
             border:1px solid rgba(212,175,55,0.4);padding:6px 12px;
             text-decoration:none;transition:all 0.2s;"
      onmouseover="this.style.background='rgba(212,175,55,0.1)'"
      onmouseout="this.style.background='transparent'"
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
           stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="10" r="3"/><path d="M12 2a8 8 0 0 0-8 8c0 5.4 7.05 12.5 8 13.4.95-.9 8-8 8-13.4A8 8 0 0 0 12 2z"/>
      </svg>
      Get Directions
    </a>
  </div>
`;

// ─── Component ─────────────────────────────────────────────────────────────────
export default function InteractiveMap() {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    injectMapStyles();

    const map = L.map(containerRef.current, {
      center: [STUDIO_LAT, STUDIO_LNG],
      zoom: STUDIO_ZOOM,
      zoomControl: false,
      scrollWheelZoom: false,   // disabled by default — user must click map first
      attributionControl: true,
    });

    // Dark tile layer — CartoDB Dark Matter (free, no API key)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    // Zoom control — bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Marker + popup
    if (goldIcon) {
      const marker = L.marker([STUDIO_LAT, STUDIO_LNG], { icon: goldIcon }).addTo(map);
      marker.bindPopup(L.popup({ maxWidth: 300, minWidth: 220 }).setContent(POPUP_HTML));
      // Open popup on load after a brief delay
      setTimeout(() => marker.openPopup(), 800);
    }

    // Enable scroll zoom only after clicking into the map; disable on mouse leave
    map.on('click', () => map.scrollWheelZoom.enable());
    map.getContainer().addEventListener('mouseleave', () => map.scrollWheelZoom.disable());

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[400px] lg:min-h-full">
      {/* Map container */}
      <div ref={containerRef} className="absolute inset-0" />
      {/* Top-left gold border accent */}
      <div
        className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-gold z-[500] pointer-events-none"
        aria-hidden="true"
      />
      {/* Bottom-right gold border accent */}
      <div
        className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-gold z-[500] pointer-events-none"
        aria-hidden="true"
      />
      {/* Scroll hint overlay — shown until first click */}
      <div
        id="mb-map-hint"
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-[500] pointer-events-none"
      >
        <span className="bg-black/60 text-white/60 text-[10px] tracking-widest uppercase px-3 py-1 backdrop-blur-sm">
          Click map to enable scroll zoom
        </span>
      </div>
    </div>
  );
}
