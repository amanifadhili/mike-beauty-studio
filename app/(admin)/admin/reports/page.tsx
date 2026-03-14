import { prisma } from '@/lib/prisma';

export const metadata = { title: 'Reports | Mike Beauty Studio Admin' };
export const dynamic = 'force-dynamic';

async function getReportData() {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7); weekAgo.setHours(0, 0, 0, 0);
  const monthAgo = new Date(); monthAgo.setDate(monthAgo.getDate() - 30); monthAgo.setHours(0, 0, 0, 0);

  const [todayTx, weekTx, monthTx, todayExp, monthExp, paymentMethods, topWorkers] = await Promise.all([
    prisma.transaction.aggregate({ where: { date: { gte: today } }, _sum: { price: true, salonShare: true } }),
    prisma.transaction.aggregate({ where: { date: { gte: weekAgo } }, _sum: { price: true, salonShare: true } }),
    prisma.transaction.aggregate({ where: { date: { gte: monthAgo } }, _sum: { price: true, salonShare: true } }),
    prisma.expense.aggregate({ where: { date: { gte: today } }, _sum: { amount: true } }),
    prisma.expense.aggregate({ where: { date: { gte: monthAgo } }, _sum: { amount: true } }),
    prisma.transaction.groupBy({ by: ['paymentMethod'], _sum: { price: true }, orderBy: { _sum: { price: 'desc' } } }),
    prisma.transaction.groupBy({
      by: ['workerId'], _sum: { price: true, workerCommission: true },
      orderBy: { _sum: { price: 'desc' } }, take: 5
    }),
  ]);

  const workerIds = topWorkers.map(w => w.workerId);
  const workers = await prisma.worker.findMany({ where: { id: { in: workerIds } }, include: { user: { select: { name: true } } } });

  const enrichedWorkers = topWorkers.map(tw => ({
    ...tw,
    name: workers.find(w => w.id === tw.workerId)?.user.name || 'Unknown'
  }));

  return { todayTx, weekTx, monthTx, todayExp, monthExp, paymentMethods, topWorkers: enrichedWorkers };
}

export default async function ReportsPage() {
  const { todayTx, weekTx, monthTx, todayExp, monthExp, paymentMethods, topWorkers } = await getReportData();

  const todayRevenue = todayTx._sum.price || 0;
  const todayExpenses = todayExp._sum.amount || 0;
  const todayProfit = (todayTx._sum.salonShare || 0) - todayExpenses;

  const monthRevenue = monthTx._sum.price || 0;
  const monthExpenses = monthExp._sum.amount || 0;
  const monthProfit = (monthTx._sum.salonShare || 0) - monthExpenses;

  return (
    <div className="animate-fade-in-up space-y-8">
      <div>
        <p className="text-[11px] font-sans uppercase tracking-[0.2em] text-gold/70 mb-1">Admin Dashboard</p>
        <h1 className="font-playfair text-3xl text-white">Financial Reports</h1>
        <p className="text-gray-600 text-sm font-sans mt-1">Your studio performance at a glance.</p>
      </div>

      {/* Today Cards */}
      <section>
        <h2 className="text-xs uppercase tracking-widest text-gray-500 mb-3">Today</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Revenue", value: todayRevenue, color: "text-gold" },
            { label: "Expenses", value: todayExpenses, color: "text-red-400" },
            { label: "Net Profit", value: todayProfit, color: todayProfit >= 0 ? "text-green-400" : "text-red-400" },
          ].map(c => (
            <div key={c.label} className="bg-[#161616] border border-white/[0.06] p-5 rounded-xl">
              <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">{c.label}</p>
              <p className={`font-playfair text-2xl ${c.color}`}>RWF {c.value.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Monthly Cards */}
      <section>
        <h2 className="text-xs uppercase tracking-widest text-gray-500 mb-3">Last 30 Days</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Revenue", value: monthRevenue, color: "text-gold" },
            { label: "Expenses", value: monthExpenses, color: "text-red-400" },
            { label: "Net Profit", value: monthProfit, color: monthProfit >= 0 ? "text-green-400" : "text-red-400" },
          ].map(c => (
            <div key={c.label} className="bg-[#161616] border border-white/[0.06] p-5 rounded-xl">
              <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">{c.label}</p>
              <p className={`font-playfair text-2xl ${c.color}`}>RWF {c.value.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Payment Methods & Top Workers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Payment Methods */}
        <div className="bg-[#161616] border border-white/[0.06] rounded-xl p-5">
          <h3 className="font-playfair text-lg text-white mb-4">Revenue by Payment Method</h3>
          <div className="space-y-3">
            {paymentMethods.map(pm => (
              <div key={pm.paymentMethod} className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">{pm.paymentMethod.replace('_', ' ')}</span>
                <span className="text-white font-semibold text-sm">RWF {(pm._sum.price || 0).toLocaleString()}</span>
              </div>
            ))}
            {paymentMethods.length === 0 && <p className="text-gray-600 text-sm text-center py-4">No data yet.</p>}
          </div>
        </div>

        {/* Top Workers */}
        <div className="bg-[#161616] border border-white/[0.06] rounded-xl p-5">
          <h3 className="font-playfair text-lg text-white mb-4">Top Performing Staff</h3>
          <div className="space-y-3">
            {topWorkers.map((w, i) => (
              <div key={w.workerId} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="text-gray-600 text-xs font-mono w-4">#{i + 1}</span>
                  <span className="text-white text-sm">{w.name}</span>
                </div>
                <span className="text-gold font-semibold text-sm">RWF {(w._sum.price || 0).toLocaleString()}</span>
              </div>
            ))}
            {topWorkers.length === 0 && <p className="text-gray-600 text-sm text-center py-4">No data yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
