import { Hero } from '@/components/home/Hero';
import { ServicesPreview } from '@/components/home/ServicesPreview';
import { BeforeAfterSlider } from '@/components/home/BeforeAfterSlider';
import { ReviewsCarousel } from '@/components/home/ReviewsCarousel';

export default function Home() {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    "name": "Mike Beauty Studio",
    "image": "https://mikebeautystudio.com/images/hero.jpg", // Replace with real OG image url
    "@id": "https://mikebeautystudio.com",
    "url": "https://mikebeautystudio.com",
    "telephone": "+250780000000", // Replace with real number
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "KG 11 Ave", // Replace with real address if known
      "addressLocality": "Kigali",
      "addressRegion": "Kigali City",
      "addressCountry": "RW"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -1.9441,
      "longitude": 30.0619
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      "opens": "09:00",
      "closes": "18:00"
    },
    "sameAs": [
      "https://www.instagram.com/mikebeautystudio" // Replace with real IG
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <Hero />
      <ServicesPreview />
      <BeforeAfterSlider />
      <ReviewsCarousel />
    </>
  );
}
