import { prisma } from '@/lib/prisma';
import POSTerminal from './POSTerminal';
import { PageHeader } from '@/components/ui';
import { Role } from '@prisma/client';

export const dynamic = 'force-dynamic';

export default async function POSPage() {
  const services = await prisma.service.findMany({
    where: { active: true },
    select: { id: true, name: true, price: true, duration: true },
  });

  const staff = await prisma.user.findMany({
    where: { role: Role.WORKER, status: 'ACTIVE' },
    select: { id: true, name: true, roleTitle: true },
  });

  return (
    <div className="space-y-6 animate-fade-in-up">
      <PageHeader
        title="Point of Sale (POS)"
        subtitle="Record walk-in clients instantly and calculate staff commissions in real time."
      />
      <POSTerminal services={services} staff={staff} />
    </div>
  );
}
