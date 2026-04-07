import React from 'react';
import Link from 'next/link';
import { getSettings } from '@/lib/settings';

export async function Footer() {
  const settings = await getSettings();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-charcoal text-cream pt-16 pb-28 border-t border-[#444]">
      <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-12 gap-y-12 gap-x-6 md:gap-8 mb-16">
        {/* Brand */}
        <div className="col-span-2 md:col-span-4 lg:col-span-4 lg:pr-8 order-1">
          <Link href="/" className="font-playfair text-3xl tracking-tight block mb-6">
            Mike Beauty Studio
          </Link>
          <p className="font-sans text-sm text-gray-400 max-w-sm leading-relaxed mb-6">
            {settings['SEO_DESCRIPTION'] || 'Premium lash extensions and luxury beauty services in the heart of Kigali. Experience elegance and precision.'}
          </p>
          <div className="flex gap-4 items-center">
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
        </div>

        {/* Navigation */}
        <div className="col-span-1 md:col-span-2 lg:col-span-2 order-2">
          <h4 className="font-sans tracking-widest text-gold text-sm uppercase mb-6">Explore</h4>
          <ul className="space-y-4">
            {[
              { label: 'Home', href: '/' },
              { label: 'Services', href: '/#services' },
              { label: 'Gallery', href: '/gallery' },
              { label: 'About', href: '/about' },
            ].map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="font-sans text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {item.label}
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
