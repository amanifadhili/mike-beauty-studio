import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppButton } from '@/components/layout/WhatsAppButton';
import { BookingProvider } from '@/components/booking/BookingContext';
import { BookingModal } from '@/components/booking/BookingModal';
import { MobileStickyCTA } from '@/components/booking/MobileStickyCTA';
import { getServices } from '@/app/actions';

import { getSettings } from '@/lib/settings';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [services, settings] = await Promise.all([
    getServices(),
    getSettings()
  ]);
  
  const cancellationPolicy = settings['CANCELLATION_POLICY'] || 'Please provide at least 24 hours notice for any cancellations.';
  const depositAmount = parseInt(settings['DEPOSIT_AMOUNT'] || '0', 10);
  const bookingSettings = { cancellationPolicy, depositAmount };

  return (
    <BookingProvider
      services={services.map(s => ({ id: s.id, name: s.name, price: s.price }))}
      bookingSettings={bookingSettings}
    >
      <div className="flex flex-col min-h-screen">
        <Navbar settings={settings} />
        <main className="flex-grow">{children}</main>
        <Footer />
        <WhatsAppButton />
        <MobileStickyCTA />
        
        {/* Render Global Booking Modal Overlay */}
        <BookingModal />
      </div>
    </BookingProvider>
  );
}
