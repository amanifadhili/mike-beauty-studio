'use client';

import { useState, useEffect } from 'react';
import { ActionButton } from '@/components/ui';

export type ExternalIncome = { id: string; title: string; amount: number; source: string | null; date: Date };

interface IncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (income: ExternalIncome, isEdit?: boolean) => void;
  incomeToEdit?: ExternalIncome | null;
}

export function IncomeModal({ isOpen, onClose, onSuccess, incomeToEdit }: IncomeModalProps) {
  const [form, setForm] = useState({ title: '', amount: '', source: '' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: '', ok: false });

  useEffect(() => {
    if (isOpen) {
      if (incomeToEdit) {
        setForm({
          title: incomeToEdit.title,
          amount: incomeToEdit.amount.toString(),
          source: incomeToEdit.source || '',
        });
      } else {
        setForm({ title: '', amount: '', source: '' });
      }
      setMsg({ text: '', ok: false });
    }
  }, [isOpen, incomeToEdit]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.amount) return;
    setLoading(true);
    setMsg({ text: '', ok: false });

    try {
      const isEdit = !!incomeToEdit;
      const endpoint = isEdit ? `/api/admin/income/${incomeToEdit.id}` : '/api/admin/income';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        body: JSON.stringify({ ...form, amount: parseInt(form.amount) }),
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.success) {
        onSuccess(data.income, isEdit);
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
        <h2 className="font-playfair text-xl mb-6" style={{ color: 'var(--admin-text-primary)' }}>{incomeToEdit ? 'Edit Income' : 'Log External Income'}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-sans uppercase tracking-wider mb-1.5" style={{ color: 'var(--admin-text-muted)' }}>Description</label>
            <input
              autoFocus
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Masterclass ticket sale"
              disabled={loading}
              className="admin-input w-full"
            />
          </div>
          <div>
            <label className="block text-xs font-sans uppercase tracking-wider mb-1.5" style={{ color: 'var(--admin-text-muted)' }}>Amount In (RWF)</label>
            <input
              type="number"
              value={form.amount}
              onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
              placeholder="e.g. 50000"
              disabled={loading}
              className="admin-input w-full"
            />
          </div>
          <div>
            <label className="block text-xs font-sans uppercase tracking-wider mb-1.5" style={{ color: 'var(--admin-text-muted)' }}>Source (Optional)</label>
            <input
              value={form.source}
              onChange={e => setForm(f => ({ ...f, source: e.target.value }))}
              placeholder="e.g. Online Store"
              disabled={loading}
              className="admin-input w-full"
            />
          </div>

          {msg.text && (
            <div className="p-3 rounded-md text-sm font-sans" style={{ background: 'rgba(248,113,113,0.1)', color: 'var(--status-cancelled-text)', border: '1px solid var(--status-cancelled-border)' }}>
              {msg.text}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.06]">
            <button type="button" onClick={onClose} disabled={loading} className="px-4 py-2 text-sm font-sans text-gray-400 hover:text-white transition-colors">Cancel</button>
            <ActionButton type="submit" variant="gold" loading={loading} disabled={!form.title || !form.amount}>
              {incomeToEdit ? 'Save Changes' : 'Log Income'}
            </ActionButton>
          </div>
        </form>
      </div>
    </div>
  );
}
