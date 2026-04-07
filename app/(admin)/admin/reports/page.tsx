import { prisma } from '@/lib/prisma';
import { PageHeader, StatCard } from '@/components/ui';
import { ReportFilter } from './ReportFilter';

export const metadata = { title: 'Reports | Mike Beauty Studio Admin' };
export const dynamic = 'force-dynamic';

async function getStandardData() {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const monthAgo = new Date(); monthAgo.setDate(monthAgo.getDate() - 30); monthAgo.setHours(0, 0, 0, 0);

  const [todayTx, monthTx, todayExp, monthExp, paymentMethods, topWorkers] = await Promise.all([
    prisma.transaction.aggregate({ where: { date: { gte: today } },    _sum: { price: true, salonShare: true } }),
    prisma.transaction.aggregate({ where: { date: { gte: monthAgo } }, _sum: { price: true, salonShare: true } }),
    prisma.expense.aggregate(     { where: { date: { gte: today } },    _sum: { amount: true } }),
    prisma.expense.aggregate(     { where: { date: { gte: monthAgo } }, _sum: { amount: true } }),
    prisma.transaction.groupBy({ by: ['paymentMethod'], _sum: { price: true }, orderBy: { _sum: { price: 'desc' } } }),
    prisma.transaction.groupBy({ by: ['userId'], _sum: { price: true, workerCommission: true }, orderBy: { _sum: { price: 'desc' } }, take: 5 }),
  ]);

  const userIds = topWorkers.map(w => w.userId);
  const topUsers = await prisma.user.findMany({ where: { id: { in: userIds } }, select: { id: true, name: true } });

  const enrichedWorkers = topWorkers.map(tw => ({
    ...tw,
    name: topUsers.find(u => u.id === tw.userId)?.name ?? 'Unknown',
  }));

  return { todayTx, monthTx, todayExp, monthExp, paymentMethods, topWorkers: enrichedWorkers };
}

async function getCustomData(startDate: Date, endDate: Date) {
  endDate.setHours(23, 59, 59, 999);
  
  const [customTx, customExp, paymentMethods, topWorkers] = await Promise.all([
    prisma.transaction.aggregate({ where: { date: { gte: startDate, lte: endDate } }, _sum: { price: true, salonShare: true } }),
    prisma.expense.aggregate({ where: { date: { gte: startDate, lte: endDate } }, _sum: { amount: true } }),
    prisma.transaction.groupBy({ where: { date: { gte: startDate, lte: endDate } }, by: ['paymentMethod'], _sum: { price: true }, orderBy: { _sum: { price: 'desc' } } }),
    prisma.transaction.groupBy({ where: { date: { gte: startDate, lte: endDate } }, by: ['userId'], _sum: { price: true, workerCommission: true }, orderBy: { _sum: { price: 'desc' } }, take: 5 }),
  ]);

  const userIds = topWorkers.map(w => w.userId);
  const topUsers = await prisma.user.findMany({ where: { id: { in: userIds } }, select: { id: true, name: true } });
  
  const enrichedWorkers = topWorkers.map(tw => ({
      ...tw, name: topUsers.find(u => u.id === tw.userId)?.name ?? 'Unknown'
  }));

  return { customTx, customExp, paymentMethods, topWorkers: enrichedWorkers };
}

