import { getServices } from '@/app/actions';
import { BookingForm } from '@/components/booking/BookingForm';
import { SectionHeading } from '@/components/ui/SectionHeading';

export const metadata = {
  title: 'Book an Appointment | Mike Beauty Studio',
  description: 'Schedule your luxury lash extension appointment in Kigali. Secure your spot for Classic, Hybrid, or Volume sets.',
};

export default async function BookingPage({
  searchParams,
}: {
  searchParams: { service?: string };
}) {
  // Fetch services for the dropdown
  const services = await getServices();
  
  // Extract pre-selected service if coming from a /services/[id] CTA
  const preSelectedServiceId = searchParams.service || '';

  return (
    <div className="bg-cream-white min-h-screen pt-24 md:pt-32 pb-24 text-charcoal relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <SectionHeading 
            title="Secure Your Appointment"
            subtitle="Please provide your details below. We require a 20% non-refundable deposit to secure all bookings. Our team will contact you via WhatsApp for payment details."
            alignment="center"
            className="[&>span]:text-gold"
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-12 max-w-5xl mx-auto">
          
          {/* Form Column */}
          <div className="flex-1 bg-white p-5 sm:p-8 md:p-12 border border-[#eaeaea] shadow-sm">
            <BookingForm 
              services={services.map(s => ({ id: s.id, name: s.name, price: s.price }))} 
              preSelectedServiceId={preSelectedServiceId}
            />
          </div>

          {/* Info Card Column */}
          <div className="w-full lg:w-96 space-y-8 order-last lg:order-none">
            <div className="bg-cream p-8 border border-[#eaeaea]">
              <h3 className="font-playfair text-2xl text-gold mb-4">Studio Policies</h3>
              <ul className="space-y-4 font-sans text-sm text-gray-600">
                <li className="flex gap-3">
                  <span className="text-gold mt-1">•</span>
                  <span><strong>Deposits:</strong> A 20% deposit is required within 24 hours of booking to secure your slot.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-gold mt-1">•</span>
                  <span><strong>Cancellations:</strong> Please provide at least 48 hours notice to reschedule without losing your deposit.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-gold mt-1">•</span>
                  <span><strong>Arrival:</strong> Please arrive with clean, makeup-free lashes to maximize your lashing time.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-gold mt-1">•</span>
                  <span><strong>Late Policy:</strong> Showing up more than 15 minutes late may result in a cancelled appointment.</span>
                </li>
              </ul>
            </div>

            <div className="bg-cream p-8 border border-[#eaeaea] text-center">
              <h3 className="font-playfair text-xl text-charcoal mb-2">Need Help?</h3>
              <p className="font-sans text-sm text-gray-500 mb-6">Contact our team directly for special requests or group bookings.</p>
              <a href="https://wa.me/250700000000" className="inline-block border border-gold text-gold hover:bg-gold hover:text-charcoal px-6 py-3 font-sans text-sm tracking-wider transition-colors duration-300">
                Chat on WhatsApp
              </a>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
