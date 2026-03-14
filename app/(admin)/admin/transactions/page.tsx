import { prisma } from '@/lib/prisma';
import { PageHeader, StatCard, StatusBadge, EmptyState } from '@/components/ui';

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
      worker: { include: { user: { select: { name: true } } } },
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
      {transactions.length === 0 ? (
        <EmptyState message="No transactions yet. Record a walk-in via POS or convert a booking to a sale." />
      ) : (
        <div className="admin-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full font-sans text-sm text-left whitespace-nowrap">
              <thead className="text-[10px] uppercase tracking-[0.15em]" style={{ color: 'var(--admin-text-muted)', borderBottom: '1px solid var(--admin-border-subtle)' }}>
                <tr>
                  {['Date', 'Client', 'Service', 'Worker', 'Source', 'Payment', 'Price', 'Salon', 'Commission'].map((col, i) => (
                    <th key={col} className={`px-5 py-3 ${i >= 6 ? 'text-right' : ''}`}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {transactions.map(t => (
                  <tr
                    key={t.id}
                    className="transition-colors"
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                    onMouseLeave={e => e.currentTarget.style.background = ''}
                    style={{ borderBottom: '1px solid var(--admin-border-subtle)' }}
                  >
                    <td className="px-5 py-4" style={{ color: 'var(--admin-text-secondary)' }}>{new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    <td className="px-5 py-4 font-medium" style={{ color: 'var(--admin-text-primary)' }}>{t.clientName}</td>
                    <td className="px-5 py-4" style={{ color: 'var(--admin-text-secondary)' }}>{t.service.name}</td>
                    <td className="px-5 py-4" style={{ color: 'var(--admin-text-secondary)' }}>{t.worker.user.name}</td>
                    <td className="px-5 py-4"><StatusBadge status={t.source} /></td>
                    <td className="px-5 py-4" style={{ color: 'var(--admin-text-secondary)' }}>{PAYMENT_LABELS[t.paymentMethod] ?? t.paymentMethod}</td>
                    <td className="px-5 py-4 text-right font-medium text-gold">{t.price.toLocaleString()}</td>
                    <td className="px-5 py-4 text-right" style={{ color: 'var(--status-completed-text)' }}>{t.salonShare.toLocaleString()}</td>
                    <td className="px-5 py-4 text-right" style={{ color: 'var(--status-confirmed-text)' }}>{t.workerCommission.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
