'use client';

import { useState } from 'react';
import { ActionButton } from '@/components/ui';

const CATEGORIES = ['RENT', 'SUPPLIES', 'MAINTENANCE', 'UTILITIES', 'MARKETING', 'OTHER'] as const;
type Category = typeof CATEGORIES[number];
type Expense = { id: string; title: string; amount: number; category: string; date: Date };

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newExpense: Expense) => void;
}

export function ExpenseModal({ isOpen, onClose, onSuccess }: ExpenseModalProps) {
  const [form, setForm] = useState({ title: '', amount: '', category: 'SUPPLIES' as Category });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: '', ok: false });

  if (!isOpen) return null;

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
        onSuccess(data.expense);
        setForm({ title: '', amount: '', category: 'SUPPLIES' });
        onClose();
      } else {
        setMsg({ text: `❌ ${data.error}`, ok: false });
      }
    } catch {
      setMsg({ text: '❌ Network error.', ok: false });
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose} style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
      <div className="admin-card p-6 w-full max-w-md animate-fade-in-up shadow-2xl" onClick={e => e.stopPropagation()} style={{ background: 'var(--admin-elevated)' }}>
        <h2 className="font-playfair text-xl mb-6" style={{ color: 'var(--admin-text-primary)' }}>Log Expense</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-sans uppercase tracking-wider mb-1.5" style={{ color: 'var(--admin-text-muted)' }}>Description</label>
            <input
              autoFocus
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
            <div className="p-3 rounded-md text-sm font-sans" style={{ background: 'rgba(248,113,113,0.1)', color: 'var(--status-cancelled-text)', border: '1px solid var(--status-cancelled-border)' }}>
              {msg.text}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.06]">
            <button type="button" onClick={onClose} disabled={loading} className="px-4 py-2 text-sm font-sans text-gray-400 hover:text-white transition-colors">Cancel</button>
            <ActionButton type="submit" variant="gold" loading={loading} disabled={!form.title || !form.amount}>
              Add Expense
            </ActionButton>
          </div>
        </form>
      </div>
    </div>
  );
}
