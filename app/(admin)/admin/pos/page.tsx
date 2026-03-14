import { prisma } from '@/lib/prisma';
import POSTerminal from './POSTerminal';
import { PageHeader } from '@/components/ui';

export const dynamic = 'force-dynamic';

export default async function POSPage() {
  const services = await prisma.service.findMany({
    where: { active: true },
    select: { id: true, name: true, price: true, duration: true },
  });

  const workers = await prisma.worker.findMany({
    where: { status: 'ACTIVE' },
    include: { user: { select: { name: true } } },
  });

  return (
    <div className="space-y-6 animate-fade-in-up">
      <PageHeader
        title="Point of Sale (POS)"
        subtitle="Record walk-in clients instantly and calculate worker commissions in real time."
      />
      <POSTerminal services={services} workers={workers} />
    </div>
  );
}
