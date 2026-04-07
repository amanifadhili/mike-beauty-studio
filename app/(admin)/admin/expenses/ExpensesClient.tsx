'use client';

import { useState, useEffect } from 'react';
import { ActionButton } from '@/components/ui';
import { ExpenseModal } from '@/components/admin/ExpenseModal';
import { Pencil, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Expense = { id: string; title: string; amount: number; category: string; date: Date };

const CATEGORY_CLASS: Record<string, string> = {
  RENT:         'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  SUPPLIES:     'text-blue-400 bg-blue-400/10 border-blue-400/20',
  MAINTENANCE:  'text-orange-400 bg-orange-400/10 border-orange-400/20',
  UTILITIES:    'text-purple-400 bg-purple-400/10 border-purple-400/20',
  MARKETING:    'text-pink-400 bg-pink-400/10 border-pink-400/20',
  WORKER_PAYOUT:'text-indigo-400 bg-indigo-400/10 border-indigo-400/20',
  OTHER:        'text-gray-400 bg-gray-400/10 border-gray-400/20',
};

export default function ExpensesClient({ initialExpenses, totalAmount }: { initialExpenses: Expense[], totalAmount: number }) {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  useEffect(() => { setExpenses(initialExpenses); }, [initialExpenses]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState<Expense | null>(null);

  const openAddModal = () => {
    setExpenseToEdit(null);
    setIsModalOpen(true);
  };

  const openEditModal = (expense: Expense) => {
    setExpenseToEdit(expense);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this expense?')) return;
    try {
      const res = await fetch(`/api/admin/expenses/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success !== false) {
        setExpenses(prev => prev.filter(e => e.id !== id));
      } else {
        alert(data.error || 'Failed to delete expense due to a system constraint.');
      }
    } catch (err: any) {
      alert(err.message || 'Network error occurred.');
      console.error(err);
    }
  };

  const handleSuccess = (newExpense: Expense, isEdit?: boolean) => {
    if (isEdit) {
      setExpenses(prev => prev.map(e => e.id === newExpense.id ? newExpense : e));
    } else {
      setExpenses(prev => [newExpense, ...prev]);
    }
  };

  function renderExpenseCard(exp: Expense) {
    const badgeClass = CATEGORY_CLASS[exp.category] || CATEGORY_CLASS.OTHER;
    
    return (
      <motion.div 
        key={exp.id}
        layout
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3 }}
        className="flex flex-col rounded-2xl overflow-hidden shadow-lg border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10 transition-all group p-5"
      >
        <div className="flex justify-between items-start mb-4">
          <span className={`px-2.5 py-1 text-[10px] font-sans uppercase tracking-widest border rounded backdrop-blur-md ${badgeClass}`}>
            {exp.category.replace('_', ' ')}
          </span>
          <span className="text-xs text-gray-500 font-sans">
            {new Date(exp.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
        
        <h3 className="font-playfair text-xl text-white mb-6 line-clamp-2 min-h-[3.5rem]">
          {exp.title}
        </h3>
        
        <div className="pt-4 mt-auto border-t border-white/10 flex items-end justify-between">
          <div>
            <div className="font-sans text-[10px] text-gray-500 uppercase tracking-widest mb-1">
              Amount Out
            </div>
            <div className="font-playfair text-xl tracking-wide" style={{ color: 'var(--status-cancelled-text)' }}>
              − RWF {exp.amount.toLocaleString()}
            </div>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => openEditModal(exp)}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 text-gray-400 hover:text-white flex items-center justify-center transition-all"
              title="Edit"
            >
              <Pencil size={14} />
            </button>
            <button 
              onClick={() => handleDelete(exp.id)}
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
          <h1 className="font-playfair text-3xl text-white">Expenses</h1>
          <p className="text-gray-500 text-sm font-sans mt-1">Track operational costs and overheads.</p>
        </div>
        
        <div className="flex flex-row items-center justify-between w-full md:w-auto gap-4">
          <div className="admin-card px-4 py-2 text-right shrink-0 border border-white/5 bg-white/5 rounded-xl">
             <p className="text-[10px] font-sans uppercase tracking-widest text-gray-500">Total Out</p>
             <p className="font-playfair text-lg text-white">RWF {totalAmount.toLocaleString()}</p>
          </div>
          <ActionButton onClick={openAddModal}>+ Log Expense</ActionButton>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-playfair text-white border-b border-white/10 pb-3 flex items-center justify-between mb-6">
          <span>All Expenses</span>
          <span className="text-xs font-sans text-white/30 tracking-widest uppercase">{expenses.length} records</span>
        </h2>
        
        {expenses.length === 0 ? (
          <div className="text-center py-16 border border-white/5 rounded-2xl bg-white/[0.02]">
            <p className="text-gray-500 font-sans text-sm">No expenses logged yet.</p>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {expenses.map(renderExpenseCard)}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <ExpenseModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
        expenseToEdit={expenseToEdit}
      />
    </div>
  );
}
