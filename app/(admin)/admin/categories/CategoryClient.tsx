'use client';

import { useState } from 'react';
import { ActionButton, StatusBadge } from '@/components/ui';
import { useRouter } from 'next/navigation';
import { CategoryModal } from '@/components/admin/CategoryModal';

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
    setIsOpen(true);
  };

  const openEdit = (c: Category) => {
    setEditing(c);
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

  const handleSuccess = (savedCategory: Category, isEdit: boolean) => {
    if (isEdit) {
      setCategories(prev => prev.map(c => c.id === savedCategory.id ? savedCategory : c));
    } else {
      setCategories(prev => [...prev, savedCategory]);
    }
    // Re-sort
    setCategories(prev => [...prev].sort((a, b) => a.order - b.order));
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

      <CategoryModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        editingCategory={editing}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
