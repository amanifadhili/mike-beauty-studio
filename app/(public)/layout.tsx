import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppButton } from '@/components/layout/WhatsAppButton';

/**
 * (public) Route Group Layout
 * ============================
 * This layout applies to ALL public-facing pages:
 *   /          → page.tsx  (Homepage)
 *   /about     → about/page.tsx
 *   /contact   → contact/page.tsx
 *   /gallery   → gallery/page.tsx
 *   /services  → services/page.tsx
 *   /booking   → booking/page.tsx
 *
 * Admin and Auth routes have their own completely separate layout files
 * and will NEVER inherit this layout — that is the purpose of route groups.
 */
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
