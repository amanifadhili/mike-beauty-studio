import { prisma } from '@/lib/prisma';
import { PageHeader, StatCard } from '@/components/ui';
import TransactionsClient from './TransactionsClient';

export const metadata = { title: 'Transactions | Mike Beauty Studio Admin' };
export const dynamic = 'force-dynamic';

const PAYMENT_LABELS: Record<string, string> = {
  CASH: 'Cash',
  MOBILE_MONEY: 'Mobile Money',
  BANK_TRANSFER: 'Bank Transfer',
  CREDIT: 'Credit',
};

export default async function TransactionsPage() {
  const transactions = await prisma.transaction.findMany({
    include: {
      service: { select: { name: true } },
      client: { select: { name: true } },
      worker: { select: { name: true, roleTitle: true } },
    },
    orderBy: { date: 'desc' },
  });

  const totals = transactions.reduce(
    (acc, t) => ({ revenue: acc.revenue + t.price, salon: acc.salon + t.salonShare, worker: acc.worker + t.workerCommission }),
    { revenue: 0, salon: 0, worker: 0 }
  );

  return (
    <div className="animate-fade-in-up space-y-6">
      <PageHeader title="Transactions" subtitle="Master ledger of all revenue-generating events." />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Revenue"       value={totals.revenue} variant="gold"  unit="RWF" />
        <StatCard label="Salon Share"         value={totals.salon}   variant="green" unit="RWF" />
        <StatCard label="Worker Commissions"  value={totals.worker}  variant="blue"  unit="RWF" />
      </div>

      {/* Interactive Logs Grid */}
      <TransactionsClient initialData={transactions} />
    </div>
  );
}
