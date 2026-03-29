import { prisma } from '@/lib/prisma';

export async function getBusinessSchema() {
  // In a real production scenario, these would frequently hit cache, not the DB directly every request
  const fallbackPhone = '+250780000000';
  const fallbackAddress = 'KG 11 Ave';
  
  let phone = fallbackPhone;
  let address = fallbackAddress;

  try {
    const phoneSetting = await prisma.appSetting.findUnique({ where: { key: 'PHONE' } });
    const addressSetting = await prisma.appSetting.findUnique({ where: { key: 'ADDRESS' } });
    if (phoneSetting?.value) phone = phoneSetting.value;
    if (addressSetting?.value) address = addressSetting.value;
  } catch (e) {
    // Fail silently to fallbacks if DB connection is absent during static generation
  }

  return {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    "name": "Mike Beauty Studio",
    "image": "https://mikebeautystudio.com/images/hero.jpg",
    "@id": "https://mikebeautystudio.com",
    "url": "https://mikebeautystudio.com",
    "telephone": phone,
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
      "https://www.instagram.com/mikebeautystudio"
    ]
  };
}
