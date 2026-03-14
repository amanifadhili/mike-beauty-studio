import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  // Create Initial Services
  const services = [
    {
      name: 'Classic Full Set',
      description: 'A 1:1 application for a natural, elegant mascara look.',
      price: 35000, 
      duration: '2 hours',
      active: true,
    },
    {
      name: 'Hybrid Full Set',
      description: 'A mix of classic and volume lashes for a textured, fluffy look.',
      price: 45000,
      duration: '2.5 hours',
      active: true,
    },
    {
      name: 'Light Volume Set',
      description: 'Multiple fine lashes applied to a single natural lash for a soft, full appearance.',
      price: 50000,
      duration: '2.5 hours',
      active: true,
    },
    {
      name: 'Mega Volume Set',
      description: 'Maximum fullness and drama. The darkest, thickest lash line possible.',
      price: 65000,
      duration: '3 hours',
      active: true,
    },
    {
      name: 'Lash Removal',
      description: 'Safe and gentle professional removal of existing extensions.',
      price: 10000,
      duration: '30 mins',
      active: true,
    }
  ];

  for (const s of services) {
    const service = await prisma.service.create({
      data: s,
    });
    console.log(`Created service with id: ${service.id}`);
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
