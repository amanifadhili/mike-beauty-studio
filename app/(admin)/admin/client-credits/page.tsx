import { prisma } from '@/lib/prisma';
import { ClientCreditsClient } from './ClientCreditsClient';
import { PageHeader } from '@/components/ui';

export const metadata = { title: 'Client Credits & IOUs | Mike Beauty Studio Admin' };
export const dynamic = 'force-dynamic';

export default async function ClientCreditsPage() {
  const credits = await prisma.clientCredit.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      transaction: {
        select: { service: { select: { name: true } } }
      }
    }
  });

  return (
    <div className="animate-fade-in-up space-y-6">
      <PageHeader
        title="Client Tabs & IOUs"
        subtitle="Manage outstanding debts from trusted clients."
      />
      <ClientCreditsClient initialCredits={credits as any} />
    </div>
  );
}
