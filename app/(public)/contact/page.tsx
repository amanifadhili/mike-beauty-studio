import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { getSettings } from '@/lib/settings';
import { MapWrapper } from '@/components/contact/MapWrapper';

export const metadata = {
  title: 'Contact Us | Mike Beauty Studio Kigali',
  description: 'Get in touch with Mike Beauty Studio for lash extension inquiries, group bookings, or to locate our premium studio in Kigali.',
};

export default async function ContactPage() {
  const settings = await getSettings();
  return (
    <div className="bg-cream-white min-h-[calc(100vh-80px)] pt-20 pb-12 text-charcoal relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-8">
          <SectionHeading 
            title="Get In Touch"
            subtitle="Whether you have questions about our treatments or need assistance finding the studio, our concierge team is ready to assist you."
            alignment="center"
            className="[&>span]:text-gold [&>h2]:text-3xl md:[&>h2]:text-4xl [&>p]:text-sm md:[&>p]:text-base mb-0"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto">
          
          {/* Contact Details Column */}
          <div className="flex flex-col justify-between space-y-6 md:space-y-8 bg-cream p-6 md:p-8 border border-[#eaeaea]">
            
            <div>
              <h3 className="font-playfair text-xl text-gold mb-3">Studio Location</h3>
              <div className="font-sans text-gray-600 space-y-1 text-sm leading-relaxed whitespace-pre-line">
                <p>{settings['STUDIO_ADDRESS'] || 'Kigali Heights, 4th Floor\nKG 7 Ave, Kigali\nRwanda'}</p>
              </div>
            </div>

            <div>
              <h3 className="font-playfair text-xl text-gold mb-3">Contact Methods</h3>
              <div className="font-sans space-y-3">
                <a 
                  href={`tel:${settings['PHONE_NUMBER'] || '+250788000000'}`}
                  className="flex items-center gap-3 text-gray-600 hover:text-charcoal transition-colors group text-sm"
                >
                  <div className="w-8 h-8 border border-gray-300 group-hover:border-gold flex items-center justify-center rounded-full transition-colors">
                    <svg className="w-3 h-3 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <span>{settings['PHONE_NUMBER'] || '+250 788 000 000'}</span>
                </a>

                <a 
                  href={`mailto:${settings['CONTACT_EMAIL'] || 'hello@mikebeautystudio.rw'}`}
                  className="flex items-center gap-3 text-gray-600 hover:text-charcoal transition-colors group text-sm"
                >
                  <div className="w-8 h-8 border border-gray-300 group-hover:border-gold flex items-center justify-center rounded-full transition-colors">
                    <svg className="w-3 h-3 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span>{settings['CONTACT_EMAIL'] || 'hello@mikebeautystudio.rw'}</span>
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-playfair text-xl text-gold mb-3">Operating Hours</h3>
              <ul className="font-sans text-gray-600 text-sm space-y-2">
                <li className="flex justify-between border-b border-[#eaeaea] pb-1">
                  <span>Monday - Friday</span>
                  <span className="text-charcoal">{settings['HOURS_WEEKDAY'] || '09:00 AM - 07:00 PM'}</span>
                </li>
                <li className="flex justify-between border-b border-[#eaeaea] pb-1">
                  <span>Saturday</span>
                  <span className="text-charcoal">{settings['HOURS_WEEKEND'] || '10:00 AM - 05:00 PM'}</span>
                </li>
                <li className="flex justify-between pb-1 text-gray-500">
                  <span>Sunday</span>
                  <span>Closed</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Map Column — Dynamic Iframe or Fallback Leaflet */}
          <div className="h-[300px] lg:h-auto min-h-[300px] border border-[#eaeaea] relative overflow-hidden flex-1">
            {settings['MAP_EMBED_URL'] ? (
              <iframe 
                src={settings['MAP_EMBED_URL']} 
                width="100%" 
                height="100%" 
                style={{ border: 0, minHeight: '400px' }} 
                allowFullScreen={false}
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade" 
                className="absolute inset-0 w-full h-full"
              />
            ) : (
              <MapWrapper />
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
