'use client';

import { useState } from 'react';

type Worker = {
  id: string;
  phone: string | null;
  roleTitle: string;
  commissionType: string;
  commissionRate: number;
  status: string;
  balance: number;
  user: { name: string; email: string };
  advances: { id: string; amount: number }[];
  payments: { amount: number; date: Date }[];
};

const COMMISSION_LABELS: Record<string, string> = {
  PERCENTAGE: '%',
  FIXED: 'RWF Fixed',
};

export default function WorkersClient({ workers, users }: { workers: Worker[], users: any[] }) {
  const [list, setList] = useState(workers);
  const [payingId, setPayingId] = useState<string | null>(null);
  const [payMsg, setPayMsg] = useState('');

  const handlePayout = async (workerId: string) => {
    setPayingId(workerId);
    setPayMsg('');
    try {
      const res = await fetch('/api/admin/workers/payout', {
        method: 'POST',
        body: JSON.stringify({ workerId }),
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.success) {
        setPayMsg(`✅ Paid RWF ${data.netPayout.toLocaleString()} to worker.`);
        setList(prev => prev.map(w => w.id === workerId ? { ...w, balance: 0, advances: [] } : w));
      } else {
        setPayMsg(`❌ ${data.error}`);
      }
    } catch {
      setPayMsg('❌ Network error.');
    }
    setPayingId(null);
  };

  return (
    <div className="space-y-4">
      {payMsg && (
        <div className={`p-4 rounded-lg text-sm ${payMsg.startsWith('✅') ? 'bg-green-900/30 text-green-400 border border-green-500/20' : 'bg-red-900/30 text-red-400 border border-red-500/20'}`}>
          {payMsg}
        </div>
      )}

      {list.length === 0 && (
        <div className="bg-[#161616] border border-white/[0.06] rounded-xl p-16 text-center text-gray-600 font-sans text-sm">
          No workers added yet. Add a worker via User Management.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {list.map(worker => {
          const pendingAdvances = worker.advances.reduce((s, a) => s + a.amount, 0);
          const netPayout = Math.max(0, worker.balance - pendingAdvances);
          return (
            <div key={worker.id} className="bg-[#161616] border border-white/[0.06] rounded-xl p-5 space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-white font-semibold font-sans">{worker.user.name}</p>
                  <p className="text-gray-500 text-xs font-sans">{worker.roleTitle}</p>
                  <p className="text-gray-600 text-xs font-mono mt-0.5">{worker.user.email}</p>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase border ${worker.status === 'ACTIVE' ? 'border-green-500/40 text-green-400 bg-green-500/[0.08]' : 'border-gray-500/40 text-gray-400 bg-gray-500/[0.08]'}`}>
                  {worker.status}
                </span>
              </div>

              {/* Commission */}
              <div className="flex items-center justify-between bg-white/[0.03] rounded-lg px-3 py-2">
                <span className="text-gray-500 text-xs">Commission</span>
                <span className="text-amber-400 font-semibold text-sm">
                  {worker.commissionRate}{COMMISSION_LABELS[worker.commissionType] || ''}
                </span>
              </div>

              {/* Balance */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Unpaid Balance</span>
                  <span className="text-white font-semibold">RWF {worker.balance.toLocaleString()}</span>
                </div>
                {pendingAdvances > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-red-400">Advances to Deduct</span>
                    <span className="text-red-400 font-semibold">− RWF {pendingAdvances.toLocaleString()}</span>
                  </div>
                )}
                {worker.balance > 0 && (
                  <div className="flex justify-between text-sm border-t border-white/[0.06] pt-2 mt-1">
                    <span className="text-green-400 font-semibold">Net Payout</span>
                    <span className="text-green-400 font-bold">RWF {netPayout.toLocaleString()}</span>
                  </div>
                )}
              </div>

              {/* Payout Button */}
              <button
                disabled={worker.balance <= 0 || payingId === worker.id}
                onClick={() => handlePayout(worker.id)}
                className="w-full bg-white/[0.06] hover:bg-white/[0.1] disabled:opacity-40 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors border border-white/[0.06]"
              >
                {payingId === worker.id ? 'Processing...' : worker.balance > 0 ? `Pay Worker (RWF ${netPayout.toLocaleString()})` : 'No Balance to Pay'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
