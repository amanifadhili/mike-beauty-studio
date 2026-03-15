import { prisma } from '@/lib/prisma';
import WorkersClient from './WorkersClient';
import { PageHeader } from '@/components/ui';
import { Role } from '@prisma/client';

export const metadata = { title: 'Staff | Mike Beauty Studio Admin' };
export const dynamic = 'force-dynamic';

export default async function WorkersPage() {
  // Fetch ALL staff users — both WORKER and ADMIN roles
  // Admin is also technically a worker (owner of the business)
  const staff = await prisma.user.findMany({
    where: {
      role: { in: [Role.WORKER, Role.ADMIN] }
    },
    include: {
      advances: { where: { status: 'PENDING' } },
      payments: { orderBy: { date: 'desc' }, take: 1 },
    },
    orderBy: [
      { role: 'asc' },     // ADMIN first
      { createdAt: 'desc' }
    ],
  });

  return (
    <div className="animate-fade-in-up space-y-6">
      <PageHeader
        title="Staff Management"
        subtitle="Manage staff profiles, commission models, and payouts. Click '+ Add New Staff' to create a brand-new staff account."
        right={
          <span className="admin-card px-4 py-2 font-semibold font-sans text-sm" style={{ color: 'var(--admin-text-primary)' }}>
            {staff.length} Staff Member{staff.length !== 1 ? 's' : ''}
          </span>
        }
      />
      <WorkersClient workers={staff} />
    </div>
  );
}
