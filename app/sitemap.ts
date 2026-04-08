import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export const revalidate = 3600; // Regenerate at most once per hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://mikebeautystudio.com';

  // 1. Static Pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/booking`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/review`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // 2. Dynamic Service Pages
  const activeServices = await prisma.service.findMany({
    where: { active: true },
    // @ts-ignore - TS language server is stale and hasn't picked up prisma client generation
    select: { slug: true, updatedAt: true },
  });

  const servicePages: MetadataRoute.Sitemap = activeServices
    // @ts-ignore - TS language server is stale and hasn't picked up prisma client generation
    .filter((service) => service.slug != null)
    .map((service) => ({
      // @ts-ignore
      url: `${baseUrl}/services/${service.slug}`,
      lastModified: service.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.85,
    }));

  return [...staticPages, ...servicePages];
}
