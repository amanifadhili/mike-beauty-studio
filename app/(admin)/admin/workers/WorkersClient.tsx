'use client';

import { useState, useEffect } from 'react';
import { ActionButton, StatusBadge, DataTable } from '@/components/ui';
import { WorkerModal } from '@/components/admin/WorkerModal';
import { motion, AnimatePresence } from 'framer-motion';
import { deleteWorker } from '@/app/actions/adminWorkers';
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
  useEffect(() => { setList(workers); }, [workers]);
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

  const handleDelete = async (workerId: string) => {
    if (confirm("Are you sure? Note: You cannot delete staff who have registered transactions or bookings.")) {
      const res = await deleteWorker(workerId);
      if (res.success) {
        setList(prev => prev.filter(w => w.id !== workerId));
      } else {
        alert(res.error || "Failed to delete worker.");
      }
    }
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
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {list.map(worker => {
            const pendingAdvances = worker.advances?.reduce((s, a) => s + (a.amount || 0), 0) || 0;
            const netPayout = Math.max(0, (worker.balance || 0) - pendingAdvances);
            const msg = messages[worker.id];

            return (
              <motion.div 
                key={worker.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`relative flex flex-col rounded-2xl overflow-hidden shadow-lg border border-white/5 transition-all group ${
                  worker.status === 'ACTIVE' ? 'bg-white/5 hover:bg-white/10' : 'bg-black/40 opacity-80'
                }`}
              >
                {/* Header Banner */}
                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className={`font-playfair text-xl tracking-wide ${worker.status === 'ACTIVE' ? 'text-gold' : 'text-gray-400'}`}>
                        {worker.name}
                      </h3>
                      <p className="text-xs font-sans text-gray-500 mt-0.5">{worker.roleTitle || 'Staff'}</p>
                      <p className="text-[10px] font-mono text-gray-700 mt-0.5">{worker.email}</p>
                    </div>
                    <StatusBadge status={worker.status} />
                  </div>
    
                  <div className="flex items-center justify-between rounded-lg px-3 py-2 bg-white/[0.03] border border-white/5 mb-4">
                    <span className="text-[11px] uppercase tracking-wider text-gray-500 font-sans">Commission</span>
                    <span className="font-semibold text-sm text-gold">
                      {worker.commissionRate}{worker.commissionType === 'PERCENTAGE' ? '%' : ' Fixed'}
                    </span>
                  </div>
    
                  <div className="space-y-2 text-sm font-sans mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Unpaid Balance</span>
                      <span className="font-semibold text-white">RWF {(worker.balance || 0).toLocaleString()}</span>
                    </div>
                    {pendingAdvances > 0 && (
                      <div className="flex justify-between text-red-400">
                        <span>Advances</span>
                        <span className="font-semibold">− RWF {pendingAdvances.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-3 mt-1 border-t border-white/5 text-emerald-400">
                      <span className="font-semibold uppercase text-xs tracking-wider">Net Payout</span>
                      <span className="font-bold">RWF {netPayout.toLocaleString()}</span>
                    </div>
                  </div>
    
                  {msg && (
                    <p className="text-[11px] font-sans mb-3 rounded-md px-2 py-1 bg-black/20" style={{ color: msg.ok ? 'var(--status-completed-text)' : 'var(--status-cancelled-text)' }}>{msg.text}</p>
                  )}
    
                  <div className="mt-auto flex flex-col gap-3">
                    <ActionButton
                      variant="ghost"
                      loading={payingId === worker.id}
                      disabled={worker.balance <= 0}
                      onClick={() => handlePayout(worker.id)}
                      className="w-full !py-2 text-xs"
                    >
                      {worker.balance > 0 ? `Process Payout` : 'No Balance Due'}
                    </ActionButton>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => openEdit(worker)}
                          className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 text-gray-400 hover:text-white flex items-center justify-center transition-all"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => handleDelete(worker.id)}
                          className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/10 hover:border-red-500/30 text-red-400 hover:text-red-300 flex items-center justify-center transition-all"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
      <WorkerModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={handleModalSuccess} 
        editWorker={editWorker} 
      />
    </div>
  );
}
