import { Hero } from '@/components/home/Hero';
import { ServicesPreview } from '@/components/home/ServicesPreview';
import { BeforeAfterSlider } from '@/components/home/BeforeAfterSlider';
import { ReviewsCarousel } from '@/components/home/ReviewsCarousel';

export default function Home() {
  return (
    <>
      <Hero />
      <ServicesPreview />
      <BeforeAfterSlider />
      <ReviewsCarousel />
    </>
  );
}
