import { prisma } from '@/lib/prisma';

export const metadata = { title: 'Transactions | Mike Beauty Studio Admin' };
export const dynamic = 'force-dynamic';

const PAYMENT_LABELS: Record<string, string> = {
  CASH: 'Cash',
  MOBILE_MONEY: 'Mobile Money',
  BANK_TRANSFER: 'Bank Transfer',
  CREDIT: 'Credit',
};

const SOURCE_STYLES: Record<string, string> = {
  WALK_IN: 'border-sky-500/40 text-sky-400 bg-sky-500/[0.08]',
  BOOKING: 'border-purple-500/40 text-purple-400 bg-purple-500/[0.08]',
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
      <div>
        <p className="text-[11px] font-sans uppercase tracking-[0.2em] text-gold/70 mb-1">Admin Dashboard</p>
        <h1 className="font-playfair text-3xl text-white">Transactions</h1>
        <p className="text-gray-600 text-sm font-sans mt-1">Master ledger of all revenue-generating events.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Revenue', value: totals.revenue, color: 'text-gold' },
          { label: 'Salon Share', value: totals.salon, color: 'text-green-400' },
          { label: 'Worker Commissions', value: totals.worker, color: 'text-blue-400' },
        ].map(card => (
          <div key={card.label} className="bg-[#161616] border border-white/[0.06] p-5 rounded-xl">
            <p className="text-gray-500 text-xs font-sans uppercase tracking-widest mb-2">{card.label}</p>
            <p className={`font-playfair text-2xl ${card.color}`}>RWF {card.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[#161616] border border-white/[0.06] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full font-sans text-sm text-left whitespace-nowrap">
            <thead className="text-[10px] text-gray-600 uppercase tracking-[0.15em] border-b border-white/[0.05]">
              <tr>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Client</th>
                <th className="px-5 py-3">Service</th>
                <th className="px-5 py-3">Worker</th>
                <th className="px-5 py-3">Source</th>
                <th className="px-5 py-3">Payment</th>
                <th className="px-5 py-3 text-right">Price</th>
                <th className="px-5 py-3 text-right">Salon</th>
                <th className="px-5 py-3 text-right">Commission</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {transactions.length === 0 ? (
                <tr><td colSpan={9} className="px-5 py-12 text-center text-gray-600">No transactions yet.</td></tr>
              ) : transactions.map(t => (
                <tr key={t.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-4 text-gray-400">{new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                  <td className="px-5 py-4 text-white font-medium">{t.clientName}</td>
                  <td className="px-5 py-4 text-gray-300">{t.service.name}</td>
                  <td className="px-5 py-4 text-gray-300">{t.worker.user.name}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase border ${SOURCE_STYLES[t.source] || ''}`}>{t.source.replace('_', '-')}</span>
                  </td>
                  <td className="px-5 py-4 text-gray-400">{PAYMENT_LABELS[t.paymentMethod] || t.paymentMethod}</td>
                  <td className="px-5 py-4 text-right text-gold font-medium">{t.price.toLocaleString()}</td>
                  <td className="px-5 py-4 text-right text-green-400">{t.salonShare.toLocaleString()}</td>
                  <td className="px-5 py-4 text-right text-blue-400">{t.workerCommission.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
