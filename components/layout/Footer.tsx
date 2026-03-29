import React from 'react';
import Link from 'next/link';
import { getSettings } from '@/lib/settings';

export async function Footer() {
  const settings = await getSettings();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-charcoal text-cream pt-16 pb-8 border-t border-[#444]">
      <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-12 gap-y-12 gap-x-6 md:gap-8 mb-16">
        {/* Brand */}
        <div className="col-span-2 md:col-span-4 lg:col-span-4 lg:pr-8 order-1">
          <Link href="/" className="font-playfair text-3xl tracking-tight block mb-6">
            Mike Beauty Studio
          </Link>
          <p className="font-sans text-sm text-gray-400 max-w-sm leading-relaxed">
            {settings['SEO_DESCRIPTION'] || 'Premium lash extensions and luxury beauty services in the heart of Kigali. Experience elegance and precision.'}
          </p>
        </div>

        {/* Navigation */}
        <div className="col-span-1 md:col-span-2 lg:col-span-2 order-2">
          <h4 className="font-sans tracking-widest text-gold text-sm uppercase mb-6">Explore</h4>
          <ul className="space-y-4">
            {['Home', 'Services', 'Gallery', 'About'].map((item) => (
              <li key={item}>
                <Link
                  href={`/${item.toLowerCase() === 'home' ? '' : item.toLowerCase()}`}
                  className="font-sans text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="col-span-2 md:col-span-3 lg:col-span-3 order-4 md:order-3">
          <h4 className="font-sans tracking-widest text-gold text-sm uppercase mb-6">Visit Us</h4>
          <address className="not-italic font-sans text-sm text-gray-400 space-y-4">
            <p className="whitespace-pre-line leading-relaxed">{settings['STUDIO_ADDRESS'] || '123 Beauty Lane, KN 5 Rd.\nKigali, Rwanda'}</p>
            <p>
              <a href={`tel:${settings['PHONE_NUMBER'] || '+250788000000'}`} className="hover:text-white transition-colors block py-0.5" aria-label="Call Mike Beauty Studio">
                {settings['PHONE_NUMBER'] || '+250 788 000 000'}
              </a>
            </p>
            <p>
              <a href={`mailto:${settings['CONTACT_EMAIL'] || 'hello@mikebeautystudio.rw'}`} className="hover:text-white transition-colors break-words block py-0.5" aria-label="Email Mike Beauty Studio">
                {settings['CONTACT_EMAIL'] || 'hello@mikebeautystudio.rw'}
              </a>
            </p>
          </address>
        </div>

        {/* Hours */}
        <div className="col-span-1 md:col-span-3 lg:col-span-3 order-3 md:order-4">
          <h4 className="font-sans tracking-widest text-gold text-sm uppercase mb-6">Hours</h4>
          <ul className="font-sans text-sm text-gray-400 space-y-4">
            <li className="flex flex-col lg:flex-row lg:justify-between gap-1 lg:gap-4">
              <span className="text-white">Mon - Fri</span>
              <span className="text-gray-400">{settings['HOURS_WEEKDAY'] || '9 AM - 7 PM'}</span>
            </li>
            <li className="flex flex-col lg:flex-row lg:justify-between gap-1 lg:gap-4">
              <span className="text-white">Saturday</span>
              <span className="text-gray-400">{settings['HOURS_WEEKEND'] || '10 AM - 6 PM'}</span>
            </li>
            <li className="flex flex-col lg:flex-row lg:justify-between gap-1 lg:gap-4 text-gray-600">
              <span>Sunday</span>
              <span>Closed</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="container mx-auto px-6 pt-8 border-t border-[#444] flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 font-sans">
        <p className="mb-4 md:mb-0 text-center md:text-left">&copy; {currentYear} Mike Beauty Studio. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
