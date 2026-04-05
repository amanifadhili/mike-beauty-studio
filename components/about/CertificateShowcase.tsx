'use client';

import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import { X, ZoomIn, Award, GraduationCap, BookOpen, MapPin } from 'lucide-react';

const credentials = [
  {
    icon: Award,
    label: 'Qualification',
    value: 'Advanced Diploma',
  },
  {
    icon: BookOpen,
    label: 'Specialisation',
    value: 'Beauty Therapy & Aesthetics',
  },
  {
    icon: GraduationCap,
    label: 'Institution',
    value: "Ashley's Hair & Beauty Academy",
  },
  {
    icon: MapPin,
    label: 'Campus',
    value: 'Nairobi',
  },
];

export function CertificateShowcase() {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && close();
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [open, close]);

  return (
    <>
      {/* ─── Section ─────────────────────────────────────────────── */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">

        {/* Subtle background accent */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 70% 40%, #C9A633 0%, transparent 60%)',
          }}
        />

        {/* Section label */}
        <div className="text-center mb-14">
          <span className="inline-block font-sans text-[10px] uppercase tracking-[0.25em] text-gold mb-4">
            Verified Credentials
          </span>
          <h2 className="font-playfair text-3xl sm:text-4xl text-charcoal leading-snug">
            Industry-Certified Excellence
          </h2>
          <p className="mt-4 max-w-xl mx-auto font-sans text-sm text-gray-500 leading-relaxed">
            Every technique applied at Mike Beauty Studio is backed by rigorous
            professional training and internationally recognised qualifications.
          </p>
        </div>

        {/* Card layout */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

          {/* ── Certificate card ── */}
          <div className="group relative">
            {/* Gold offset frame */}
            <div
              aria-hidden
              className="absolute inset-0 translate-x-3 translate-y-3 border border-gold/40"
            />

            {/* Certificate thumbnail */}
            <button
              onClick={() => setOpen(true)}
              aria-label="View certificate full-size"
              className="relative block w-full overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              <div className="relative aspect-[1.414/1] w-full">
                <Image
                  src="/certificate/Ashley_Cert_Mechaque.jpg"
                  alt="Ashley's Hair & Beauty Academy — Advanced Diploma in Beauty Therapy & Aesthetics awarded to Ndayizeye Mechaque"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/30 transition-colors duration-300 flex items-center justify-center">
                <span className="flex items-center gap-2 bg-gold text-charcoal font-sans text-xs uppercase tracking-widest px-5 py-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <ZoomIn size={14} strokeWidth={2} />
                  View Certificate
                </span>
              </div>
            </button>

            {/* Caption */}
            <p className="mt-3 font-sans text-[10px] uppercase tracking-widest text-gray-400 text-center">
              Click to enlarge
            </p>
          </div>

          {/* ── Credential info ── */}
          <div className="space-y-8 lg:pt-4">
            {/* Quote / headline */}
            <blockquote className="border-l-2 border-gold pl-6">
              <p className="font-playfair text-xl sm:text-2xl text-charcoal leading-snug italic">
                "Mastery is the foundation of every set — not just a selling point."
              </p>
            </blockquote>

            <p className="font-sans text-sm text-gray-500 leading-relaxed">
              Mechaque holds an{' '}
              <span className="text-charcoal font-medium">
                Advanced Diploma in Beauty Therapy &amp; Aesthetics
              </span>{' '}
              from Ashley&apos;s Hair &amp; Beauty Academy — one of East Africa&apos;s leading
              accredited beauty institutions. This qualification underpins every service
              offered at Mike Beauty Studio with proven expertise and safety standards.
            </p>

            {/* Credential grid */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
              {credentials.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <span className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center">
                    <Icon size={14} className="text-gold" strokeWidth={1.8} />
                  </span>
                  <div>
                    <span className="block font-sans text-[9px] uppercase tracking-widest text-gray-400 mb-0.5">
                      {label}
                    </span>
                    <span className="font-sans text-sm text-charcoal font-medium">
                      {value}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust badge */}
            <div className="flex items-center gap-3 border border-gold/30 p-4 bg-gold/5">
              <Award size={20} className="text-gold flex-shrink-0" strokeWidth={1.5} />
              <p className="font-sans text-xs text-gray-500 leading-relaxed">
                Accredited by{' '}
                <span className="text-charcoal font-medium">
                  Ashley&apos;s Hair &amp; Beauty Academy
                </span>
                , certified by the{' '}
                <span className="text-charcoal font-medium">Dean of Students</span> and{' '}
                <span className="text-charcoal font-medium">Founder &amp; CEO</span>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Lightbox ────────────────────────────────────────────── */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Certificate full-size view"
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8 animate-fadeIn"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-charcoal/90 backdrop-blur-sm"
            onClick={close}
          />

          {/* Image container */}
          <div className="relative z-10 w-full max-w-4xl">
            {/* Close button */}
            <button
              onClick={close}
              aria-label="Close certificate view"
              className="absolute -top-4 -right-4 z-20 w-10 h-10 bg-gold flex items-center justify-center hover:bg-[#c9a633] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <X size={16} className="text-charcoal" strokeWidth={2.5} />
            </button>

            {/* Certificate */}
            <div className="relative w-full aspect-[1.414/1] shadow-2xl">
              <Image
                src="/certificate/Ashley_Cert_Mechaque.jpg"
                alt="Ashley's Hair & Beauty Academy — Advanced Diploma in Beauty Therapy & Aesthetics awarded to Ndayizeye Mechaque"
                fill
                className="object-contain"
                sizes="90vw"
                priority
              />
            </div>

            {/* Caption strip */}
            <div className="mt-4 text-center font-sans text-xs uppercase tracking-widest text-white/50">
              Ashley&apos;s Hair &amp; Beauty Academy &mdash; Advanced Diploma in Beauty Therapy &amp; Aesthetics
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease; }
      `}</style>
    </>
  );
}
