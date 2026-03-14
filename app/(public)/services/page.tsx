import { getServices } from '@/app/actions';
import { ServicesGrid } from '@/components/home/ServicesGrid';
import { SectionHeading } from '@/components/ui/SectionHeading';

export const metadata = {
  title: 'Luxury Lash Services | Mike Beauty Studio Kigali',
  description: 'Explore our full menu of premium eyelash extensions including Classic, Hybrid, Light Volume, and Mega Volume sets in Kigali.',
};

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div className="bg-white min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Hero Header */}
        <div className="mb-20">
          <SectionHeading 
            title="Our Signature Treatments"
            subtitle="Explore our comprehensive menu of luxury lash extensions. Every set is meticulously tailored to enhance your natural eye shape, protect your natural lash health, and suit your unique lifestyle."
            alignment="center"
          />
        </div>

        {/* Dynamic Services Grid */}
        {services && services.length > 0 ? (
          <ServicesGrid services={services} />
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 font-sans text-lg">
              No services are currently available. Please check back later or contact us directly.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
