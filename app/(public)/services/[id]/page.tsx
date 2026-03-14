import { getServiceById } from '@/app/actions';
import { notFound } from 'next/navigation';
import { SectionHeading } from '@/components/ui/SectionHeading';
import Link from 'next/link';

// Next.js 14 Dynamic Route Types
type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const service = await getServiceById(id);
  
  if (!service) {
    return { title: 'Service Not Found | Mike Beauty Studio' };
  }

  return {
    title: `${service.name} | Premium Lash Extensions`,
    description: service.description,
    openGraph: {
      title: `${service.name} at Mike Beauty Studio`,
      description: service.description,
      type: 'article', // Using article for specific services
      url: `https://mikebeautystudio.com/services/${service.id}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${service.name} | Mike Beauty Studio`,
      description: service.description,
    }
  };
}

export default async function SingleServicePage({ params }: Props) {
  const { id } = await params;
  const service = await getServiceById(id);

  if (!service) {
    notFound();
  }

  return (
    <div className="bg-cream-white min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Left Column: Media / Hero Representation */}
          <div className="w-full aspect-[4/5] bg-gray-100 flex items-center justify-center relative overflow-hidden">
            {/* Context: Actual images will be loaded later during the Gallery manager phase */}
            <div className="absolute inset-0 bg-charcoal/5 flex flex-col items-center justify-center p-8 text-center border border-[#eaeaea]">
               <span className="font-playfair text-3xl text-gray-400 mb-4 opacity-50 block">Luxury Preview</span>
               <p className="font-sans text-sm text-gray-500 uppercase tracking-widest">
                 {service.name} Gallery
               </p>
            </div>
          </div>

          {/* Right Column: Service Details & Booking */}
          <div className="flex flex-col sticky top-32">
            
            <SectionHeading 
              title={service.name}
              subtitle="Signature Treatment Sequence"
              alignment="left"
              className="mb-8"
            />

            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-[#eaeaea]">
              <div className="flex flex-col">
                <span className="text-sm font-sans text-gray-500 uppercase tracking-wider mb-1">Investment</span>
                <span className="font-playfair text-3xl text-gold">RWF {service.price.toLocaleString()}</span>
              </div>
              <div className="w-px h-12 bg-[#eaeaea] mx-4"></div>
              <div className="flex flex-col">
                <span className="text-sm font-sans text-gray-500 uppercase tracking-wider mb-1">Time</span>
                <span className="font-sans text-lg text-charcoal">{service.duration}</span>
              </div>
            </div>

            <div className="prose prose-lg text-gray-600 font-sans mb-12">
              <p className="leading-relaxed">
                {service.description}
              </p>
              <p className="mt-6 leading-relaxed">
                Every appointment at Mike Beauty Studio begins with a customized consultation to ensure the utmost care is taken regarding your natural eye shape and lash health. We only use premium, hypoallergenic adhesives and cruelty-free extensions.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
               <Link 
                 href={`/booking?service=${service.id}`}
                 className="flex h-12 w-full sm:w-auto items-center justify-center gap-2 bg-charcoal text-cream-white transition-colors hover:bg-[#383838] px-12 py-6 text-lg tracking-wide rounded-none"
               >
                 Secure Appointment
               </Link>
               <Link 
                 href="/services"
                 className="flex h-12 w-full sm:w-auto items-center justify-center gap-2 border border-charcoal text-charcoal transition-colors hover:bg-gray-50 px-8 py-6 text-lg tracking-wide rounded-none"
               >
                 Back to Menu
               </Link>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
