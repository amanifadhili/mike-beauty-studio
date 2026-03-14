'use client';

import { useState } from 'react';

const CATEGORIES = ['RENT', 'SUPPLIES', 'MAINTENANCE', 'UTILITIES', 'MARKETING', 'OTHER'];
const CATEGORY_COLORS: Record<string, string> = {
  RENT: 'text-orange-400 border-orange-500/40 bg-orange-500/[0.08]',
  SUPPLIES: 'text-blue-400 border-blue-500/40 bg-blue-500/[0.08]',
  MAINTENANCE: 'text-yellow-400 border-yellow-500/40 bg-yellow-500/[0.08]',
  UTILITIES: 'text-sky-400 border-sky-500/40 bg-sky-500/[0.08]',
  MARKETING: 'text-pink-400 border-pink-500/40 bg-pink-500/[0.08]',
  WORKER_PAYOUT: 'text-purple-400 border-purple-500/40 bg-purple-500/[0.08]',
  OTHER: 'text-gray-400 border-gray-500/40 bg-gray-500/[0.08]',
};

type Expense = { id: string; title: string; amount: number; category: string; date: Date };

export default function ExpensesClient({ initialExpenses }: { initialExpenses: Expense[] }) {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [form, setForm] = useState({ title: '', amount: '', category: 'SUPPLIES' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.amount) return;
    setLoading(true);
    setMsg('');
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
        setMsg('✅ Expense logged.');
      } else {
        setMsg(`❌ ${data.error}`);
      }
    } catch { setMsg('❌ Network error.'); }
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Add Expense Form */}
      <div className="bg-[#161616] border border-white/[0.06] rounded-xl p-5 h-fit space-y-4">
        <h2 className="font-playfair text-lg text-white">Log Expense</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1.5">Description</label>
            <input
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Lash glue restock"
              className="w-full bg-[#1e1e1e] border border-white/10 text-white px-3 py-2.5 rounded-lg text-sm outline-none focus:border-gold"
              disabled={loading}
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1.5">Amount (RWF)</label>
            <input
              type="number"
              value={form.amount}
              onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
              placeholder="e.g. 45000"
              className="w-full bg-[#1e1e1e] border border-white/10 text-white px-3 py-2.5 rounded-lg text-sm outline-none focus:border-gold"
              disabled={loading}
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1.5">Category</label>
            <select
              value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              className="w-full bg-[#1e1e1e] border border-white/10 text-white px-3 py-2.5 rounded-lg text-sm outline-none focus:border-gold"
              disabled={loading}
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0) + c.slice(1).toLowerCase()}</option>)}
            </select>
          </div>
          {msg && <p className={`text-sm ${msg.startsWith('✅') ? 'text-green-400' : 'text-red-400'}`}>{msg}</p>}
          <button
            type="submit"
            disabled={loading || !form.title || !form.amount}
            className="w-full bg-gold text-black font-semibold py-2.5 rounded-lg text-sm hover:bg-gold/90 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Add Expense'}
          </button>
        </form>
      </div>

      {/* Expense List */}
      <div className="lg:col-span-2 bg-[#161616] border border-white/[0.06] rounded-xl overflow-hidden">
        {expenses.length === 0 ? (
          <div className="p-16 text-center text-gray-600 font-sans text-sm">No expenses logged yet.</div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {expenses.map(exp => (
              <div key={exp.id} className="flex items-center justify-between px-5 py-4 hover:bg-white/[0.02]">
                <div>
                  <p className="text-white font-sans font-medium text-sm">{exp.title}</p>
                  <p className="text-gray-600 text-xs mt-0.5">{new Date(exp.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase border ${CATEGORY_COLORS[exp.category] || CATEGORY_COLORS.OTHER}`}>{exp.category}</span>
                  <span className="text-red-400 font-semibold font-sans text-sm">− {exp.amount.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
