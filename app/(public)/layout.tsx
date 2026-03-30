import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppButton } from '@/components/layout/WhatsAppButton';
import { BookingProvider } from '@/components/booking/BookingContext';
import { BookingModal } from '@/components/booking/BookingModal';
import { getServices } from '@/app/actions';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const services = await getServices();
  
  return (
    <BookingProvider services={services.map(s => ({ id: s.id, name: s.name, price: s.price }))}>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
        <WhatsAppButton />
        
        {/* Render Global Booking Modal Overlay */}
        <BookingModal />
      </div>
    </BookingProvider>
  );
}
