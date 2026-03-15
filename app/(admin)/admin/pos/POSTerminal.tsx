'use client';

import { useState } from 'react';
import { ActionButton } from '@/components/ui';
import { POSModal } from '@/components/admin/POSModal';
import { useRouter } from 'next/navigation';

export default function POSClient({ services, staff, recentTransactions }: { services: any[]; staff: any[]; recentTransactions: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleSuccess = () => {
    router.refresh();
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <p className="text-[11px] font-sans uppercase tracking-[0.2em] text-gold/70 mb-1">Point of Sale</p>
          <h1 className="font-playfair text-3xl text-white">Walk-In Terminal</h1>
          <p className="text-gray-600 text-sm font-sans mt-1">Record walk-in clients and calculate staff commissions.</p>
        </div>
        <ActionButton onClick={() => setIsModalOpen(true)}>+ New Sale</ActionButton>
      </div>

      <div className="admin-card overflow-hidden">
        {recentTransactions.length === 0 ? (
          <div className="p-12 text-center font-sans text-sm" style={{ color: 'var(--admin-text-muted)' }}>No walk-in sales recorded today.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full font-sans text-sm text-left min-w-max">
              <thead className="text-[10px] text-gray-600 uppercase tracking-[0.15em] border-b border-white/[0.04]">
                <tr>
                  <th className="px-6 py-4">Time</th>
                  <th className="px-6 py-4">Service</th>
                  <th className="px-6 py-4">Assigned Staff</th>
                  <th className="px-6 py-4">Payment</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {recentTransactions.map(tx => (
                  <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-white font-medium">
                      {tx.service?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                      {tx.worker?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="badge badge-booking">{tx.paymentMethod?.replace('_', ' ')}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right font-semibold text-gold">
                      RWF {tx.price.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <POSModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        services={services}
        staff={staff}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
