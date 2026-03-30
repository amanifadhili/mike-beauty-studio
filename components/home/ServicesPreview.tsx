import { getServices } from '@/app/actions';
import { ServicesGrid } from '@/components/home/ServicesGrid';
import { SectionHeading } from '@/components/ui/SectionHeading';

export async function ServicesPreview() {
  // Fetch services from the database on the server
  const services = await getServices();

  // If no services yet, don't break the layout, but show a placeholder or nothing
  if (!services || services.length === 0) {
    return null; 
  }

  // Display all services on the home page as requested
  const displayServices = services;

  return (
    <section id="services" className="py-32 bg-cream-white relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading 
          title="Signature Treatments"
          subtitle="Explore our luxury lash extensions, customized specifically for your eye shape and lifestyle."
          alignment="center"
        />
        
        {/* The Grid itself needs to be a Client Component to run GSAP animations */}
        <div className="mt-20">
          <ServicesGrid services={displayServices} />
        </div>
      </div>
    </section>
  );
}
