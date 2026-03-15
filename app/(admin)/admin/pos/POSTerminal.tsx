'use client';

import { useState } from 'react';
import { ActionButton, DataTable } from '@/components/ui';
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

      <DataTable
        data={recentTransactions}
        columns={['Time', 'Service', 'Assigned Staff', 'Payment', 'Amount']}
        emptyStateMessage="No walk-in sales recorded today."
        renderRow={(tx) => (
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
        )}
        renderCard={(tx) => (
          <div className="p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-white font-medium text-sm">{tx.service?.name}</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <span className="badge badge-booking shadow-sm">{tx.paymentMethod?.replace('_', ' ')}</span>
            </div>
            <div className="flex justify-between items-center rounded-lg px-3 py-2 bg-white/[0.02]">
              <span className="text-xs font-sans text-gray-400">{tx.worker?.name || 'Unassigned'}</span>
              <span className="text-sm font-semibold text-gold tracking-wide">
                RWF {tx.price.toLocaleString()}
              </span>
            </div>
          </div>
        )}
      />

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
