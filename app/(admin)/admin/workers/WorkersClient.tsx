'use client';

import { useState } from 'react';
import { ActionButton, StatusBadge, DataTable } from '@/components/ui';
import { WorkerModal } from '@/components/admin/WorkerModal';

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

// Unified Staff User Type
type StaffUser = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  roleTitle: string | null;
  commissionType: string;
  commissionRate: number;
  status: string;
  balance: number;
  advances: { id: string; amount: number }[];
  payments: { amount: number; date: Date }[];
};

export default function WorkersClient({ workers }: { workers: StaffUser[] }) {
  const [list, setList] = useState(workers);
  const [payingId, setPayingId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, { text: string; ok: boolean }>>({});
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editWorker, setEditWorker] = useState<StaffUser | null>(null);

  const handleModalSuccess = (savedWorker: StaffUser, isNew: boolean) => {
    setIsModalOpen(false);
    if (isNew) {
      // Adding empty arrays to mimic relations on instant UI insert
      setList(prev => [{ ...savedWorker, advances: [], payments: [], balance: 0 }, ...prev]);
    } else {
      setList(prev => prev.map(w => w.id === savedWorker.id ? { ...savedWorker, advances: w.advances, payments: w.payments, balance: w.balance } : w));
    }
  };

  const openEdit = (w: StaffUser) => {
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
        body: JSON.stringify({ workerId }), // Passing userId
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
          <p className="font-sans text-sm" style={{ color: 'var(--admin-text-muted)' }}>No staff added yet.</p>
        </div>
        <WorkerModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={handleModalSuccess} 
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
      <DataTable
        data={list}
        columns={['Staff Member', 'Role / Email', 'Commission', 'Account Status', 'Payout Actions']}
        emptyStateMessage="No staff added yet."
        renderRow={(worker) => {
          const pendingAdvances = worker.advances?.reduce((s, a) => s + (a.amount || 0), 0) || 0;
          const netPayout = Math.max(0, (worker.balance || 0) - pendingAdvances);
          const msg = messages[worker.id];

          return (
            <tr key={worker.id} className="transition-colors hover:bg-white/[0.02]">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-white">{worker.name}</span>
                  <button aria-label="Edit worker" onClick={() => openEdit(worker)} className="p-1 rounded opacity-50 hover:opacity-100 hover:bg-white/5 transition-all">
                    <EditIcon />
                  </button>
                </div>
              </td>
              <td className="px-6 py-4">
                <p className="text-xs text-gray-400">{worker.roleTitle || 'Staff'}</p>
                <p className="text-xs font-mono text-gray-600">{worker.email}</p>
              </td>
              <td className="px-6 py-4">
                <span className="text-gold font-medium">
                  {worker.commissionRate}{worker.commissionType === 'PERCENTAGE' ? '%' : ' RWF Fixed'}
                </span>
              </td>
              <td className="px-6 py-4">
                <StatusBadge status={worker.status} />
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex flex-col items-end gap-1">
                  {msg ? (
                    <p className="text-[10px] font-sans" style={{ color: msg.ok ? 'var(--status-completed-text)' : 'var(--status-cancelled-text)' }}>{msg.text}</p>
                  ) : (
                    <ActionButton
                      variant="ghost"
                      loading={payingId === worker.id}
                      disabled={worker.balance <= 0}
                      onClick={() => handlePayout(worker.id)}
                      className="!py-1 !px-3 text-xs"
                    >
                      Pay RWF {netPayout.toLocaleString()}
                    </ActionButton>
                  )}
                  {pendingAdvances > 0 && <span className="text-[10px] text-red-400/60">Includes {pendingAdvances.toLocaleString()} advance deduction</span>}
                </div>
              </td>
            </tr>
          );
        }}
        renderCard={(worker) => {
          const pendingAdvances = worker.advances?.reduce((s, a) => s + (a.amount || 0), 0) || 0;
          const netPayout = Math.max(0, (worker.balance || 0) - pendingAdvances);
          const msg = messages[worker.id];

          return (
            <div className="p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold font-sans text-white">{worker.name}</p>
                    <button aria-label="Edit worker" onClick={() => openEdit(worker)} className="p-1 rounded opacity-50 hover:opacity-100 hover:bg-white/5 transition-all">
                      <EditIcon />
                    </button>
                  </div>
                  <p className="text-xs font-sans text-gray-500">{worker.roleTitle || 'Staff'}</p>
                  <p className="text-xs font-mono text-gray-700">{worker.email}</p>
                </div>
                <StatusBadge status={worker.status} />
              </div>

              <div className="flex items-center justify-between rounded-lg px-3 py-2 bg-white/[0.03]">
                <span className="text-xs font-sans text-gray-500">Commission</span>
                <span className="font-semibold text-sm text-gold">
                  {worker.commissionRate}{worker.commissionType === 'PERCENTAGE' ? '%' : ' Fixed'}
                </span>
              </div>

              <div className="space-y-2 text-sm font-sans">
                <div className="flex justify-between">
                  <span className="text-gray-500">Unpaid Balance</span>
                  <span className="font-semibold text-white">RWF {(worker.balance || 0).toLocaleString()}</span>
                </div>
                {pendingAdvances > 0 && (
                  <div className="flex justify-between text-red-400">
                    <span>Advances to Deduct</span>
                    <span className="font-semibold">− RWF {pendingAdvances.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-white/5 text-emerald-400">
                  <span className="font-semibold">Net Payout</span>
                  <span className="font-bold">RWF {netPayout.toLocaleString()}</span>
                </div>
              </div>

              {msg && (
                <p className="text-xs font-sans" style={{ color: msg.ok ? 'var(--status-completed-text)' : 'var(--status-cancelled-text)' }}>{msg.text}</p>
              )}

              <ActionButton
                variant="ghost"
                loading={payingId === worker.id}
                disabled={worker.balance <= 0}
                onClick={() => handlePayout(worker.id)}
                className="w-full"
              >
                {worker.balance > 0 ? `Pay Staff (RWF ${netPayout.toLocaleString()})` : 'No Balance to Pay'}
              </ActionButton>
            </div>
          );
        }}
      />
      <WorkerModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={handleModalSuccess} 
        editWorker={editWorker} 
      />
    </div>
  );
}
