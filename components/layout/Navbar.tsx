'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '../ui/Button';
import { useBooking } from '@/components/booking/BookingContext';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/#services' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

export function Navbar({ settings = {} }: { settings?: Record<string, string> }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { openBooking } = useBooking();

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change & handle robust cross-page hash scroll
  useEffect(() => {
    setIsMenuOpen(false);
    
    // Explicitly handle Next.js hash scrolling when jumping between distinct pages
    if (window.location.hash) {
      setTimeout(() => {
        const el = document.querySelector(window.location.hash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100); // Slight delay allows Next.js the time to fully render the DOM of the new page
    }
  }, [pathname]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  // On the homepage: transparent until scrolled (hero image shows behind).
  // On all other pages (gallery, about, contact, etc.): always show frosted bg
  // so that charcoal text is readable over the dark bg-charcoal page background.
  const isHomePage = pathname === '/';
  
  const isSolidNav = isScrolled || isMenuOpen || !isHomePage;

  const bgColor = isSolidNav
    ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-[#eaeaea]/30'
    : 'bg-transparent';

  const textColor = isSolidNav
    ? 'text-charcoal'
    : 'text-cream';

  return (
    <>
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${bgColor}`}>
        <div className="container mx-auto px-5 h-20 flex items-center justify-between">

          {/* Logo */}
          <Link
            href="/"
            className={`font-playfair text-2xl md:text-3xl tracking-tight shrink-0 ${textColor}`}
          >
            Mike Beauty
          </Link>

          {/* ─── Desktop Nav ─── */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                className={`font-sans text-sm tracking-widest uppercase hover:text-gold transition-colors duration-300 ${textColor} ${
                  pathname === link.path ? 'opacity-100' : 'opacity-70 hover:opacity-100'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:block shrink-0">
            <Button 
              variant={isSolidNav ? 'primary' : 'outline-light'} 
              size="sm"
              onClick={() => openBooking()}
            >
              Book Appointment
            </Button>
          </div>

          {/* ─── Mobile Hamburger / Close Button ─── */}
          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
            className={`md:hidden w-10 h-10 flex flex-col items-center justify-center gap-[6px] rounded-lg transition-colors duration-200 ${textColor}`}
          >
            {isMenuOpen ? (
              /* X icon */
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              /* Hamburger icon */
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* ─── Mobile Full-Screen Drawer ─── */}
      <div
        aria-hidden={!isMenuOpen}
        className={`
          md:hidden fixed inset-0 z-40
          bg-cream flex flex-col
          transition-all duration-300 ease-in-out
          ${isMenuOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-4 pointer-events-none'
          }
        `}
      >
        {/* Spacer for the fixed header */}
        <div className="h-20 shrink-0" />

        {/* Nav Links */}
        <nav className="flex flex-col items-center justify-center flex-1 gap-2 px-8 pb-12">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              className={`w-full text-center font-playfair text-3xl text-charcoal py-4 border-b border-[#eaeaea] transition-colors duration-200 hover:text-gold ${
                pathname === link.path ? 'text-gold' : ''
              }`}
            >
              {link.name}
            </Link>
          ))}

          {/* CTA Book Button */}
          <div className="mt-8 w-full">
            <Button 
              variant="primary" 
              size="lg" 
              fullWidth
              onClick={() => {
                setIsMenuOpen(false);
                openBooking();
              }}
            >
              Book Appointment
            </Button>
          </div>
        </nav>

        {/* Dynamic Social Links inside Drawer */}
        <div className="flex gap-4 items-center justify-center mb-6">
            {settings['INSTAGRAM_URL'] && (
              <a href={settings['INSTAGRAM_URL']} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-gold transition-colors" aria-label="Instagram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 10-2.881.001 1.44 1.44 0 002.881-.001z"/></svg>
              </a>
            )}
            {settings['TIKTOK_URL'] && (
              <a href={settings['TIKTOK_URL']} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-gold transition-colors" aria-label="TikTok">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 3.06-1.35 6.19-3.9 8.01-2.5 1.78-5.74 2.15-8.61 1.05-2.82-1.07-4.93-3.61-5.32-6.62-.4-3.08.77-6.26 3.14-8.23 2.13-1.78 5.09-2.3 7.72-1.44v4.25c-1.11-.64-2.58-.69-3.77-.04-1.39.73-2.2 2.37-1.85 3.92.36 1.67 1.83 3.01 3.51 3.25 1.79.25 3.73-.55 4.67-2.11.86-1.43.86-3.12.86-4.75V.02z"/></svg>
              </a>
            )}
            {settings['YOUTUBE_URL'] && (
              <a href={settings['YOUTUBE_URL']} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-gold transition-colors" aria-label="YouTube">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.054 0 12 0 12s0 3.946.501 5.814a3.016 3.016 0 0 0 2.122 2.136c1.872.55 9.377.55 9.377.55s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.946 24 12 24 12s0-3.946-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            )}
            {settings['FACEBOOK_URL'] && (
              <a href={settings['FACEBOOK_URL']} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-gold transition-colors" aria-label="Facebook">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
              </a>
            )}
            {settings['TWITTER_URL'] && (
              <a href={settings['TWITTER_URL']} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-gold transition-colors" aria-label="X (Twitter)">
                 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
            )}
        </div>

        {/* Bottom brand stamp */}
        <p className="text-center font-sans text-xs text-gray-400 pb-8 tracking-widest uppercase">
          Mike Beauty Studio · Kigali
        </p>
      </div>
    </>
  );
}
