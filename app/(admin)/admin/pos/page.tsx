import { PrismaClient } from '@prisma/client';
import POSTerminal from './POSTerminal';

const prisma = new PrismaClient();

export default async function POSPage() {
  const services = await prisma.service.findMany({
    where: { active: true },
    select: { id: true, name: true, price: true, duration: true }
  });

  const workers = await prisma.worker.findMany({
    where: { status: 'ACTIVE' },
    include: { user: { select: { name: true } } }
  });

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Point of Sale (POS)</h1>
      <POSTerminal services={services} workers={workers} />
    </div>
  );
}
