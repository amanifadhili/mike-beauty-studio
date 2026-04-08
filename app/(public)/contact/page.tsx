import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { getSettings } from '@/lib/settings';
import { MapWrapper } from '@/components/contact/MapWrapper';
import { MapReveal } from '@/components/contact/MapReveal';

export const metadata = {
  title: 'Contact Us | Mike Beauty Studio Kigali',
  description: 'Get in touch with Mike Beauty Studio for lash extension inquiries, group bookings, or to locate our premium studio in Kigali.',
  alternates: { canonical: 'https://mikebeautystudio.com/contact' },
};

// Next.js Server-Side parser that traces map shortlink redirects to bypass Iframe origin block
async function resolveGoogleMapsShortlink(shortlink: string): Promise<string | null> {
  try {
    const res = await fetch(shortlink, { redirect: 'manual' });
    // Intercept the 301/302 Redirect before the browser gets to it
    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get('location');
      if (location) {
        // Attempt to extract the exact Place name/business name from the verbose URL
        const placeMatch = location.match(/\/place\/([^\/]+)\//);
        if (placeMatch) {
           const placeName = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
           return `https://maps.google.com/maps?q=${encodeURIComponent(placeName)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
        }
        // Fallback: Attempt to extract exact lat/lng GPS coordinates
        const coordMatch = location.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
        if (coordMatch) {
          return `https://maps.google.com/maps?q=${coordMatch[1]},${coordMatch[2]}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
        }
      }
    }
  } catch (e) {
    console.error("Shortlink resolution failed:", e);
  }
  return null;
}

