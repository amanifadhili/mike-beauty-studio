'use client';

import { useState, useEffect } from 'react';
import { ActionButton } from '@/components/ui/ActionButton';

type StaffUser = {
  id: string;
  name: string;
  email: string;
  roleTitle: string | null;
  commissionType: string;
  commissionRate: number;
  status: string;
};

interface WorkerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (worker: any, isNew: boolean) => void;
  editWorker?: StaffUser | null;
}

export function WorkerModal({ isOpen, onClose, onSuccess, editWorker }: WorkerModalProps) {
  const isEditing = !!editWorker;
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    roleTitle: '',
    commissionType: 'PERCENTAGE',
    commissionRate: '',
    status: 'ACTIVE',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Reset or populate form when modal opens
  useEffect(() => {
    if (isOpen) {
      setError('');
      if (editWorker) {
        setFormData({
          name: editWorker.name,
          email: editWorker.email,
          password: '', // Never pre-fill password
          phone: '',
          roleTitle: editWorker.roleTitle || 'Lash Technician',
          commissionType: editWorker.commissionType,
          commissionRate: editWorker.commissionRate.toString(),
          status: editWorker.status,
        });
      } else {
        setFormData({
          name: '', email: '', password: '', phone: '',
          roleTitle: 'Lash Technician', commissionType: 'PERCENTAGE',
          commissionRate: '', status: 'ACTIVE',
        });
      }
    }
  }, [isOpen, editWorker]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!isEditing) {
      if (!formData.name.trim()) return setError('Full name is required.');
      if (!formData.email.trim()) return setError('Email address is required.');
      if (!formData.password || formData.password.length < 6) return setError('Password must be at least 6 characters.');
    }
    if (!formData.roleTitle.trim()) return setError('Role title is required (e.g. Lash Technician).');
    if (!formData.commissionRate || isNaN(Number(formData.commissionRate))) {
      return setError('A valid commission rate is required.');
    }

    setLoading(true);

    try {
      const method = isEditing ? 'PUT' : 'POST';
      const payload = isEditing 
        ? { id: editWorker.id, ...formData }
        : formData;

      const res = await fetch('/api/admin/workers', {
        method,
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' },
      });
      
      const data = await res.json();
      
      if (data.success) {
        onSuccess(data.staff, !isEditing);
      } else {
        setError(data.error || 'Failed to save staff profile.');
      }
    } catch (err) {
      setError('A network error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const field = (label: string, key: keyof typeof formData, type = 'text', placeholder = '', required = true) => (
    <div>
      <label className="block text-xs font-sans uppercase tracking-wider mb-1.5" style={{ color: 'var(--admin-text-muted)' }}>
        {label}{required ? ' *' : ''}
      </label>
      <input
        type={type}
        value={formData[key]}
        onChange={e => setFormData({ ...formData, [key]: e.target.value })}
        placeholder={placeholder}
        className="admin-input w-full"
        disabled={loading}
        required={required}
      />
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
      <div className="admin-card w-full max-w-md p-6 max-h-[90vh] overflow-y-auto" style={{ background: 'var(--admin-elevated)' }}>
        <h2 className="font-playfair text-2xl mb-1" style={{ color: 'var(--admin-text-primary)' }}>
          {isEditing ? 'Edit Staff Profile' : 'Add New Staff Member'}
        </h2>
        <p className="text-sm font-sans mb-6" style={{ color: 'var(--admin-text-secondary)' }}>
          {isEditing 
            ? `Update settings for ${editWorker.name}.`
            : 'Create a new staff account with full commission and role settings.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Full Name & Email — only shown on create */}
          {!isEditing && (
            <>
              {field('Full Name', 'name', 'text', 'e.g. Sarah Uwase')}
              {field('Email Address', 'email', 'email', 'sarah@studio.com')}
              {field('Phone Number', 'phone', 'tel', '+250788000000', false)}
              {field('Temporary Password', 'password', 'password', 'Min. 6 characters')}
            </>
          )}

          {/* Role is defaulted to 'Lash Technician' backend/state, no need for input here */}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-sans uppercase tracking-wider mb-1.5" style={{ color: 'var(--admin-text-muted)' }}>Commission Type *</label>
              <select 
                value={formData.commissionType} 
                onChange={e => setFormData({ ...formData, commissionType: e.target.value })} 
                className="admin-select w-full"
                disabled={loading}
              >
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FIXED">Fixed Amount (RWF)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-sans uppercase tracking-wider mb-1.5" style={{ color: 'var(--admin-text-muted)' }}>Rate *</label>
              <input 
                type="number" 
                value={formData.commissionRate} 
                onChange={e => setFormData({ ...formData, commissionRate: e.target.value })} 
                placeholder={formData.commissionType === 'PERCENTAGE' ? 'e.g. 40' : 'e.g. 5000'}
                className="admin-input w-full"
                disabled={loading}
                required
                min="0"
                step={formData.commissionType === 'PERCENTAGE' ? '0.1' : '1'}
              />
            </div>
          </div>

          {/* Status — only on edit */}
          {isEditing && (
            <div>
              <label className="block text-xs font-sans uppercase tracking-wider mb-1.5" style={{ color: 'var(--admin-text-muted)' }}>Account Status</label>
              <select 
                value={formData.status} 
                onChange={e => setFormData({ ...formData, status: e.target.value })} 
                className="admin-select w-full"
                disabled={loading}
              >
                <option value="ACTIVE">Active (Can accept jobs)</option>
                <option value="INACTIVE">Inactive (Suspended)</option>
              </select>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-lg text-sm font-sans" style={{ background: 'var(--status-cancelled-bg)', color: 'var(--status-cancelled-text)', border: '1px solid var(--status-cancelled-border)' }}>
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-4" style={{ borderTop: '1px solid var(--admin-border)' }}>
            <button 
              type="button" 
              onClick={onClose} 
              disabled={loading}
              className="px-4 py-2 flex-1 rounded-lg text-sm font-sans font-semibold transition-colors disabled:opacity-50"
              style={{ color: 'var(--admin-text-secondary)', background: 'rgba(255,255,255,0.05)' }}
            >
              Cancel
            </button>
            <ActionButton 
              type="submit" 
              variant="gold" 
              loading={loading}
              className="flex-1"
            >
              {isEditing ? 'Save Changes' : 'Create Staff Account'}
            </ActionButton>
          </div>
        </form>
      </div>
    </div>
  );
}
