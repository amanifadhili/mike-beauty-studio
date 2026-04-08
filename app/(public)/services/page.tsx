import { Metadata } from 'next';
import { getServices } from '@/app/actions';
import { ServicesGrid } from '@/components/home/ServicesGrid';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Our Services',
  description: 'Explore our luxury beauty services in Kigali, including classic, hybrid, and mega volume lash extensions.',
  alternates: {
    canonical: 'https://mikebeautystudio.com/services',
  },
};

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <main className="min-h-screen bg-cream-white pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm font-sans tracking-[0.2em] uppercase text-charcoal/50 mb-3">
            Mike Beauty Studio
          </p>
          <h1 className="text-4xl md:text-5xl font-playfair text-charcoal mb-6">
            Beauty Services in Kigali
          </h1>
          <p className="text-lg font-sans text-charcoal/70 max-w-2xl mx-auto">
            Discover our full range of tailored treatments spanning exquisite lash extensions, precise eyebrow design, and bridal makeup.
          </p>
        </div>

        <ServicesGrid services={services || []} />
        
        <div className="mt-20 text-center">
          <a
            href="/booking"
            className="inline-block bg-charcoal text-gold px-8 py-4 font-sans tracking-widest text-sm uppercase hover:bg-gold hover:text-charcoal transition-colors duration-300 shadow-xl"
          >
            Book an Appointment
          </a>
        </div>
      </div>
    </main>
  );
}
