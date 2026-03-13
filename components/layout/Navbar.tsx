'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '../ui/Button';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const bgColor = isScrolled ? 'bg-cream/95 backdrop-blur-sm shadow-sm' : 'bg-transparent';
  const textColor = isScrolled || pathname !== '/' ? 'text-charcoal' : 'text-cream';

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${bgColor}`}>
      <div className="container mx-auto px-6 h-20 md:h-24 flex items-center justify-between">
        <Link href="/" className={`font-playfair text-2xl md:text-3xl tracking-tight ${textColor}`}>
          Mike Beauty
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              className={`font-sans text-sm tracking-widest uppercase hover:text-gold transition-colors duration-300 ${textColor} ${
                pathname === link.path ? 'opacity-100' : 'opacity-80'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Link href="/booking">
            <Button variant={isScrolled ? 'primary' : 'outline'} size="sm">
              Book Appointment
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button - simple for now */}
        <button className={`md:hidden ${textColor}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>
    </header>
  );
}
