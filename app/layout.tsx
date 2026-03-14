import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  display: 'swap',
});

import { ConditionalLayoutUI } from '@/components/layout/ConditionalLayoutUI';

export const metadata: Metadata = {
  title: 'Mike Beauty Studio | Premium Lash Extensions in Kigali',
  description: 'Award-winning beauty studio offering classic, hybrid, volume, and mega volume lash extensions in Kigali, Rwanda.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${playfair.variable} antialiased flex flex-col min-h-screen`}>
        <ConditionalLayoutUI>
          {children}
        </ConditionalLayoutUI>
      </body>
    </html>
  );
}
