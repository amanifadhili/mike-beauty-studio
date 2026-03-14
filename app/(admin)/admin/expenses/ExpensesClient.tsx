'use client';

import { useState } from 'react';
import { ActionButton } from '@/components/ui';

const CATEGORIES = ['RENT', 'SUPPLIES', 'MAINTENANCE', 'UTILITIES', 'MARKETING', 'OTHER'] as const;
type Category = typeof CATEGORIES[number];

const CATEGORY_CLASS: Record<string, string> = {
  RENT:         'badge badge-new',
  SUPPLIES:     'badge badge-confirmed',
  MAINTENANCE:  'badge badge-new',
  UTILITIES:    'badge badge-walkin',
  MARKETING:    'badge badge-converted',
  WORKER_PAYOUT:'badge badge-booking',
  OTHER:        'badge badge-inactive',
};

type Expense = { id: string; title: string; amount: number; category: string; date: Date };

export default function ExpensesClient({ initialExpenses }: { initialExpenses: Expense[] }) {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [form, setForm] = useState({ title: '', amount: '', category: 'SUPPLIES' as Category });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: '', ok: false });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.amount) return;
    setLoading(true);
    setMsg({ text: '', ok: false });

    try {
      const res = await fetch('/api/admin/expenses', {
        method: 'POST',
        body: JSON.stringify({ ...form, amount: parseInt(form.amount) }),
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.success) {
        setExpenses(prev => [data.expense, ...prev]);
        setForm({ title: '', amount: '', category: 'SUPPLIES' });
        setMsg({ text: '✅ Expense logged.', ok: true });
      } else {
        setMsg({ text: `❌ ${data.error}`, ok: false });
      }
    } catch {
      setMsg({ text: '❌ Network error.', ok: false });
    }
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Add Expense Form */}
      <div className="admin-card p-5 h-fit space-y-4">
        <h2 className="font-playfair text-lg" style={{ color: 'var(--admin-text-primary)' }}>Log Expense</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-sans uppercase tracking-wider mb-1.5" style={{ color: 'var(--admin-text-muted)' }}>Description</label>
            <input
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Lash glue restock"
              disabled={loading}
              className="admin-input w-full"
            />
          </div>
          <div>
            <label className="block text-xs font-sans uppercase tracking-wider mb-1.5" style={{ color: 'var(--admin-text-muted)' }}>Amount (RWF)</label>
            <input
              type="number"
              value={form.amount}
              onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
              placeholder="e.g. 45000"
              disabled={loading}
              className="admin-input w-full"
            />
          </div>
          <div>
            <label className="block text-xs font-sans uppercase tracking-wider mb-1.5" style={{ color: 'var(--admin-text-muted)' }}>Category</label>
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as Category }))} className="admin-select w-full" disabled={loading}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0) + c.slice(1).toLowerCase().replace('_', ' ')}</option>)}
            </select>
          </div>

          {msg.text && (
            <p className="text-sm font-sans" style={{ color: msg.ok ? 'var(--status-completed-text)' : 'var(--status-cancelled-text)' }}>{msg.text}</p>
          )}

          <ActionButton variant="gold" loading={loading} disabled={!form.title || !form.amount}>
            Add Expense
          </ActionButton>
        </form>
      </div>

      {/* Expense List */}
      <div className="lg:col-span-2 admin-card overflow-hidden">
        {expenses.length === 0 ? (
          <div className="p-12 text-center font-sans text-sm" style={{ color: 'var(--admin-text-muted)' }}>No expenses logged yet.</div>
        ) : (
          <div className="divide-y" style={{ borderColor: 'var(--admin-border-subtle)' }}>
            {expenses.map(exp => (
              <div key={exp.id} className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-white/[0.02]">
                <div>
                  <p className="font-sans font-medium text-sm" style={{ color: 'var(--admin-text-primary)' }}>{exp.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--admin-text-muted)' }}>{new Date(exp.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={CATEGORY_CLASS[exp.category] ?? 'badge badge-inactive'}>{exp.category}</span>
                  <span className="font-semibold font-sans text-sm" style={{ color: 'var(--status-cancelled-text)' }}>
                    − {exp.amount.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
