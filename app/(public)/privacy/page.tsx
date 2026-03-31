import { SectionHeading } from '@/components/ui/SectionHeading';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | Mike Beauty Studio',
  description: 'How we handle and protect your personal information at Mike Beauty Studio.',
};

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-cream min-h-screen">
      <div className="container mx-auto max-w-3xl px-6 py-32 md:py-40">
        <div className="mb-12">
          <SectionHeading title="Privacy Policy" subtitle="Your Data, Protected" />
        </div>

        <div className="prose prose-lg prose-headings:font-playfair prose-headings:text-charcoal prose-p:font-sans prose-p:text-charcoal/70 prose-p:leading-relaxed prose-li:font-sans prose-li:text-charcoal/70 prose-a:text-gold hover:prose-a:text-charcoal transition-colors max-w-none">
          
          <h2 className="font-playfair text-2xl text-charcoal mt-10 mb-4">1. Information We Collect</h2>
          <p className="font-sans text-charcoal/70 leading-relaxed mb-6 block">
            We collect information you provide directly to us when you book an appointment, create an account, or communicate with us. This may include your name, email address, phone number, and transaction details. We also automatically collect certain information about your device and how you interact with our website.
          </p>

          <h2 className="font-playfair text-2xl text-charcoal mt-10 mb-4">2. How We Use Your Information</h2>
          <p className="font-sans text-charcoal/70 leading-relaxed mb-6 block">
            We use the information we collect to provide, maintain, and improve our services. Specifically, we use your data to:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-charcoal/70 font-sans mb-6">
            <li>Process and manage your booking reservations.</li>
            <li>Send administrative messages, appointment reminders, and technical notices.</li>
            <li>Respond to your comments, questions, and customer service requests.</li>
            <li>Monitor and analyze trends, usage, and activities in connection with our services.</li>
          </ul>

          <h2 className="font-playfair text-2xl text-charcoal mt-10 mb-4">3. Information Sharing</h2>
          <p className="font-sans text-charcoal/70 leading-relaxed mb-6 block">
            We do not share your personal information with third parties except as described in this policy. We may share your information with vendors, consultants, and other service providers who need access to such information to carry out work on our behalf (e.g., payment processors, hosting services). We may also disclose information if we believe disclosure is in accordance with, or required by, any applicable law, regulation, or legal process.
          </p>

          <h2 className="font-playfair text-2xl text-charcoal mt-10 mb-4">4. Security</h2>
          <p className="font-sans text-charcoal/70 leading-relaxed mb-6 block">
            Mike Beauty Studio takes reasonable physical, technical, and administrative measures to help protect your personal information from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction. However, no security system is impenetrable, and we cannot guarantee the security of our systems 100%.
          </p>

          <h2 className="font-playfair text-2xl text-charcoal mt-10 mb-4">5. Contact Us</h2>
          <p className="font-sans text-charcoal/70 leading-relaxed mb-6 block">
            If you have any questions about this Privacy Policy, please <Link href="/contact" className="text-gold hover:text-charcoal transition-colors underline underline-offset-4">contact us</Link>.
          </p>
          
          <p className="font-sans text-charcoal/40 text-sm mt-16 italic tracking-wide">
            Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>
    </main>
  );
}
