import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

async function main() {
  console.log('Starting slug backfill...');
  const services = await prisma.service.findMany();
  
  let updatedCount = 0;
  for (const service of services) {
    if (!service.slug || service.slug === '') {
      let newSlug = slugify(service.name);
      
      // Handle potential existing empty strings or generate unique if needed
      if (!newSlug) newSlug = `service-${service.id.substring(0, 5)}`;

      // Loop to make it unique if necessary
      let uniqueSlug = newSlug;
      let counter = 1;
      let existing = await prisma.service.findUnique({ where: { slug: uniqueSlug } });
      while (existing && existing.id !== service.id) {
        uniqueSlug = `${newSlug}-${counter}`;
        existing = await prisma.service.findUnique({ where: { slug: uniqueSlug } });
        counter++;
      }

      await prisma.service.update({
        where: { id: service.id },
        data: { slug: uniqueSlug },
      });
      console.log(`Updated service ${service.name} -> slug: ${uniqueSlug}`);
      updatedCount++;
    }
  }
  
  console.log(`Slug backfill complete. Updated ${updatedCount} services.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
