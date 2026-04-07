'use client';

import { useState } from 'react';
import { ActionButton, StatusBadge } from '@/components/ui';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { deleteTransaction, updateTransaction } from '@/app/actions/adminTransactions';

const PAYMENT_LABELS: Record<string, string> = {
  CASH: 'Cash',
  MOBILE_MONEY: 'Mobile Money',
  BANK_TRANSFER: 'Bank Transfer',
  CREDIT: 'Credit',
};

export default function TransactionsClient({ initialData }: { initialData: any[] }) {
  const [editingTx, setEditingTx] = useState<any>(null);
  const [editPayment, setEditPayment] = useState<string>('CASH');
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async (txId: string) => {
    if (confirm("Are you sure you want to delete this transaction? This will reverse any staff commissions and delete related credits.")) {
      setIsDeleting(true);
      const res = await deleteTransaction(txId);
      if (res.success) router.refresh();
      else alert(res.error);
      setIsDeleting(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTx) return;
    const res = await updateTransaction(editingTx.id, editPayment);
    if (res.success) {
      setEditingTx(null);
      router.refresh();
    } else alert(res.error);
  };

  return (
    <div className="mt-8">
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {initialData.length === 0 && (
            <div className="col-span-full admin-card p-12 flex items-center justify-center text-gray-500 font-sans tracking-widest uppercase text-xs">
              No transactions recorded yet.
            </div>
          )}
          {initialData.map(t => (
            <motion.div
              layout
              key={t.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative admin-card p-5 space-y-4 hover:border-white/20 transition-all flex flex-col"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-sans text-gray-400">
                  {new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <StatusBadge status={t.source} />
              </div>

              <div>
                <p className="font-playfair tracking-wide text-lg text-white">{t.client.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="badge badge-booking shadow-sm">{PAYMENT_LABELS[t.paymentMethod] ?? t.paymentMethod}</span>
                  <span className="text-[11px] bg-white/5 px-2 py-0.5 rounded text-gray-400">RWF {t.price.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg px-3 py-2.5 bg-white/[0.03] border border-white/5">
                <div>
                  <p className="font-sans text-sm text-gray-300 line-clamp-1">{t.service.name}</p>
                  <p className="font-sans text-[11px] text-gray-500 mt-0.5">Assigned: {t.worker.name}</p>
                </div>
              </div>

              <div className="flex justify-between items-center px-1 pt-1">
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider">Salon Share</span>
                  <span className="font-sans text-sm text-emerald-400">RWF {(t.salonShare ?? 0).toLocaleString()}</span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider">Commission</span>
                  <span className="font-sans text-sm text-blue-400">RWF {(t.workerCommission ?? 0).toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-auto pt-4 flex gap-2 w-full border-t border-white/5 justify-end">
                <button 
                  onClick={() => { setEditingTx(t); setEditPayment(t.paymentMethod); }} 
                  className="w-9 h-9 rounded bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-all border border-transparent hover:border-white/10"
                  aria-label="Edit Source"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </button>
                <button 
                  disabled={isDeleting}
                  onClick={() => handleDelete(t.id)} 
                  className="w-9 h-9 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center transition-all border border-transparent hover:border-red-500/20 disabled:opacity-50"
                  aria-label="Delete Sale"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {editingTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="admin-surface-alt border border-white/10 p-8 max-w-sm w-full relative shadow-2xl">
            <h3 className="font-playfair text-2xl text-gold mb-2">Edit Payment</h3>
            <p className="text-gray-400 text-sm font-sans mb-6">
              Update payment method for <strong className="text-white">{editingTx.service?.name}</strong>.
            </p>

            <form onSubmit={handleUpdate} className="space-y-4 font-sans text-sm">
              <div className="flex flex-col gap-1.5 focus-within:text-gold text-gray-400">
                <label className="text-[10px] uppercase tracking-wider pl-1 font-semibold transition-colors">Payment Method</label>
                <select 
                  className="w-full admin-input border border-white/10 px-4 py-3 bg-[var(--admin-surface)] text-white focus:outline-none focus:border-gold transition-colors appearance-none"
                  value={editPayment} onChange={e => setEditPayment(e.target.value)}
                >
                  <option value="CASH">Cash</option>
                  <option value="MOBILE_MONEY">Mobile Money</option>
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                  <option value="CREDIT">Credit (Loan)</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3 justify-end">
                <button type="button" onClick={() => setEditingTx(null)} className="px-5 py-2 text-gray-400 hover:text-white transition-colors tracking-wide">Cancel</button>
                <ActionButton type="submit">Save Changes</ActionButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
