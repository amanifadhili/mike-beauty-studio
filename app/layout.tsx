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

export const metadata: Metadata = {
  metadataBase: new URL('https://mikebeautystudio.com'),
  title: {
    default: 'Mike Beauty Studio | Premium Lash Extensions in Kigali',
    template: '%s | Mike Beauty Studio',
  },
  description: 'Award-winning luxury beauty studio offering classic, hybrid, volume, and mega volume eyelash extensions in Kigali, Rwanda.',
  keywords: ['Lash Extensions Kigali', 'Beauty Studio Rwanda', 'Volume Lashes', 'Classic Lashes', 'Mike Beauty Studio', 'Eyelash Extensions'],
  openGraph: {
    title: 'Mike Beauty Studio | Premium Lash Extensions',
    description: 'Award-winning luxury lash extensions in Kigali, Rwanda.',
    url: 'https://mikebeautystudio.com',
    siteName: 'Mike Beauty Studio',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mike Beauty Studio | Premium Lash Extensions',
    description: 'Award-winning luxury lash extensions in Kigali, Rwanda.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
