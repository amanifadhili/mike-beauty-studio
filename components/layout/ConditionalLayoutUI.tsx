'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppButton } from '@/components/layout/WhatsAppButton';

/**
 * PublicLayoutShell
 * =================
 * Wraps all routes that are NOT /admin/* and NOT /login (auth routes).
 * Admin and auth routes have their own completely separate layouts via
 * their route group layout.tsx files and never reach this component.
 *
 * This component exists only to provide Navbar/Footer/WhatsApp to the
 * public-facing routes that live directly under app/ (homepage, about, etc.)
 *
 * NOTE: This component only renders in the root layout — it should
 * never be imported anywhere else.
 */
export function PublicLayoutShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
