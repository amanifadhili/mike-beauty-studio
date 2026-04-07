import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🗑️  Initiating booking cleanup...');

  try {
    // Delete all bookings
    const result = await prisma.booking.deleteMany();
    
    console.log(`✅ Successfully deleted ${result.count} bookings.`);
    console.log('✨ System is cleared and ready for production!');
  } catch (error) {
    console.error('❌ Failed to clear bookings:', error);
  } finally {
    // Always disconnect the Prisma client
    await prisma.$disconnect();
  }
}

main();
