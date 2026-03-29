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

export async function generateMetadata(): Promise<Metadata> {
  const defaultTitle = 'Mike Beauty Studio | Premium Lash Extensions in Kigali';
  const defaultDesc = 'Award-winning luxury beauty studio offering classic, hybrid, volume, and mega volume eyelash extensions in Kigali, Rwanda.';
  
  let title = defaultTitle;
  let description = defaultDesc;

  try {
    const { prisma } = await import('@/lib/prisma');
    const titleSetting = await prisma.appSetting.findUnique({ where: { key: 'SEO_TITLE' } });
    const descSetting = await prisma.appSetting.findUnique({ where: { key: 'SEO_DESCRIPTION' } });
    if (titleSetting?.value) title = titleSetting.value;
    if (descSetting?.value) description = descSetting.value;
  } catch (e) {}

  return {
    metadataBase: new URL('https://mikebeautystudio.com'),
    title: {
      default: title,
      template: '%s | Mike Beauty Studio',
    },
    description,
    keywords: ['Lash Extensions Kigali', 'Beauty Studio Rwanda', 'Volume Lashes', 'Classic Lashes', 'Mike Beauty Studio', 'Eyelash Extensions'],
    openGraph: {
      title,
      description,
      url: 'https://mikebeautystudio.com',
      siteName: 'Mike Beauty Studio',
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

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
