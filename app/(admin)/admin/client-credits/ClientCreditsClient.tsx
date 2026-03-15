'use client';

import { useState } from 'react';
import { ActionButton, StatusBadge } from '@/components/ui';
import { useRouter } from 'next/navigation';

type ClientCredit = {
  id: string;
  clientName: string;
  clientPhone: string | null;
  originalAmount: number;
  paidAmount: number;
  status: 'PENDING' | 'CLEARED';
  createdAt: string;
  transaction: {
    service: { name: string };
  };
};

export function ClientCreditsClient({ initialCredits }: { initialCredits: ClientCredit[] }) {
  const [credits, setCredits] = useState<ClientCredit[]>(initialCredits);
  const [filter, setFilter] = useState<'PENDING' | 'CLEARED'>('PENDING');
  
  const [repaying, setRepaying] = useState<ClientCredit | null>(null);
  const [amount, setAmount] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const filtered = credits.filter(c => c.status === filter);
  const totalOutstanding = credits.filter(c => c.status === 'PENDING').reduce((sum, c) => sum + (c.originalAmount - c.paidAmount), 0);

  const handleRepay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repaying) return;
    setLoading(true);

    try {
      const res = await fetch('/api/admin/client-credits', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: repaying.id, amount: Number(amount) }),
      });

      const data = await res.json();
      if (data.success) {
        // Update local state without full reload
        setCredits(prev => prev.map(c => c.id === data.credit.id ? { ...c, paidAmount: data.credit.paidAmount, status: data.credit.status } : c));
        setRepaying(null);
        setAmount('');
        router.refresh(); // Sync server components
      } else {
        alert(data.error);
      }
    } catch (err: any) {
      alert('Failed to process repayment');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="admin-surface border border-white/5 p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
          <p className="text-xs uppercase font-sans tracking-widest text-gray-500 mb-2">Total Outstanding IOUs</p>
          <p className="text-3xl font-playfair text-white">RWF {totalOutstanding.toLocaleString()}</p>
        </div>
        <div className="admin-surface border border-white/5 p-6 flex justify-between items-center">
          <div>
            <p className="text-xs uppercase font-sans tracking-widest text-gray-500 mb-2">Filter View</p>
            <div className="flex bg-white/5 rounded-lg border border-white/10 p-1">
              <button onClick={() => setFilter('PENDING')} className={`px-4 py-1.5 rounded text-xs font-sans font-medium transition-colors ${filter === 'PENDING' ? 'bg-gold text-charcoal' : 'text-gray-400 hover:text-white'}`}>Pending</button>
              <button onClick={() => setFilter('CLEARED')} className={`px-4 py-1.5 rounded text-xs font-sans font-medium transition-colors ${filter === 'CLEARED' ? 'bg-gold text-charcoal' : 'text-gray-400 hover:text-white'}`}>Cleared History</button>
            </div>
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="admin-card overflow-x-auto">
        <table className="w-full font-sans text-sm text-left">
          <thead className="text-[10px] uppercase tracking-[0.15em] text-gray-500 border-b border-white/10">
            <tr>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Client</th>
              <th className="px-6 py-3">Service</th>
              <th className="px-6 py-3 text-right">Original Debt</th>
              <th className="px-6 py-3 text-right">Balance Due</th>
              <th className="px-6 py-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500 italic">No {filter.toLowerCase()} credits found.</td>
              </tr>
            ) : filtered.map(credit => {
              const balanceDue = credit.originalAmount - credit.paidAmount;
              const isPending = credit.status === 'PENDING';

              return (
                <tr key={credit.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 text-gray-400">
                    {new Date(credit.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-white font-medium">{credit.clientName}</p>
                    {credit.clientPhone && /^\+?\d{8,}$/.test(credit.clientPhone) && (
                       <a href={`https://wa.me/${credit.clientPhone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="text-xs text-emerald-400/70 hover:text-emerald-400 mt-1 inline-block">WhatsApp</a>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-300">{credit.transaction.service.name}</td>
                  <td className="px-6 py-4 text-right text-gray-500">RWF {credit.originalAmount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right">
                    <span className={isPending ? 'text-red-400 font-bold' : 'text-gray-500 line-through'}>
                      RWF {balanceDue.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {isPending ? (
                      <button 
                        onClick={() => { setRepaying(credit); setAmount(balanceDue.toString()); }}
                        className="text-xs font-sans bg-gold/10 text-gold border border-gold/30 px-3 py-1.5 rounded hover:bg-gold/20 transition-colors"
                      >
                        Repay Debt
                      </button>
                    ) : (
                      <StatusBadge status="CLEARED" />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Repay Modal */}
      {repaying && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="admin-surface-alt border border-white/10 p-8 max-w-sm w-full relative shadow-2xl">
            <h3 className="font-playfair text-2xl text-gold mb-2">Process Repayment</h3>
            <p className="text-gray-400 text-sm font-sans mb-6">
              Client <strong className="text-white">{repaying.clientName}</strong> currently owes <strong className="text-red-400">RWF {(repaying.originalAmount - repaying.paidAmount).toLocaleString()}</strong>.
            </p>

            <form onSubmit={handleRepay} className="space-y-4 font-sans text-sm">
              <div className="flex flex-col gap-1">
                <label className="text-gray-400 uppercase tracking-wider text-xs">Amount Received (RWF)</label>
                <input 
                  type="number" required min="1" max={repaying.originalAmount - repaying.paidAmount}
                  value={amount} onChange={e => setAmount(e.target.value)}
                  className="w-full admin-input border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-gold transition-colors"
                  placeholder="e.g. 5000"
                />
              </div>

              <div className="pt-4 flex gap-3 justify-end">
                <button type="button" onClick={() => setRepaying(null)} disabled={loading} className="px-5 py-2 text-gray-400 hover:text-white transition-colors tracking-wide">Cancel</button>
                <ActionButton type="submit" loading={loading}>{loading ? 'Processing...' : 'Collect Payment'}</ActionButton>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
