import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { GoogleAnalytics } from '@/components/seo/GoogleAnalytics';

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

export async function generateMetadata(): Promise<Metadata> {
  const defaultTitle = 'Mike Beauty Studio | Premium Lash Extensions in Kigali';
  const defaultDesc = 'Award-winning luxury beauty studio offering classic, hybrid, volume, and mega volume eyelash extensions in Kigali, Rwanda.';
  
  let title = defaultTitle;
  let description = defaultDesc;
  let gscId = '';

  try {
    const { prisma } = await import('@/lib/prisma');
    const titleSetting = await prisma.appSetting.findUnique({ where: { key: 'SEO_TITLE' } });
    const descSetting = await prisma.appSetting.findUnique({ where: { key: 'SEO_DESCRIPTION' } });
    const gscSetting = await prisma.appSetting.findUnique({ where: { key: 'GSC_VERIFICATION_ID' } });
    if (titleSetting?.value) title = titleSetting.value;
    if (descSetting?.value) description = descSetting.value;
    if (gscSetting?.value) gscId = gscSetting.value;
  } catch (e) {}

  return {
    metadataBase: new URL('https://mikebeautystudio.com'),
    title: {
      default: title,
      template: '%s | Mike Beauty Studio',
    },
    description,
    keywords: ['Lash Extensions Kigali', 'Beauty Studio Rwanda', 'Volume Lashes', 'Classic Lashes', 'Mike Beauty Studio', 'Eyelash Extensions'],
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
    alternates: { canonical: 'https://mikebeautystudio.com' },
    verification: { google: gscId || undefined },
    openGraph: {
      title,
      description,
      url: 'https://mikebeautystudio.com',
      siteName: 'Mike Beauty Studio',
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let gaId = '';
  try {
    const { prisma } = await import('@/lib/prisma');
    const gaSetting = await prisma.appSetting.findUnique({ where: { key: 'GA_TRACKING_ID' } });
    if (gaSetting?.value) gaId = gaSetting.value;
  } catch (e) {}

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <GoogleAnalytics gaId={gaId} />
      </head>
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
