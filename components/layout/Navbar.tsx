'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '../ui/Button';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
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

  const bgColor = isScrolled || isMenuOpen
    ? 'bg-cream/95 backdrop-blur-sm shadow-sm'
    : 'bg-transparent';

  const textColor = isScrolled || isMenuOpen || pathname !== '/'
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
            <Link href="/booking">
              <Button variant={isScrolled ? 'primary' : 'outline'} size="sm">
                Book Appointment
              </Button>
            </Link>
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
            <Link href="/booking" className="block">
              <Button variant="primary" size="lg" fullWidth>
                Book Appointment
              </Button>
            </Link>
          </div>
        </nav>

        {/* Bottom brand stamp */}
        <p className="text-center font-sans text-xs text-gray-400 pb-8 tracking-widest uppercase">
          Mike Beauty Studio · Kigali
        </p>
      </div>
    </>
  );
}
