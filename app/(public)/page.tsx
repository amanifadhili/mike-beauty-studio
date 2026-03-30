import { Hero } from '@/components/home/Hero';
import { ServicesPreview } from '@/components/home/ServicesPreview';
import { BeforeAfterSlider } from '@/components/home/BeforeAfterSlider';
import { ReviewsCarousel } from '@/components/home/ReviewsCarousel';
import Script from 'next/script';

import { getBusinessSchema } from '@/lib/seo';

export default async function Home() {
  const localBusinessSchema = await getBusinessSchema();

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
      <ReviewsCarousel />
    </>
  );
}
