'use client';

import { useState, useEffect } from 'react';
import { ActionButton } from '@/components/ui/ActionButton';

type UserOption = { id: string; name: string; email: string };
type Worker = { 
  id: string; 
  roleTitle: string; 
  commissionType: string; 
  commissionRate: number; 
  status: string; 
  user: { name: string; email: string };
};

interface WorkerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (worker: any, isNew: boolean) => void;

  users?: UserOption[];
  editWorker?: Worker | null;
}

export function WorkerModal({ isOpen, onClose, onSuccess, users = [], editWorker }: WorkerModalProps) {
  const isEditing = !!editWorker;
  
  const [formData, setFormData] = useState({
    userId: '',
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
          userId: '', // not needed for edit
          roleTitle: editWorker.roleTitle,
          commissionType: editWorker.commissionType,
          commissionRate: editWorker.commissionRate.toString(),
          status: editWorker.status,
        });
      } else {
        setFormData({
          userId: users.length > 0 ? users[0].id : '',
          roleTitle: '',
          commissionType: 'PERCENTAGE',
          commissionRate: '',
          status: 'ACTIVE',
        });
      }
    }
  }, [isOpen, editWorker, users]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!isEditing && !formData.userId) return setError('Please select a user.');
    if (!formData.roleTitle) return setError('Role title is required.');
    if (!formData.commissionRate || isNaN(Number(formData.commissionRate))) {
      return setError('Valid commission rate is required.');
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
        onSuccess(data.worker, !isEditing);
      } else {
        setError(data.error || 'Failed to save worker.');
      }
    } catch (err) {
      setError('A network error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
      <div className="admin-card w-full max-w-md p-6 max-h-[90vh] overflow-y-auto" style={{ background: 'var(--admin-elevated)' }}>
        <h2 className="font-playfair text-2xl mb-1" style={{ color: 'var(--admin-text-primary)' }}>
          {isEditing ? 'Edit Worker Profile' : 'Add New Staff'}
        </h2>
        <p className="text-sm font-sans mb-6" style={{ color: 'var(--admin-text-secondary)' }}>
          {isEditing 
            ? `Update settings for ${editWorker.user.name}.` 
            : 'Promote an existing user to a staff role.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* User Select (Only on Create) */}
          {!isEditing && (
            <div>
              <label className="block text-xs font-sans uppercase tracking-wider mb-1.5" style={{ color: 'var(--admin-text-muted)' }}>Select User *</label>
              <select 
                value={formData.userId} 
                onChange={e => setFormData({ ...formData, userId: e.target.value })} 
                className="admin-select w-full"
                disabled={loading || users.length === 0}
              >
                {users.length === 0 && <option value="">No eligible users found</option>}
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                ))}
              </select>
              {users.length === 0 && (
                <p className="text-xs mt-1 text-red-400">Please create a user with the WORKER role first.</p>
              )}
            </div>
          )}

          {/* Role Title */}
          <div>
            <label className="block text-xs font-sans uppercase tracking-wider mb-1.5" style={{ color: 'var(--admin-text-muted)' }}>Role Title *</label>
            <input 
              type="text" 
              value={formData.roleTitle} 
              onChange={e => setFormData({ ...formData, roleTitle: e.target.value })} 
              placeholder="e.g. Senior Nail Tech" 
              className="admin-input w-full"
              disabled={loading}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Commission Type */}
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

            {/* Rate */}
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
                step={formData.commissionType === 'PERCENTAGE' ? "0.1" : "1"}
              />
            </div>
          </div>

          {/* Status Toggle (Only on Edit) */}
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

          <div className="flex gap-3 pt-4 border-t border-white/10" style={{ borderColor: 'var(--admin-border)' }}>
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
              disabled={(!isEditing && users.length === 0)}
              className="flex-1"
            >
              Save Profile
            </ActionButton>
          </div>
        </form>
      </div>
    </div>
  );
}
