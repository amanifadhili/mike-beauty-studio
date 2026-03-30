import Image from 'next/image';
import { SectionHeading } from '@/components/ui/SectionHeading';
import Link from 'next/link';
import { BookingTrigger } from '@/components/booking/BookingTrigger';

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
          <div className="relative aspect-square w-4/5 mx-auto lg:ml-0 lg:mr-auto">
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
              subtitle="Bespoke luxury lash artistry Kigali."
            />
            
            <div className="space-y-6 font-sans text-gray-600 leading-relaxed text-sm">
              <p>
                At Mike Beauty Studio, we elevate lash extensions into an absolute art form. We don't do "one size fits all"—every set begins with a meticulous consultation to ensure stunning, undeniable drama that never compromises the health of your natural lashes.
              </p>
              <p>
                Experience the perfect blend of ultra-lightweight luxury materials and advanced styling techniques, tailored precisely to frame your natural beauty. Let your eyes do the talking.
              </p>
            </div>
            
            <div className="pt-8 flex flex-wrap gap-6">
              <div className="border-l-2 border-gold pl-6">
                <span className="block font-playfair text-xl text-gold mb-1">5+</span>
                <span className="font-sans text-[10px] uppercase tracking-widest text-gray-500">Years Mastery</span>
              </div>
              <div className="border-l-2 border-gold pl-6">
                <span className="block font-playfair text-xl text-gold mb-1">1k+</span>
                <span className="font-sans text-[10px] uppercase tracking-widest text-gray-500">Happy Clients</span>
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
          <BookingTrigger 
            className="inline-flex h-12 items-center justify-center gap-2 bg-gold text-charcoal transition-colors hover:bg-[#c9a633] px-12 py-6 text-lg tracking-wide rounded-none"
          >
            Experience It Yourself
          </BookingTrigger>
        </div>

      </div>
    </div>
  );
}
