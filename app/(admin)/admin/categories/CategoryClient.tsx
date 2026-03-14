'use client';

import { useState } from 'react';
import { ActionButton, StatusBadge } from '@/components/ui';
import { useRouter } from 'next/navigation';

type Category = {
  id: string;
  name: string;
  order: number;
  _count: { services: number };
};

export function CategoryClient({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [order, setOrder] = useState('0');
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();

  const openNew = () => {
    setEditing(null);
    setName('');
    setOrder('0');
    setIsOpen(true);
  };

  const openEdit = (c: Category) => {
    setEditing(c);
    setName(c.name);
    setOrder(c.order.toString());
    setIsOpen(true);
  };

  const handleDelete = async (id: string, count: number) => {
    if (count > 0) return alert('Cannot delete a category that still holds services. Reassign them first.');
    if (!confirm('Are you sure you want to delete this category?')) return;
    
    setLoading(true);
    const res = await fetch(`/api/admin/categories?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      setCategories(prev => prev.filter(c => c.id !== id));
      router.refresh();
    } else {
      alert('Failed to delete category');
    }
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = { id: editing?.id, name, order: parseInt(order) || 0 };
    const method = editing ? 'PUT' : 'POST';
    
    const res = await fetch('/api/admin/categories', {
      method,
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();
    if (data.success) {
      if (editing) {
        setCategories(prev => prev.map(c => c.id === editing.id ? { ...c, name, order: payload.order } : c));
      } else {
        setCategories(prev => [...prev, { ...data.category, _count: { services: 0 } }]);
      }
      // Re-sort
      setCategories(prev => [...prev].sort((a, b) => a.order - b.order));
      setIsOpen(false);
      router.refresh();
    } else {
      alert(data.error || 'Failed to save');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-[11px] font-sans uppercase tracking-[0.2em] text-gold/70 mb-1">Admin Configuration</p>
          <h1 className="font-playfair text-3xl text-white">Menu Categories</h1>
          <p className="text-gray-600 text-sm font-sans mt-1">Organize your services into logical groups for the public menu.</p>
        </div>
        <ActionButton onClick={openNew}>+ New Category</ActionButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categories.map(c => (
          <div key={c.id} className="admin-surface border border-white/5 p-5 flex flex-col justify-between group">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-xs uppercase text-gray-500 font-sans tracking-widest block mb-1">Order: {c.order}</span>
                <h3 className="text-xl font-playfair text-white">{c.name}</h3>
              </div>
              <StatusBadge status={c._count.services > 0 ? "IN_USE" : "EMPTY"} label={`${c._count.services} Services`} />
            </div>
            
            <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => openEdit(c)} className="text-sm font-sans text-gray-400 hover:text-white transition-colors">Edit</button>
              <button onClick={() => handleDelete(c.id, c._count.services)} className={`text-sm font-sans transition-colors ${c._count.services > 0 ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 hover:text-red-400'}`}>Delete</button>
            </div>
          </div>
        ))}
        {categories.length === 0 && (
          <div className="col-span-3 admin-surface p-12 text-center text-gray-500 font-sans text-sm">
            No categories created yet.
          </div>
        )}
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="admin-surface-alt border border-white/10 p-8 max-w-sm w-full relative shadow-2xl">
            <h3 className="font-playfair text-2xl text-gold mb-6">{editing ? 'Edit Category' : 'New Category'}</h3>
            <form onSubmit={handleSave} className="space-y-4 font-sans text-sm">
              <div className="flex flex-col gap-1">
                <label className="text-gray-400 uppercase tracking-wider text-xs">Display Name</label>
                <input 
                  required autoFocus value={name} onChange={e => setName(e.target.value)}
                  className="w-full admin-input border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-gold transition-colors"
                  placeholder="e.g. Nails, Lashes..."
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-gray-400 uppercase tracking-wider text-xs">Menu Order Sequence</label>
                <input 
                  required type="number" value={order} onChange={e => setOrder(e.target.value)}
                  className="w-full admin-input border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-gold transition-colors"
                  placeholder="e.g. 0, 1, 2"
                />
              </div>
              <div className="pt-4 flex gap-3 justify-end">
                <button type="button" onClick={() => setIsOpen(false)} disabled={loading} className="px-5 py-2 text-gray-400 hover:text-white transition-colors tracking-wide">Cancel</button>
                <ActionButton type="submit" loading={loading}>{loading ? 'Saving...' : 'Save Category'}</ActionButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
