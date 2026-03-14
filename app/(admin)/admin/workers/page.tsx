import { prisma } from '@/lib/prisma';
import WorkersClient from './WorkersClient';
import { PageHeader } from '@/components/ui';

export const metadata = { title: 'Workers | Mike Beauty Studio Admin' };
export const dynamic = 'force-dynamic';

export default async function WorkersPage() {
  const workers = await prisma.worker.findMany({
    include: {
      user: { select: { name: true, email: true } },
      advances: { where: { status: 'PENDING' } },
      payments: { orderBy: { date: 'desc' }, take: 1 },
    },
    orderBy: { createdAt: 'desc' },
  });

  const users = await prisma.user.findMany({
    where: { workerProfile: null, role: 'WORKER' },
    select: { id: true, name: true, email: true },
  });

  return (
    <div className="animate-fade-in-up space-y-6">
      <PageHeader
        title="Workers"
        subtitle="Manage staff profiles, commission models, and payouts."
        right={
          <span className="admin-card px-4 py-2 font-semibold font-sans text-sm" style={{ color: 'var(--admin-text-primary)' }}>
            {workers.length} Staff
          </span>
        }
      />
      <WorkersClient workers={workers} users={users} />
    </div>
  );
}
