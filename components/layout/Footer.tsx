import React from 'react';
import Link from 'next/link';
import { getSettings } from '@/lib/settings';

export async function Footer() {
  const settings = await getSettings();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-charcoal text-cream pt-16 pb-8 border-t border-[#444]">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        {/* Brand */}
        <div className="md:col-span-1">
          <Link href="/" className="font-playfair text-3xl tracking-tight block mb-6">
            Mike Beauty Studio
          </Link>
          <p className="font-sans text-sm text-gray-400 max-w-xs leading-relaxed">
            {settings['SEO_DESCRIPTION'] || 'Premium lash extensions and luxury beauty services in the heart of Kigali. Experience elegance and precision.'}
          </p>
        </div>

        {/* Navigation */}
        <div>
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
        <div>
          <h4 className="font-sans tracking-widest text-gold text-sm uppercase mb-6">Visit Us</h4>
          <address className="not-italic font-sans text-sm text-gray-400 space-y-4">
            <p className="whitespace-pre-line">{settings['STUDIO_ADDRESS'] || '123 Beauty Lane, KN 5 Rd.\nKigali, Rwanda'}</p>
            <p>
              <a href={`tel:${settings['PHONE_NUMBER'] || '+250788000000'}`} className="hover:text-white transition-colors" aria-label="Call Mike Beauty Studio">
                {settings['PHONE_NUMBER'] || '+250 788 000 000'}
              </a>
            </p>
            <p>
              <a href={`mailto:${settings['CONTACT_EMAIL'] || 'hello@mikebeautystudio.rw'}`} className="hover:text-white transition-colors" aria-label="Email Mike Beauty Studio">
                {settings['CONTACT_EMAIL'] || 'hello@mikebeautystudio.rw'}
              </a>
            </p>
          </address>
        </div>

        {/* Hours */}
        <div>
          <h4 className="font-sans tracking-widest text-gold text-sm uppercase mb-6">Hours</h4>
          <ul className="font-sans text-sm text-gray-400 space-y-4">
            <li className="flex justify-between">
              <span>Mon - Fri</span>
              <span>{settings['HOURS_WEEKDAY'] || '9:00 AM - 7:00 PM'}</span>
            </li>
            <li className="flex justify-between">
              <span>Saturday</span>
              <span>{settings['HOURS_WEEKEND'] || '10:00 AM - 6:00 PM'}</span>
            </li>
            <li className="flex justify-between text-gray-500">
              <span>Sunday</span>
              <span>Closed</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="container mx-auto px-6 pt-8 border-t border-[#444] flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 font-sans">
        <p>&copy; {currentYear} Mike Beauty Studio. All rights reserved.</p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-white">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
