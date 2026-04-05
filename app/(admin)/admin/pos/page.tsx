import { prisma } from '@/lib/prisma';
import POSClient from './POSTerminal';
import { TransactionSource, Role } from '@prisma/client';

export const dynamic = 'force-dynamic';

export default async function POSPage() {
  const services = await prisma.service.findMany({
    where: { active: true },
    select: { id: true, name: true, price: true, duration: true },
  });

  const staff = await prisma.user.findMany({
    where: { role: { in: [Role.WORKER, Role.ADMIN] }, status: 'ACTIVE' },
    select: { id: true, name: true, roleTitle: true },
  });

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const recentTransactions = await prisma.transaction.findMany({
    where: {
      source: TransactionSource.WALK_IN,
      createdAt: { gte: startOfDay }
    },
    include: {
      service: { select: { name: true } },
      worker: { select: { name: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <POSClient services={services} staff={staff} recentTransactions={recentTransactions} />
  );
}
