import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  // Clear existing services to avoid duplicates during seeding re-runs
  await prisma.media.deleteMany();
  await prisma.service.deleteMany();

  // Create Services with nested Media (High quality lash placeholder images from Unsplash)
  const servicesData = [
    {
      name: 'Classic Full Set',
      description: 'A 1:1 application for a natural, elegant mascara look.',
      price: 35000, 
      duration: '2 hours',
      active: true,
      medias: {
        create: [
          { url: 'https://images.unsplash.com/photo-1599732899479-7a38b5f36e84?q=80&w=600&auto=format&fit=crop', type: 'image' },
          { url: 'https://images.unsplash.com/photo-1512496015851-a1c84277b102?q=80&w=600&auto=format&fit=crop', type: 'image' }
        ]
      }
    },
    {
      name: 'Hybrid Full Set',
      description: 'A mix of classic and volume lashes for a textured, fluffy look.',
      price: 45000,
      duration: '2.5 hours',
      active: true,
      medias: {
        create: [
          { url: 'https://images.unsplash.com/photo-1620005574526-77884102d5d8?q=80&w=600&auto=format&fit=crop', type: 'image' },
          { url: 'https://images.unsplash.com/photo-1587784013098-9cd350b923f1?q=80&w=600&auto=format&fit=crop', type: 'image' },
          { url: 'https://images.unsplash.com/photo-1606015507963-79d9ab40c5f7?q=80&w=800&auto=format&fit=crop', type: 'image' } // Vertical portrait style
        ]
      }
    },
    {
      name: 'Light Volume Set',
      description: 'Multiple fine lashes applied to a single natural lash for a soft, full appearance.',
      price: 50000,
      duration: '2.5 hours',
      active: true,
      medias: {
        create: [
          { url: 'https://images.unsplash.com/photo-1595166708781-dbfb8c5123fc?q=80&w=700&auto=format&fit=crop', type: 'image' }
        ]
      }
    },
    {
      name: 'Mega Volume Set',
      description: 'Maximum fullness and drama. The darkest, thickest lash line possible.',
      price: 65000,
      duration: '3 hours',
      active: true,
      medias: {
        create: [
          { url: 'https://images.unsplash.com/photo-1588663806653-e5d4ce64dc64?q=80&w=600&auto=format&fit=crop', type: 'image' },
          { url: 'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?q=80&w=900&auto=format&fit=crop', type: 'image' },
          { url: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=1200&auto=format&fit=crop', type: 'image' } // Wide landscape
        ]
      }
    },
    {
      name: 'Lash Removal',
      description: 'Safe and gentle professional removal of existing extensions.',
      price: 10000,
      duration: '30 mins',
      active: true,
    }
  ];

  for (const s of servicesData) {
    const service = await prisma.service.create({
      data: s,
    });
    console.log(`Created service with id: ${service.id} and its media relations.`);
  }

  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
