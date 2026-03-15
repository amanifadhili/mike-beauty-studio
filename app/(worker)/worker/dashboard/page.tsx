import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { StatCard } from '@/components/ui';

export const dynamic = 'force-dynamic';

export default async function WorkerDashboard() {
  const session = await auth();
  if (!session?.user?.email) redirect('/login');

  // Unified User model — worker properties are directly on the User now
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      transactions: {
        include: {
          client: { select: { name: true } },
          service: { select: { name: true } }
        },
        orderBy: { date: 'desc' },
        take: 20,
      },
      advances: { where: { status: 'PENDING' } },
      payments: { orderBy: { date: 'desc' }, take: 5 },
    },
  });

  if (!user) {
    return (
      <div className="admin-page flex items-center justify-center">
        <div className="admin-card p-10 text-center max-w-sm">
          <p className="font-sans text-sm" style={{ color: 'var(--admin-text-muted)' }}>No worker profile found for this account.</p>
        </div>
      </div>
    );
  }

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const todayTxs = user.transactions.filter(t => new Date(t.date) >= today);
  const todayEarnings = todayTxs.reduce((s, t) => s + t.workerCommission, 0);
  const totalPendingAdvances = user.advances.reduce((s, a) => s + a.amount, 0);
  const netPayout = Math.max(0, user.balance - totalPendingAdvances);

  return (
    <div className="admin-page p-6 space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs font-sans uppercase tracking-widest" style={{ color: 'var(--admin-text-muted)' }}>Worker Portal</p>
        <h1 className="font-playfair text-3xl mt-1" style={{ color: 'var(--admin-text-primary)' }}>Hello, {user.name} 👋</h1>
        <p className="text-sm font-sans mt-1" style={{ color: 'var(--admin-text-muted)' }}>{user.roleTitle}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Today's Jobs"     value={todayTxs.length}   variant="sky" />
        <StatCard label="Today's Earnings" value={todayEarnings}      variant="green"  unit="RWF" />
        <StatCard label="Unpaid Balance"   value={user.balance}       variant="gold"   unit="RWF" />
        <StatCard label="Net Payout"       value={netPayout}          variant="purple" unit="RWF" />
      </div>

      {/* Advance Warning */}
      {user.advances.length > 0 && (
        <div className="rounded-xl p-4" style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.20)' }}>
          <p className="font-semibold text-sm" style={{ color: 'var(--status-new-text)' }}>⚠️ Pending Advance Deductions</p>
          <p className="text-xs mt-1" style={{ color: 'rgba(251,191,36,0.7)' }}>RWF {totalPendingAdvances.toLocaleString()} will be deducted from your next payout.</p>
        </div>
      )}

      {/* Recent Jobs */}
      <div className="admin-card overflow-hidden">
        <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--admin-border)' }}>
          <h2 className="font-playfair text-lg" style={{ color: 'var(--admin-text-primary)' }}>Recent Jobs</h2>
        </div>
        {user.transactions.length === 0 ? (
          <div className="p-10 text-center text-sm font-sans" style={{ color: 'var(--admin-text-muted)' }}>No jobs recorded yet.</div>
        ) : (
          <div className="divide-y" style={{ borderColor: 'var(--admin-border-subtle)' }}>
            {user.transactions.map(tx => (
              <div key={tx.id} className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-white/[0.02]">
                <div>
                  <p className="font-sans text-sm" style={{ color: 'var(--admin-text-primary)' }}>{tx.client.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--admin-text-muted)' }}>{tx.service.name} · {new Date(tx.date).toLocaleDateString()}</p>
                </div>
                <span className="font-semibold text-sm" style={{ color: 'var(--status-completed-text)' }}>+{tx.workerCommission.toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payment History */}
      {user.payments.length > 0 && (
        <div className="admin-card overflow-hidden">
          <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--admin-border)' }}>
            <h2 className="font-playfair text-lg" style={{ color: 'var(--admin-text-primary)' }}>Payment History</h2>
          </div>
          <div className="divide-y" style={{ borderColor: 'var(--admin-border-subtle)' }}>
            {user.payments.map((pay: { date: Date; amount: number }) => (
              <div key={pay.date.toString()} className="flex items-center justify-between px-5 py-4">
                <p className="text-sm font-sans" style={{ color: 'var(--admin-text-secondary)' }}>{new Date(pay.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                <span className="font-semibold text-sm" style={{ color: 'var(--admin-text-primary)' }}>RWF {pay.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
