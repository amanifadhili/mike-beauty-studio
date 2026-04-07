import { Hero } from '@/components/home/Hero';
import { ServicesPreview } from '@/components/home/ServicesPreview';
import { BeforeAfterSlider } from '@/components/home/BeforeAfterSlider';
import { ReviewsCarousel } from '@/components/home/ReviewsCarousel';
import { CertificateShowcase } from '@/components/about/CertificateShowcase';
import Script from 'next/script';

import { getBusinessSchema } from '@/lib/seo';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const localBusinessSchema = await getBusinessSchema();
  const rawReviews = await prisma.review.findMany({
    where: { approved: true },
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true, role: true, rating: true, comment: true }
  });
  
  // Normalize the DB review list into the format the Carousel expects
  const dbReviews = rawReviews.map(r => ({
    id: r.id, name: r.name, role: r.role || 'Client', rating: r.rating, text: r.comment
  }));

  return (
    <>
      <Script
        id="schema-local-business"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <Hero />
      <BeforeAfterSlider />
      <ServicesPreview />
      <ReviewsCarousel reviews={dbReviews} />
      <CertificateShowcase />
    </>
  );
}
