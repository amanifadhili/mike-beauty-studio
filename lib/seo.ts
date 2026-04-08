import { prisma } from '@/lib/prisma';

export async function getBusinessSchema() {
  // In a real production scenario, these would frequently hit cache, not the DB directly every request
  const fallbackPhone = '+250780000000';
  const fallbackAddress = 'KG 11 Ave';
  
  let phone = fallbackPhone;
  let address = fallbackAddress;
  let reviews: any[] = [];
  let avgRating = 5.0;
  let totalReviews = 0;

  try {
    const phoneSetting = await prisma.appSetting.findUnique({ where: { key: 'PHONE' } });
    const addressSetting = await prisma.appSetting.findUnique({ where: { key: 'ADDRESS' } });
    if (phoneSetting?.value) phone = phoneSetting.value;
    if (addressSetting?.value) address = addressSetting.value;

    reviews = await prisma.review.findMany({
      where: { approved: true },
      take: 10,
      orderBy: { createdAt: 'desc' }
    });
    
    totalReviews = await prisma.review.count({ where: { approved: true } });
    
    if (reviews.length > 0) {
      avgRating = reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length;
      // Round to 1 decimal place
      avgRating = Math.round(avgRating * 10) / 10;
    }
  } catch (e) {
    // Fail silently to fallbacks if DB connection is absent during static generation
  }

  const baseSchema: any = {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    "name": "Mike Beauty Studio",
    "image": "https://mikebeautystudio.com/og-image.jpg",
    "@id": "https://mikebeautystudio.com",
    "url": "https://mikebeautystudio.com",
    "telephone": phone,
    "priceRange": "RWF 15,000–80,000",
    "currenciesAccepted": "RWF",
    "paymentAccepted": "Cash, Mobile Money",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": address,
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
      "https://www.instagram.com/mikebeautystudio",
      "https://g.page/placeholder-gbp-id"
    ]
  };

  // Only include aggregateRating if we have sufficient reviews
  if (totalReviews >= 3) {
    baseSchema.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": avgRating,
      "reviewCount": totalReviews,
      "bestRating": "5",
      "worstRating": "1"
    };

    baseSchema.review = reviews.map(rev => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": rev.name
      },
      "datePublished": rev.createdAt.toISOString().split('T')[0],
      "reviewBody": rev.comment,
      "reviewRating": {
        "@type": "Rating",
        "bestRating": "5",
        "ratingValue": rev.rating,
        "worstRating": "1"
      }
    }));
  }

  return baseSchema;
}

export function getServiceSchema(service: any) {
  const imageUrl = service.medias && service.medias[0] ? service.medias[0].url : "https://mikebeautystudio.com/og-image.jpg";
  
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.name,
    "description": service.description,
    "provider": {
      "@type": "BeautySalon",
      "name": "Mike Beauty Studio"
    },
    "areaServed": {
      "@type": "City",
      "name": "Kigali"
    },
    "offers": {
      "@type": "Offer",
      "price": service.price,
      "priceCurrency": "RWF",
      "availability": "https://schema.org/InStock"
    },
    "image": imageUrl,
    "url": `https://mikebeautystudio.com/services/${service.slug}`
  };
}

export function getFAQSchema(faqs: {question: string, answer: string}[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}

export function getBreadcrumbSchema(items: {name: string, url: string}[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
}