export default async function ContactPage() {
  const settings = await getSettings();

  let rawMapUrl = settings['MAP_EMBED_URL'] || '';
  let mapSrc = '';

  if (rawMapUrl) {
    if (rawMapUrl.includes('<iframe')) {
      const match = rawMapUrl.match(/src="([^"]+)"/);
      if (match) mapSrc = match[1];
    } else if (rawMapUrl.includes('goo.gl')) {
      // Magically unpack shortlinks exactly as the user requested
      const resolvedSrc = await resolveGoogleMapsShortlink(rawMapUrl);
      if (resolvedSrc) {
        mapSrc = resolvedSrc;
      } else {
        // Ultimate fallback
        const addressQuery = encodeURIComponent(settings['STUDIO_ADDRESS'] || 'Kigali, Rwanda');
        mapSrc = `https://maps.google.com/maps?q=${addressQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
      }
    } else {
      mapSrc = rawMapUrl;
    }
  } else {
    const addressQuery = encodeURIComponent(settings['STUDIO_ADDRESS'] || 'Kigali, Rwanda');
    mapSrc = `https://maps.google.com/maps?q=${addressQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  }

  return (
    <div className="bg-cream-white min-h-[calc(100vh-80px)] pt-20 pb-12 text-charcoal relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-8">
          <SectionHeading 
            title="Get In Touch"
            subtitle="Whether you have questions about our treatments or need assistance finding the studio, our concierge team is ready to assist you."
            alignment="center"
            className="[&>span]:text-gold [&>h2]:text-3xl md:[&>h2]:text-4xl [&>h1]:text-3xl md:[&>h1]:text-4xl [&>p]:text-sm md:[&>p]:text-base mb-0"
            isH1={true}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto">
          
          {/* Contact Details Column */}
          <div className="flex flex-col justify-between space-y-6 md:space-y-8 bg-cream p-6 md:p-8 border border-[#eaeaea]">
            
            <div>
              <h3 className="font-playfair text-xl text-gold mb-3">Studio Location</h3>
              <div className="font-sans text-gray-600 space-y-4 text-sm leading-relaxed whitespace-pre-line">
                <p>{settings['STUDIO_ADDRESS'] || 'Kigali Heights, 4th Floor\nKG 7 Ave, Kigali\nRwanda'}</p>
                
                {/* Get Directions Button */}
                <a 
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(settings['STUDIO_ADDRESS'] || '-1.9547517,30.0881958')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-charcoal font-medium hover:text-red-600 transition-colors mt-2"
                >
                  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/>
                  </svg>
                  Get Directions
                </a>
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

                {settings['WHATSAPP_NUMBER'] && (
                <a 
                  href={`https://wa.me/${(settings['WHATSAPP_NUMBER'] || '').replace(/[^0-9]/g, '')}`}
                  target="_blank" rel="noreferrer"
                  className="flex items-center gap-3 text-gray-600 hover:text-charcoal transition-colors group text-sm"
                >
                  <div className="w-8 h-8 border border-gray-300 group-hover:border-gold flex items-center justify-center rounded-full transition-colors">
                    {/* WhatsApp Icon */}
                    <svg className="w-3 h-3 text-gold" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.488-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  </div>
                  <span>WhatsApp Chat</span>
                </a>
                )}

                {settings['CONTACT_EMAIL'] && (
                <a 
                  href={`mailto:${settings['CONTACT_EMAIL']}`}
                  className="flex items-center gap-3 text-gray-600 hover:text-charcoal transition-colors group text-sm"
                >
                  <div className="w-8 h-8 border border-gray-300 group-hover:border-gold flex items-center justify-center rounded-full transition-colors">
                    <svg className="w-3 h-3 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span>{settings['CONTACT_EMAIL']}</span>
                </a>
                )}
              </div>
            </div>

            {/* Social Connect Options */}
            {(settings['INSTAGRAM_URL'] || settings['FACEBOOK_URL'] || settings['TIKTOK_URL'] || settings['TWITTER_URL'] || settings['YOUTUBE_URL']) && (
              <div>
                <h3 className="font-playfair text-xl text-gold mb-3">Follow Us</h3>
                <div className="flex gap-4">
                  {settings['INSTAGRAM_URL'] && (
                    <a href={settings['INSTAGRAM_URL']} target="_blank" rel="noreferrer" className="w-10 h-10 border border-[#eaeaea] hover:border-gold flex items-center justify-center rounded-full text-gray-500 hover:text-gold transition-colors" aria-label="Instagram">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 10-2.881.001 1.44 1.44 0 002.881-.001z"/></svg>
                    </a>
                  )}
                  {settings['TIKTOK_URL'] && (
                    <a href={settings['TIKTOK_URL']} target="_blank" rel="noreferrer" className="w-10 h-10 border border-[#eaeaea] hover:border-gold flex items-center justify-center rounded-full text-gray-500 hover:text-gold transition-colors" aria-label="TikTok">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 3.06-1.35 6.19-3.9 8.01-2.5 1.78-5.74 2.15-8.61 1.05-2.82-1.07-4.93-3.61-5.32-6.62-.4-3.08.77-6.26 3.14-8.23 2.13-1.78 5.09-2.3 7.72-1.44v4.25c-1.11-.64-2.58-.69-3.77-.04-1.39.73-2.2 2.37-1.85 3.92.36 1.67 1.83 3.01 3.51 3.25 1.79.25 3.73-.55 4.67-2.11.86-1.43.86-3.12.86-4.75V.02z"/></svg>
                    </a>
                  )}
                  {settings['FACEBOOK_URL'] && (
                    <a href={settings['FACEBOOK_URL']} target="_blank" rel="noreferrer" className="w-10 h-10 border border-[#eaeaea] hover:border-gold flex items-center justify-center rounded-full text-gray-500 hover:text-gold transition-colors" aria-label="Facebook">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
                    </a>
                  )}
                  {settings['TWITTER_URL'] && (
                    <a href={settings['TWITTER_URL']} target="_blank" rel="noreferrer" className="w-10 h-10 border border-[#eaeaea] hover:border-gold flex items-center justify-center rounded-full text-gray-500 hover:text-gold transition-colors" aria-label="Twitter">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    </a>
                  )}
                  {settings['YOUTUBE_URL'] && (
                    <a href={settings['YOUTUBE_URL']} target="_blank" rel="noreferrer" className="w-10 h-10 border border-[#eaeaea] hover:border-gold flex items-center justify-center rounded-full text-gray-500 hover:text-gold transition-colors" aria-label="YouTube">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.054 0 12 0 12s0 3.946.501 5.814a3.016 3.016 0 0 0 2.122 2.136c1.872.55 9.377.55 9.377.55s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.946 24 12 24 12s0-3.946-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                    </a>
                  )}
                </div>
              </div>
            )}

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

          {/* Map Column — Dynamic Iframe */}
          <div className="h-[300px] lg:h-auto min-h-[400px] border border-[#eaeaea] relative overflow-hidden flex-1">
            <iframe 
              src={mapSrc} 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={false}
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade" 
              className="absolute inset-0 w-full h-full"
            />
          </div>

        </div>

      </div>
    </div>
  );
}
