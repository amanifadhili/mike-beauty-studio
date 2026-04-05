'use client';

import { useState, useEffect } from 'react';
import { ActionButton } from '@/components/ui';
import { IncomeModal, ExternalIncome } from '@/components/admin/IncomeModal';
import { Pencil, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function IncomeClient({ initialIncomes, totalAmount }: { initialIncomes: ExternalIncome[], totalAmount: number }) {
  const [incomes, setIncomes] = useState<ExternalIncome[]>(initialIncomes);
  useEffect(() => { setIncomes(initialIncomes); }, [initialIncomes]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [incomeToEdit, setIncomeToEdit] = useState<ExternalIncome | null>(null);

  const openAddModal = () => {
    setIncomeToEdit(null);
    setIsModalOpen(true);
  };

  const openEditModal = (income: ExternalIncome) => {
    setIncomeToEdit(income);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this income record?')) return;
    try {
      const res = await fetch(`/api/admin/income/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setIncomes(prev => prev.filter(e => e.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSuccess = (newIncome: ExternalIncome, isEdit?: boolean) => {
    if (isEdit) {
      setIncomes(prev => prev.map(e => e.id === newIncome.id ? newIncome : e));
    } else {
      setIncomes(prev => [newIncome, ...prev]);
    }
  };

  function renderIncomeCard(inc: ExternalIncome) {
    return (
      <motion.div 
        key={inc.id}
        layout
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3 }}
        className="flex flex-col rounded-2xl overflow-hidden shadow-lg border border-emerald-400/10 bg-emerald-400/5 hover:bg-emerald-400/10 hover:border-emerald-400/20 transition-all group p-5"
      >
        <div className="flex justify-between items-start mb-4">
          <span className="px-2.5 py-1 text-[10px] font-sans uppercase tracking-widest border rounded backdrop-blur-md text-emerald-400 bg-emerald-400/10 border-emerald-400/20">
            {inc.source || 'MANUAL'}
          </span>
          <span className="text-xs text-emerald-400/50 font-sans">
            {new Date(inc.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
        
        <h3 className="font-playfair text-xl text-white mb-6 line-clamp-2 min-h-[3.5rem]">
          {inc.title}
        </h3>
        
        <div className="pt-4 mt-auto border-t border-emerald-400/10 flex items-end justify-between">
          <div>
            <div className="font-sans text-[10px] text-emerald-400/50 uppercase tracking-widest mb-1">
              Amount In
            </div>
            <div className="font-playfair text-xl tracking-wide" style={{ color: 'var(--status-booking)' }}>
              + RWF {inc.amount.toLocaleString()}
            </div>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => openEditModal(inc)}
              className="w-8 h-8 rounded-lg bg-emerald-400/5 hover:bg-emerald-400/20 border border-emerald-400/10 hover:border-emerald-400/30 text-emerald-400/70 hover:text-emerald-400 flex items-center justify-center transition-all"
              title="Edit"
            >
              <Pencil size={14} />
            </button>
            <button 
              onClick={() => handleDelete(inc.id)}
              className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/10 hover:border-red-500/30 text-red-400 hover:text-red-300 flex items-center justify-center transition-all"
              title="Delete"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-2">
        <div>
          <p className="text-[11px] font-sans uppercase tracking-[0.2em] text-gold/70 mb-1">Financial Ledgers</p>
          <h1 className="font-playfair text-3xl text-white">External Income</h1>
          <p className="text-gray-500 text-sm font-sans mt-1">Track external earnings, sub-leases, and manual income.</p>
        </div>
        
        <div className="flex flex-row items-center justify-between w-full md:w-auto gap-4">
          <div className="admin-card px-4 py-2 text-right shrink-0 border border-emerald-400/10 bg-emerald-400/5 rounded-xl">
             <p className="text-[10px] font-sans uppercase tracking-widest text-emerald-400/60">Total In</p>
             <p className="font-playfair text-lg text-emerald-400">+ RWF {totalAmount.toLocaleString()}</p>
          </div>
          <ActionButton onClick={openAddModal}>+ Log Income</ActionButton>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-playfair text-white border-b border-white/10 pb-3 flex items-center justify-between mb-6">
          <span>All Income</span>
          <span className="text-xs font-sans text-white/30 tracking-widest uppercase">{incomes.length} records</span>
        </h2>
        
        {incomes.length === 0 ? (
          <div className="text-center py-16 border border-white/5 rounded-2xl bg-white/[0.02]">
            <p className="text-gray-500 font-sans text-sm">No external income logged yet.</p>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {incomes.map(renderIncomeCard)}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <IncomeModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
        incomeToEdit={incomeToEdit}
      />
    </div>
  );
}
