'use client';

import { useState } from 'react';
import { StatusBadge, ActionButton } from '@/components/ui';
import { WorkerModal } from '@/components/admin/WorkerModal';

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/20event" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

type Worker = {
  id: string;
  phone: string | null;
  roleTitle: string;
  commissionType: string;
  commissionRate: number;
  status: string;
  balance: number;
  user: { name: string; email: string };
  advances: { id: string; amount: number }[];
  payments: { amount: number; date: Date }[];
};

export default function WorkersClient({ workers, users: initialUsers = [] }: { workers: Worker[]; users?: any[] }) {
  const [list, setList] = useState(workers);
  const [users, setUsers] = useState(initialUsers);
  const [payingId, setPayingId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, { text: string; ok: boolean }>>({});
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editWorker, setEditWorker] = useState<Worker | null>(null);

  const handleModalSuccess = (savedWorker: Worker, isNew: boolean) => {
    setIsModalOpen(false);
    if (isNew) {
      setList(prev => [savedWorker, ...prev]);
      setUsers(prev => prev.filter(u => u.id !== savedWorker.id)); // Remove from available users
    } else {
      setList(prev => prev.map(w => w.id === savedWorker.id ? { ...savedWorker, advances: w.advances, payments: w.payments, balance: w.balance } : w));
    }
  };

  const openEdit = (w: Worker) => {
    setEditWorker(w);
    setIsModalOpen(true);
  };
  
  const openCreate = () => {
    setEditWorker(null);
    setIsModalOpen(true);
  };

  const handlePayout = async (workerId: string) => {
    setPayingId(workerId);
    try {
      const res = await fetch('/api/admin/workers/payout', {
        method: 'POST',
        body: JSON.stringify({ workerId }),
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.success) {
        setMessages(m => ({ ...m, [workerId]: { text: `✅ Paid RWF ${data.netPayout.toLocaleString()}`, ok: true } }));
        setList(prev => prev.map(w => w.id === workerId ? { ...w, balance: 0, advances: [] } : w));
      } else {
        setMessages(m => ({ ...m, [workerId]: { text: `❌ ${data.error}`, ok: false } }));
      }
    } catch {
      setMessages(m => ({ ...m, [workerId]: { text: '❌ Network error.', ok: false } }));
    }
    setPayingId(null);
  };

  if (list.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <ActionButton variant="primary" onClick={openCreate}>+ Add New Staff</ActionButton>
        </div>
        <div className="admin-card p-16 text-center">
          <p className="font-sans text-sm" style={{ color: 'var(--admin-text-muted)' }}>No workers added yet. Add a WORKER-role user in User Management.</p>
        </div>
        <WorkerModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={handleModalSuccess} 
          users={users} 
          editWorker={editWorker} 
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <ActionButton variant="primary" onClick={openCreate}>+ Add New Staff</ActionButton>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {list.map(worker => {
        const pendingAdvances = worker.advances.reduce((s, a) => s + a.amount, 0);
        const netPayout = Math.max(0, worker.balance - pendingAdvances);
        const msg = messages[worker.id];

        return (
          <div key={worker.id} className="admin-card p-5 space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold font-sans flex items-center gap-2" style={{ color: 'var(--admin-text-primary)' }}>
                  {worker.user.name}
                  <button onClick={() => openEdit(worker)} className="p-1 rounded opacity-50 hover:opacity-100 hover:bg-white/5 transition-all">
                    <EditIcon />
                  </button>
                </p>
                <p className="text-xs font-sans mt-0.5" style={{ color: 'var(--admin-text-muted)' }}>{worker.roleTitle}</p>
                <p className="text-xs font-mono" style={{ color: 'var(--admin-text-faint)' }}>{worker.user.email}</p>
              </div>
              <StatusBadge status={worker.status} />
            </div>

            {/* Commission */}
            <div className="flex items-center justify-between rounded-lg px-3 py-2" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <span className="text-xs font-sans" style={{ color: 'var(--admin-text-muted)' }}>Commission</span>
              <span className="font-semibold text-sm text-gold">
                {worker.commissionRate}{worker.commissionType === 'PERCENTAGE' ? '%' : ' RWF Fixed'}
              </span>
            </div>

            {/* Balance Breakdown */}
            <div className="space-y-2 text-sm font-sans">
              <div className="flex justify-between">
                <span style={{ color: 'var(--admin-text-muted)' }}>Unpaid Balance</span>
                <span className="font-semibold" style={{ color: 'var(--admin-text-primary)' }}>RWF {worker.balance.toLocaleString()}</span>
              </div>
              {pendingAdvances > 0 && (
                <div className="flex justify-between" style={{ color: 'var(--status-cancelled-text)' }}>
                  <span>Advances to Deduct</span>
                  <span className="font-semibold">− RWF {pendingAdvances.toLocaleString()}</span>
                </div>
              )}
              {worker.balance > 0 && (
                <div className="flex justify-between pt-2" style={{ borderTop: '1px solid var(--admin-border)', color: 'var(--status-completed-text)' }}>
                  <span className="font-semibold">Net Payout</span>
                  <span className="font-bold">RWF {netPayout.toLocaleString()}</span>
                </div>
              )}
            </div>

            {/* Feedback */}
            {msg && (
              <p className="text-xs font-sans" style={{ color: msg.ok ? 'var(--status-completed-text)' : 'var(--status-cancelled-text)' }}>{msg.text}</p>
            )}

            {/* Payout Button */}
            <ActionButton
              variant="ghost"
              loading={payingId === worker.id}
              loadingText="Processing..."
              disabled={worker.balance <= 0}
              onClick={() => handlePayout(worker.id)}
              style={{ borderColor: 'var(--admin-border)', color: 'var(--admin-text-primary)' }}
            >
              {worker.balance > 0 ? `Pay Worker (RWF ${netPayout.toLocaleString()})` : 'No Balance to Pay'}
            </ActionButton>
          </div>
        );
      })}
      </div>
      <WorkerModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={handleModalSuccess} 
        users={users} 
        editWorker={editWorker} 
      />
    </div>
  );
}
