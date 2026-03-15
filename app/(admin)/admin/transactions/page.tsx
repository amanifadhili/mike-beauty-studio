import { prisma } from '@/lib/prisma';
import { PageHeader, StatCard, StatusBadge, EmptyState, DataTable } from '@/components/ui';

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

      {/* Table */}
      <DataTable
        data={transactions}
        columns={['Date', 'Client', 'Service', 'Worker', 'Source', 'Payment', 'Price', 'Salon', 'Commission']}
        emptyStateMessage="No transactions yet. Record a walk-in via POS or convert a booking to a sale."
        renderRow={(t) => (
          <tr
            key={t.id}
            className="transition-colors hover:bg-white/[0.02]"
            style={{ borderBottom: '1px solid var(--admin-border-subtle)' }}
          >
            <td className="px-5 py-4" style={{ color: 'var(--admin-text-secondary)' }}>{new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
            <td className="px-5 py-4 font-medium" style={{ color: 'var(--admin-text-primary)' }}>{t.client.name}</td>
            <td className="px-5 py-4" style={{ color: 'var(--admin-text-secondary)' }}>{t.service.name}</td>
            <td className="px-5 py-4" style={{ color: 'var(--admin-text-secondary)' }}>{t.worker.name} {t.worker.roleTitle ? `(${t.worker.roleTitle})` : ''}</td>
            <td className="px-5 py-4"><StatusBadge status={t.source} /></td>
            <td className="px-5 py-4" style={{ color: 'var(--admin-text-secondary)' }}>{PAYMENT_LABELS[t.paymentMethod] ?? t.paymentMethod}</td>
            <td className="px-5 py-4 text-right font-medium text-gold">{t.price.toLocaleString()}</td>
            <td className="px-5 py-4 text-right" style={{ color: 'var(--status-completed-text)' }}>{t.salonShare.toLocaleString()}</td>
            <td className="px-5 py-4 text-right" style={{ color: 'var(--status-confirmed-text)' }}>{t.workerCommission.toLocaleString()}</td>
          </tr>
        )}
        renderCard={(t) => (
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-sans text-gray-500">
                {new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              <StatusBadge status={t.source} />
            </div>
            <div>
              <p className="font-sans font-medium text-sm text-white">{t.client.name}</p>
            </div>
            <div className="flex items-center justify-between rounded-lg px-3 py-2 bg-white/[0.03]">
              <div>
                <p className="font-sans text-sm text-gray-300">{t.service.name}</p>
                <p className="font-sans text-xs text-gray-500">{t.worker.name}</p>
              </div>
              <div className="text-right">
                <p className="font-sans text-sm font-semibold text-gold">RWF {t.price.toLocaleString()}</p>
                <p className="font-sans text-[10px] text-gray-500 uppercase">{PAYMENT_LABELS[t.paymentMethod] ?? t.paymentMethod}</p>
              </div>
            </div>
            <div className="flex justify-between items-center px-1">
              <span className="text-xs font-sans text-emerald-400">Salon: RWF {(t.salonShare ?? 0).toLocaleString()}</span>
              <span className="text-xs font-sans text-blue-400">Worker: RWF {(t.workerCommission ?? 0).toLocaleString()}</span>
            </div>
          </div>
        )}
      />
    </div>
  );
}
