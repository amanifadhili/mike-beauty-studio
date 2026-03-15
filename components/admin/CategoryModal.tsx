'use client';

import { useState, useEffect } from 'react';
import { ActionButton } from '@/components/ui';

type Category = {
  id: string;
  name: string;
  order: number;
  _count: { services: number };
};

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingCategory?: Category | null;
  onSuccess: (savedCategory: Category, isEdit: boolean) => void;
}

export function CategoryModal({ isOpen, onClose, editingCategory, onSuccess }: CategoryModalProps) {
  const [name, setName] = useState('');
  const [order, setOrder] = useState('0');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName(editingCategory?.name || '');
      setOrder(editingCategory?.order?.toString() || '0');
    }
  }, [isOpen, editingCategory]);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = { id: editingCategory?.id, name, order: parseInt(order) || 0 };
    const method = editingCategory ? 'PUT' : 'POST';
    
    try {
      const res = await fetch('/api/admin/categories', {
        method,
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();
      if (data.success) {
        onSuccess(editingCategory ? { ...editingCategory, name, order: payload.order } : { ...data.category, _count: { services: 0 } }, !!editingCategory);
        onClose();
      } else {
        alert(data.error || 'Failed to save');
      }
    } catch {
      alert('Network error occurred.');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose} style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
      <div className="admin-surface-alt border border-white/10 p-8 max-w-sm w-full relative shadow-2xl animate-fade-in-up" onClick={e => e.stopPropagation()}>
        <h3 className="font-playfair text-2xl text-gold mb-6">{editingCategory ? 'Edit Category' : 'New Category'}</h3>
        <form onSubmit={handleSave} className="space-y-4 font-sans text-sm">
          <div className="flex flex-col gap-1">
            <label className="text-gray-400 uppercase tracking-wider text-xs">Display Name</label>
            <input 
              required autoFocus value={name} onChange={e => setName(e.target.value)} disabled={loading}
              className="w-full admin-input border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-gold transition-colors"
              placeholder="e.g. Nails, Lashes..."
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-gray-400 uppercase tracking-wider text-xs">Menu Order Sequence</label>
            <input 
              required type="number" value={order} onChange={e => setOrder(e.target.value)} disabled={loading}
              className="w-full admin-input border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-gold transition-colors"
              placeholder="e.g. 0, 1, 2"
            />
          </div>
          <div className="pt-4 flex gap-3 justify-end border-t border-white/[0.06] mt-6">
            <button type="button" onClick={onClose} disabled={loading} className="px-5 py-2 text-gray-400 hover:text-white transition-colors tracking-wide">Cancel</button>
            <ActionButton type="submit" loading={loading}>{loading ? 'Saving...' : 'Save Category'}</ActionButton>
          </div>
        </form>
      </div>
    </div>
  );
}
