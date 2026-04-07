'use client';

import { useState, useEffect } from 'react';
import { ActionButton, StatusBadge } from '@/components/ui';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { deleteClientCredit, updateClientCredit } from '@/app/actions/adminCredits';

type ClientCredit = {
  id: string;
  client: {
    name: string;
    phone: string | null;
  };
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
  useEffect(() => { setCredits(initialCredits); }, [initialCredits]);
  const [filter, setFilter] = useState<'PENDING' | 'CLEARED'>('PENDING');
  
  const [repaying, setRepaying] = useState<ClientCredit | null>(null);
  const [amount, setAmount] = useState<string>('');
  
  const [editingCredit, setEditingCredit] = useState<ClientCredit | null>(null);
  const [editAmount, setEditAmount] = useState<string>('');

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to permanently delete this Loan record?")) {
      const res = await deleteClientCredit(id);
      if (res.success) {
        setCredits(prev => prev.filter(c => c.id !== id));
      } else {
        alert(res.error);
      }
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCredit) return;
    setLoading(true);
    const res = await updateClientCredit(editingCredit.id, Number(editAmount));
    if (res.success) {
      setCredits(prev => prev.map(c => c.id === editingCredit.id ? { ...c, originalAmount: Number(editAmount) } : c));
      setEditingCredit(null);
    } else {
      alert(res.error);
    }
    setLoading(false);
  };

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
          <p className="text-xs uppercase font-sans tracking-widest text-gray-500 mb-2">Total Outstanding Loans</p>
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

      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence>
          {filtered.length === 0 && (
             <div className="col-span-full admin-card p-12 flex items-center justify-center text-gray-500 font-sans tracking-widest uppercase text-xs">
               No {filter.toLowerCase()} credits found.
             </div>
          )}
          {filtered.map(credit => {
            const balanceDue = credit.originalAmount - credit.paidAmount;
            const isPending = credit.status === 'PENDING';
            return (
              <motion.div
                layout
                key={credit.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative admin-card p-5 space-y-4 hover:border-white/20 transition-all flex flex-col"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-white font-playfair tracking-wide text-xl">{credit.client.name}</h3>
                    <p className="text-xs text-gray-500 mt-1 font-sans">
                      {new Date(credit.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <StatusBadge status={credit.status} />
                </div>
                
                <div className="flex items-center justify-between rounded-lg px-3 py-2.5 bg-white/[0.03] border border-white/5">
                  <p className="text-sm font-sans text-gray-400">{credit.transaction.service.name}</p>
                  <p className="text-xs font-sans text-gray-500 uppercase tracking-wider">Orig. RWF {credit.originalAmount.toLocaleString()}</p>
                </div>
                
                <div className="flex justify-between items-center bg-black/20 p-3 rounded-lg border border-white/5">
                  <span className="text-[11px] text-gray-400 uppercase tracking-widest font-sans">Balance Due</span>
                  <span className={`text-xl font-medium ${isPending ? 'text-red-400 shadow-red-500/20 drop-shadow-lg' : 'text-gray-500 line-through'}`}>
                    RWF {balanceDue.toLocaleString()}
                  </span>
                </div>

                <div className="mt-auto pt-4 flex gap-2 w-full border-t border-white/5">
                  {isPending && (
                    <button 
                      onClick={() => { setRepaying(credit); setAmount(balanceDue.toString()); }}
                      className="flex-grow text-xs font-sans bg-gold text-charcoal border border-transparent px-3 py-2.5 rounded hover:bg-gold/90 transition-colors tracking-widest text-center uppercase font-bold"
                    >
                      Repay Debt
                    </button>
                  )}
                  <button onClick={() => { setEditingCredit(credit); setEditAmount(credit.originalAmount.toString()); }} className="w-10 h-10 shrink-0 rounded bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-all border border-transparent hover:border-white/10">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </button>
                  <button onClick={() => handleDelete(credit.id)} className="w-10 h-10 shrink-0 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center transition-all border border-transparent hover:border-red-500/20">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Repay Modal */}
      {repaying && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="admin-surface-alt border border-white/10 p-8 max-w-sm w-full relative shadow-2xl">
            <h3 className="font-playfair text-2xl text-gold mb-2">Process Repayment</h3>
            <p className="text-gray-400 text-sm font-sans mb-6">
              Client <strong className="text-white">{repaying.client.name}</strong> currently owes <strong className="text-red-400">RWF {(repaying.originalAmount - repaying.paidAmount).toLocaleString()}</strong>.
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

      {/* Edit Amount Modal */}
      {editingCredit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="admin-surface-alt border border-white/10 p-8 max-w-sm w-full relative shadow-2xl">
            <h3 className="font-playfair text-2xl text-gold mb-2">Edit Loan</h3>
            <p className="text-gray-400 text-sm font-sans mb-6">
              Update original debt amount for <strong className="text-white">{editingCredit.client.name}</strong>.
            </p>

            <form onSubmit={handleUpdate} className="space-y-4 font-sans text-sm">
              <div className="flex flex-col gap-1">
                <label className="text-gray-400 uppercase tracking-wider text-xs">Original Amount (RWF)</label>
                <input 
                  type="number" required min="1"
                  value={editAmount} onChange={e => setEditAmount(e.target.value)}
                  className="w-full admin-input border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-gold transition-colors"
                />
              </div>

              <div className="pt-4 flex gap-3 justify-end">
                <button type="button" onClick={() => setEditingCredit(null)} disabled={loading} className="px-5 py-2 text-gray-400 hover:text-white transition-colors tracking-wide">Cancel</button>
                <ActionButton type="submit" loading={loading}>{loading ? 'Saving...' : 'Save Changes'}</ActionButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
