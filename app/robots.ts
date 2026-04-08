import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/worker/', '/api/', '/login', '/register'],
      },
    ],
    sitemap: 'https://mikebeautystudio.com/sitemap.xml',
    host: 'https://mikebeautystudio.com',
  };
}
