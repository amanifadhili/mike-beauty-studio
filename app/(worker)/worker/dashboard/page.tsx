import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function WorkerDashboard() {
  const session = await auth();
  if (!session?.user?.email) redirect('/login');

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      workerProfile: {
        include: {
          transactions: {
            include: { service: { select: { name: true } } },
            orderBy: { date: 'desc' },
            take: 20,
          },
          advances: { where: { status: 'PENDING' } },
          payments: { orderBy: { date: 'desc' }, take: 5 }
        }
      }
    }
  });

  if (!user?.workerProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0d0d0d]">
        <div className="text-center p-8">
          <p className="text-gray-400 font-sans">No worker profile found for this account.</p>
        </div>
      </div>
    );
  }

  const worker = user.workerProfile;

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const todayTxs = worker.transactions.filter(t => new Date(t.date) >= today);
  const todayEarnings = todayTxs.reduce((s, t) => s + t.workerCommission, 0);
  const totalPendingAdvances = worker.advances.reduce((s, a) => s + a.amount, 0);
  const netPayout = Math.max(0, worker.balance - totalPendingAdvances);

  return (
    <div className="min-h-screen bg-[#0d0d0d] p-6 space-y-6">
      {/* Header */}
      <div>
        <p className="text-gray-500 text-xs font-sans uppercase tracking-widest">Worker Portal</p>
        <h1 className="font-playfair text-3xl text-white mt-1">Hello, {user.name} 👋</h1>
        <p className="text-gray-600 text-sm font-sans mt-1">{worker.roleTitle}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Today's Jobs", value: todayTxs.length, color: 'text-sky-400', unit: '' },
          { label: "Today's Earnings", value: todayEarnings, color: 'text-green-400', unit: 'RWF ' },
          { label: 'Unpaid Balance', value: worker.balance, color: 'text-gold', unit: 'RWF ' },
          { label: 'Net Payout', value: netPayout, color: 'text-purple-400', unit: 'RWF ' },
        ].map(c => (
          <div key={c.label} className="bg-[#161616] border border-white/[0.06] p-4 rounded-xl">
            <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">{c.label}</p>
            <p className={`font-playfair text-xl ${c.color}`}>{c.unit}{typeof c.value === 'number' ? c.value.toLocaleString() : c.value}</p>
          </div>
        ))}
      </div>

      {/* Pending Advances */}
      {worker.advances.length > 0 && (
        <div className="bg-amber-900/20 border border-amber-500/20 rounded-xl p-4">
          <p className="text-amber-400 text-sm font-semibold">⚠️ Pending Advance Deductions</p>
          <p className="text-amber-300/70 text-xs mt-1">RWF {totalPendingAdvances.toLocaleString()} will be deducted from your next payout.</p>
        </div>
      )}

      {/* Recent Jobs */}
      <div className="bg-[#161616] border border-white/[0.06] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.06]">
          <h2 className="font-playfair text-lg text-white">Recent Jobs</h2>
        </div>
        {worker.transactions.length === 0 ? (
          <div className="p-10 text-center text-gray-600 text-sm font-sans">No jobs recorded yet.</div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {worker.transactions.map(tx => (
              <div key={tx.id} className="flex items-center justify-between px-5 py-4 hover:bg-white/[0.02]">
                <div>
                  <p className="text-white font-sans text-sm">{tx.clientName}</p>
                  <p className="text-gray-500 text-xs">{tx.service.name} · {new Date(tx.date).toLocaleDateString()}</p>
                </div>
                <span className="text-green-400 font-semibold text-sm">+{tx.workerCommission.toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payment History */}
      {worker.payments.length > 0 && (
        <div className="bg-[#161616] border border-white/[0.06] rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-white/[0.06]">
            <h2 className="font-playfair text-lg text-white">Payment History</h2>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {worker.payments.map(pay => (
              <div key={pay.date.toString()} className="flex items-center justify-between px-5 py-4">
                <p className="text-gray-400 text-sm">{new Date(pay.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                <span className="text-white font-semibold text-sm">RWF {pay.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
