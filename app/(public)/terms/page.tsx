import { SectionHeading } from '@/components/ui/SectionHeading';
import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service | Mike Beauty Studio',
  description: 'The terms and conditions governing the use of Mike Beauty Studio services.',
};

export default function TermsOfServicePage() {
  return (
    <main className="bg-cream min-h-screen">
      <div className="container mx-auto max-w-3xl px-6 py-32 md:py-40">
        <div className="mb-12">
          <SectionHeading title="Terms of Service" subtitle="Studio Policies" />
        </div>

        <div className="prose prose-lg prose-headings:font-playfair prose-headings:text-charcoal prose-p:font-sans prose-p:text-charcoal/70 prose-p:leading-relaxed prose-li:font-sans prose-li:text-charcoal/70 prose-a:text-gold hover:prose-a:text-charcoal transition-colors max-w-none">
          
          <h2 className="font-playfair text-2xl text-charcoal mt-10 mb-4">1. Agreement to Terms</h2>
          <p className="font-sans text-charcoal/70 leading-relaxed mb-6 block">
            By accessing or using the Mike Beauty Studio website and booking our services, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access the service. These Terms apply to all visitors, users, clients, and others who access or use our services.
          </p>

          <h2 className="font-playfair text-2xl text-charcoal mt-10 mb-4">2. Booking and Cancellation Policy</h2>
          <p className="font-sans text-charcoal/70 leading-relaxed mb-6 block">
            We value the time of our artists and our clients. Please review our booking policies carefully:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-charcoal/70 font-sans mb-6">
            <li><strong>Appointments:</strong> All bookings are subject to availability and confirmation by our staff.</li>
            <li><strong>Cancellations:</strong> We require at least 24 hours notice for any cancellations or rescheduling. Failure to do so may result in a cancellation fee or forfeiture of your deposit.</li>
            <li><strong>Late Arrivals:</strong> If you arrive more than 15 minutes late for your appointment, we may need to reschedule and a late fee may apply.</li>
          </ul>

          <h2 className="font-playfair text-2xl text-charcoal mt-10 mb-4">3. Right to Refuse Service</h2>
          <p className="font-sans text-charcoal/70 leading-relaxed mb-6 block">
            Mike Beauty Studio reserves the right to refuse service to anyone at any time for any reason. We maintain a safe, respectful, and professional environment for both our staff and our clients. Disruptive, inappropriate, or abusive behavior will result in immediate termination of the appointment without a refund.
          </p>

          <h2 className="font-playfair text-2xl text-charcoal mt-10 mb-4">4. Client Responsibilities</h2>
          <p className="font-sans text-charcoal/70 leading-relaxed mb-6 block">
            Clients are responsible for communicating any medical conditions, allergies, or prior adverse reactions to beauty treatments before their appointment begins. We are not liable for any issues arising from undisclosed medical information. You must safely and properly follow any aftercare instructions provided by our artists.
          </p>

          <h2 className="font-playfair text-2xl text-charcoal mt-10 mb-4">5. Revisions and Errata</h2>
          <p className="font-sans text-charcoal/70 leading-relaxed mb-6 block">
            The materials appearing on Mike Beauty Studio&apos;s website could include technical, typographical, or photographic errors. We do not warrant that any of the materials on its website are accurate, complete, or current. We may make changes to the materials contained on its website at any time without notice.
          </p>
          
          <p className="font-sans text-charcoal/40 text-sm mt-16 italic tracking-wide">
            Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>
    </main>
  );
}
