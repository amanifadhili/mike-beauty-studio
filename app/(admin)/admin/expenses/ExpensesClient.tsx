'use client';

import { useState } from 'react';
import { ActionButton, StatusBadge, DataTable } from '@/components/ui';
import { ExpenseModal } from '@/components/admin/ExpenseModal';

type Expense = { id: string; title: string; amount: number; category: string; date: Date };

const CATEGORY_CLASS: Record<string, string> = {
  RENT:         'badge badge-new',
  SUPPLIES:     'badge badge-confirmed',
  MAINTENANCE:  'badge badge-new',
  UTILITIES:    'badge badge-walkin',
  MARKETING:    'badge badge-converted',
  WORKER_PAYOUT:'badge badge-booking',
  OTHER:        'badge badge-inactive',
};

export default function ExpensesClient({ initialExpenses }: { initialExpenses: Expense[] }) {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSuccess = (newExpense: Expense) => {
    setExpenses(prev => [newExpense, ...prev]);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <p className="text-[11px] font-sans uppercase tracking-[0.2em] text-gold/70 mb-1">Financial Ledgers</p>
          <h1 className="font-playfair text-3xl text-white">Expenses</h1>
          <p className="text-gray-600 text-sm font-sans mt-1">Track salon overheads and marketing costs.</p>
        </div>
        <ActionButton onClick={() => setIsModalOpen(true)}>+ Log Expense</ActionButton>
      </div>

      <DataTable
        data={expenses}
        columns={['Date', 'Title', 'Category', 'Amount Out']}
        emptyStateMessage="No expenses logged yet."
        renderRow={(exp) => (
          <tr key={exp.id} className="hover:bg-white/[0.02] transition-colors">
            <td className="px-6 py-4 whitespace-nowrap text-gray-500">
              {new Date(exp.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-white font-medium">
              {exp.title}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className={CATEGORY_CLASS[exp.category] ?? 'badge badge-inactive'}>{exp.category}</span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right font-semibold" style={{ color: 'var(--status-cancelled-text)' }}>
              − RWF {exp.amount.toLocaleString()}
            </td>
          </tr>
        )}
        renderCard={(exp) => (
          <div className="p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-white font-medium text-sm">{exp.title}</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {new Date(exp.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              <span className={CATEGORY_CLASS[exp.category] ?? 'badge badge-inactive'}>{exp.category}</span>
            </div>
            <div className="flex justify-between items-center rounded-lg px-3 py-2 bg-white/[0.02]">
              <span className="text-xs font-sans text-gray-500 uppercase tracking-widest">Amount Out</span>
              <span className="text-sm font-semibold" style={{ color: 'var(--status-cancelled-text)' }}>
                − RWF {exp.amount.toLocaleString()}
              </span>
            </div>
          </div>
        )}
      />

      <ExpenseModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