export default async function ReportsPage(props: { searchParams: Promise<{ start?: string, end?: string }> }) {
  // Gracefully handle Next.js 15 breaking changes (searchParams returning as a Promise)
  const searchParams = typeof props.searchParams === 'object' && props.searchParams && typeof (props.searchParams as any).then === 'function' 
    ? await props.searchParams 
    : (props.searchParams as any);

  let content;
  
  if (searchParams?.start && searchParams?.end) {
     const startDate = new Date(searchParams.start);
     const endDate = new Date(searchParams.end);
     const data = await getCustomData(startDate, endDate);
     
     const revenue = data.customTx._sum.price ?? 0;
     const expenses = data.customExp._sum.amount ?? 0;
     const profit = (data.customTx._sum.salonShare ?? 0) - expenses;

     content = (
       <>
         <section>
           <p className="text-xs uppercase tracking-widest mb-3 text-gold">Custom Range: {startDate.toDateString()} - {endDate.toDateString()}</p>
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
             <StatCard label="Revenue"    value={revenue}  variant="gold"                                   unit="RWF" />
             <StatCard label="Expenses"   value={expenses} variant="red"                                    unit="RWF" />
             <StatCard label="Net Profit" value={profit}   variant={profit >= 0 ? 'green' : 'red'}    unit="RWF" />
           </div>
         </section>
         <BreakdownPanels paymentMethods={data.paymentMethods} topWorkers={data.topWorkers} />
       </>
     );
  } else {
    const data = await getStandardData();
    const todayRevenue  = data.todayTx._sum.price   ?? 0;
    const todayExpenses = data.todayExp._sum.amount  ?? 0;
    const todayProfit   = (data.todayTx._sum.salonShare ?? 0) - todayExpenses;
  
    const monthRevenue  = data.monthTx._sum.price   ?? 0;
    const monthExpenses = data.monthExp._sum.amount  ?? 0;
    const monthProfit   = (data.monthTx._sum.salonShare ?? 0) - monthExpenses;

    content = (
      <>
        <section>
          <p className="text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--admin-text-muted)' }}>Today</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard label="Revenue"    value={todayRevenue}  variant="gold"                                   unit="RWF" />
            <StatCard label="Expenses"   value={todayExpenses} variant="red"                                    unit="RWF" />
            <StatCard label="Net Profit" value={todayProfit}   variant={todayProfit >= 0 ? 'green' : 'red'}    unit="RWF" />
          </div>
        </section>
        <section>
          <p className="text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--admin-text-muted)' }}>Last 30 Days</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard label="Revenue"    value={monthRevenue}  variant="gold"                                    unit="RWF" />
            <StatCard label="Expenses"   value={monthExpenses} variant="red"                                     unit="RWF" />
            <StatCard label="Net Profit" value={monthProfit}   variant={monthProfit >= 0 ? 'green' : 'red'}     unit="RWF" />
          </div>
        </section>
        <BreakdownPanels paymentMethods={data.paymentMethods} topWorkers={data.topWorkers} />
      </>
    );
  }

  return (
    <div className="animate-fade-in-up space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader title="Financial Reports" subtitle="Your studio performance at a glance." />
      </div>

      <ReportFilter />
      {content}
    </div>
  );
}

function BreakdownPanels({ paymentMethods, topWorkers }: { paymentMethods: any[], topWorkers: any[] }) {
  return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="admin-card p-5 space-y-3">
          <h3 className="font-playfair text-lg" style={{ color: 'var(--admin-text-primary)' }}>Revenue by Payment Method</h3>
          {paymentMethods.length === 0 ? (
            <p className="text-sm py-4 text-center" style={{ color: 'var(--admin-text-muted)' }}>No data yet.</p>
          ) : paymentMethods.map(pm => (
            <div key={pm.paymentMethod} className="flex justify-between items-center">
              <span className="text-sm" style={{ color: 'var(--admin-text-secondary)' }}>{pm.paymentMethod.replace(/_/g, ' ')}</span>
              <span className="font-semibold text-sm" style={{ color: 'var(--admin-text-primary)' }}>RWF {(pm._sum.price ?? 0).toLocaleString()}</span>
            </div>
          ))}
        </div>

        <div className="admin-card p-5 space-y-3">
          <h3 className="font-playfair text-lg" style={{ color: 'var(--admin-text-primary)' }}>Top Performing Staff</h3>
          {topWorkers.length === 0 ? (
            <p className="text-sm py-4 text-center" style={{ color: 'var(--admin-text-muted)' }}>No data yet.</p>
          ) : topWorkers.map((w, i) => (
            <div key={w.userId} className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="w-4 text-xs font-mono" style={{ color: 'var(--admin-text-muted)' }}>#{i + 1}</span>
                <span className="text-sm" style={{ color: 'var(--admin-text-primary)' }}>{w.name}</span>
              </div>
              <span className="font-semibold text-sm text-gold">RWF {(w._sum.price ?? 0).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
  )
}
