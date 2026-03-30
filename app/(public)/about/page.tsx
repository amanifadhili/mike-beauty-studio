import Image from 'next/image';
import { SectionHeading } from '@/components/ui/SectionHeading';
import Link from 'next/link';

export const metadata = {
  title: 'About Mike | Luxury Lash Artist in Kigali',
  description: 'Discover the philosophy behind Mike Beauty Studio. Award-winning lash artistry dedicated to framing your natural beauty in Kigali.',
};

export default function AboutPage() {
  return (
    <div className="bg-cream-white min-h-screen pt-32 pb-24 text-charcoal relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center mb-16 lg:mb-32">
          <div className="relative aspect-[4/5] w-full">
            <Image
              src="/hero/hero_image_one.png"
              alt="Mike Beauty Studio Artist"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            {/* Decorative Gold Frame */}
            <div className="absolute inset-0 border border-gold/30 translate-x-4 translate-y-4 -z-10 hidden md:block"></div>
          </div>
          
          <div className="space-y-8">
            <SectionHeading 
              title="The Philosophy"
              subtitle="Lash extensions should never be 'one size fits all'. We believe in bespoke artistry that respects the health of your natural lashes while delivering undeniable drama."
            />
            
            <div className="space-y-6 font-sans text-gray-600 leading-relaxed text-lg">
              <p>
                Founded in Kigali, Mike Beauty Studio was born from a singular obsession: elevating lash extensions from a simple beauty service into an absolute art form.
              </p>
              <p>
                Every face is a unique canvas. Our approach involves a meticulous consultation to analyze your eye shape, natural lash health, and daily lifestyle before a single extension is applied.
              </p>
              <p>
                We source only the highest-grade, ultra-lightweight faux mink materials and utilize modern, safe adhesive techniques to ensure your set lasts beautifully without compromising your natural lash integrity.
              </p>
            </div>
            
            <div className="pt-8 flex flex-wrap gap-4">
              <div className="border-l-2 border-gold pl-6">
                <span className="block font-playfair text-3xl text-gold mb-1">5+</span>
                <span className="font-sans text-xs uppercase tracking-widest text-gray-500">Years Mastery</span>
              </div>
              <div className="border-l-2 border-gold pl-6">
                <span className="block font-playfair text-3xl text-gold mb-1">1k+</span>
                <span className="font-sans text-xs uppercase tracking-widest text-gray-500">Happy Clients</span>
              </div>
            </div>
          </div>
        </div>

        {/* Global Standard Section */}
        <div className="bg-cream p-8 sm:p-12 md:p-24 text-center border-t border-[#eaeaea] relative">
          <SectionHeading 
            title="A Global Standard in Kigali"
            subtitle="We bring international luxury standards to the heart of Rwanda."
            alignment="center"
          />
          <div className="max-w-2xl mx-auto mt-12 mb-12 font-sans text-gray-600 leading-relaxed">
            <p>
              When you step into our studio, you are stepping away from the rush of the city and into a space designed for absolute relaxation. Enjoy complimentary refreshments, a plush treatment bed, and a meticulous, pain-free application process.
            </p>
          </div>
          <Link 
            href="/booking"
            className="inline-flex h-12 items-center justify-center gap-2 bg-gold text-charcoal transition-colors hover:bg-[#c9a633] px-12 py-6 text-lg tracking-wide rounded-none"
          >
            Experience It Yourself
          </Link>
        </div>

      </div>
    </div>
  );
}
