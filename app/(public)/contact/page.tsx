import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { getSettings } from '@/lib/settings';

export const metadata = {
  title: 'Contact Us | Mike Beauty Studio Kigali',
  description: 'Get in touch with Mike Beauty Studio for lash extension inquiries, group bookings, or to locate our premium studio in Kigali.',
};

export default async function ContactPage() {
  const settings = await getSettings();
  return (
    <div className="bg-charcoal min-h-screen pt-32 pb-24 text-cream-white relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <SectionHeading 
            title="Get In Touch"
            subtitle="Whether you have questions about our treatments or need assistance finding the studio, our concierge team is ready to assist you."
            alignment="center"
            className="text-white [&>h2]:text-white [&>span]:text-gold"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          
          {/* Contact Details Column */}
          <div className="space-y-12 bg-[#1a1a1a] p-10 md:p-16 border border-white/5">
            
            <div>
              <h3 className="font-playfair text-2xl text-gold mb-6">Studio Location</h3>
              <div className="font-sans text-gray-300 space-y-2 leading-relaxed whitespace-pre-line">
                <p>{settings['STUDIO_ADDRESS'] || 'Kigali Heights, 4th Floor\nKG 7 Ave, Kigali\nRwanda'}</p>
              </div>
            </div>

            <div>
              <h3 className="font-playfair text-2xl text-gold mb-6">Contact Methods</h3>
              <div className="font-sans space-y-4">
                <a 
                  href={`tel:${settings['PHONE_NUMBER'] || '+250788000000'}`}
                  className="flex items-center gap-4 text-gray-300 hover:text-white transition-colors group"
                >
                  <div className="w-10 h-10 border border-white/20 group-hover:border-gold flex items-center justify-center rounded-full transition-colors">
                    <svg className="w-4 h-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <span>{settings['PHONE_NUMBER'] || '+250 788 000 000'}</span>
                </a>

                <a 
                  href={`mailto:${settings['CONTACT_EMAIL'] || 'hello@mikebeautystudio.rw'}`}
                  className="flex items-center gap-4 text-gray-300 hover:text-white transition-colors group"
                >
                  <div className="w-10 h-10 border border-white/20 group-hover:border-gold flex items-center justify-center rounded-full transition-colors">
                    <svg className="w-4 h-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span>{settings['CONTACT_EMAIL'] || 'hello@mikebeautystudio.rw'}</span>
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-playfair text-2xl text-gold mb-6">Operating Hours</h3>
              <ul className="font-sans text-gray-300 space-y-3">
                <li className="flex justify-between border-b border-white/10 pb-2">
                  <span>Monday - Friday</span>
                  <span className="text-white">{settings['HOURS_WEEKDAY'] || '09:00 AM - 07:00 PM'}</span>
                </li>
                <li className="flex justify-between border-b border-white/10 pb-2">
                  <span>Saturday</span>
                  <span className="text-white">{settings['HOURS_WEEKEND'] || '10:00 AM - 05:00 PM'}</span>
                </li>
                <li className="flex justify-between pb-2 text-gray-500">
                  <span>Sunday</span>
                  <span>Closed</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Map Column */}
          <div className="h-full min-h-[400px] lg:min-h-full bg-[#222] border border-white/5 relative grayscale hover:grayscale-0 transition-all duration-700">
            {/* Using a standard generic Google Maps embed for Kigali Heights as placeholder */}
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1m3!1d15950.046342893976!2d30.088195849999997!3d-1.9547517!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dca6823c1fdcd5%3A0x6a1a4c9c10712fd1!2sKigali%20Heights!5e0!3m2!1sen!2srw!4v1700000000000!5m2!1sen!2srw" 
              width="100%" 
              height="100%" 
              style={{ border: 0, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

        </div>

      </div>
    </div>
  );
}
