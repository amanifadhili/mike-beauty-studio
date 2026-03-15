'use client';

import { useState } from 'react';
import { PaymentMethod } from '@prisma/client';
import { createPOSTransaction } from '@/actions/pos';
import { ActionButton } from '@/components/ui';

const PAYMENT_METHODS = ['CASH', 'MOBILE_MONEY', 'BANK_TRANSFER', 'CREDIT'] as const;

interface POSModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: any[];
  staff: { id: string, name: string, roleTitle: string | null }[];
  onSuccess: () => void;
}

export function POSModal({ isOpen, onClose, services, staff, onSuccess }: POSModalProps) {
  const [selectedService, setSelectedService] = useState('');
  const [selectedStaff, setSelectedStaff] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<string>('CASH');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const service = services.find(s => s.id === selectedService);
  const isFormValid = !!(selectedService && selectedStaff && clientName);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setLoading(true);
    setMessage('');

    const result = await createPOSTransaction({ 
      serviceId: selectedService, 
      userId: selectedStaff, 
      paymentMethod: paymentMethod as PaymentMethod, 
      clientName, 
      clientPhone 
    });

    if (result.success) {
      onSuccess();
      setSelectedService('');
      setClientName('');
      setClientPhone('');
      onClose();
    } else {
      setMessage(result.error ?? 'An unknown error occurred.');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose} style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
      <div className="admin-card p-6 w-full max-w-2xl animate-fade-in-up shadow-2xl overflow-y-auto max-h-[90vh]" onClick={e => e.stopPropagation()} style={{ background: 'var(--admin-elevated)' }}>
        <h2 className="font-playfair text-xl mb-6" style={{ color: 'var(--admin-text-primary)' }}>New Walk-In Sale</h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Service */}
          <div>
            <label className="block text-xs font-sans uppercase tracking-wider mb-1.5" style={{ color: 'var(--admin-text-muted)' }}>Service *</label>
            <select value={selectedService} onChange={e => setSelectedService(e.target.value)} disabled={loading} className="admin-select w-full">
              <option value="">-- Select Service --</option>
              {services.map(s => (
                <option key={s.id} value={s.id}>{s.name} — RWF {s.price.toLocaleString()}</option>
              ))}
            </select>
          </div>

          {/* Staff */}
          <div>
            <label className="block text-xs font-sans uppercase tracking-wider mb-1.5" style={{ color: 'var(--admin-text-muted)' }}>Assigned Staff *</label>
            <select value={selectedStaff} onChange={e => setSelectedStaff(e.target.value)} disabled={loading} className="admin-select w-full">
              <option value="">-- Select Staff --</option>
              {staff.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.roleTitle || 'STAFF'})</option>
              ))}
            </select>
          </div>

          {/* Client */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-sans uppercase tracking-wider mb-1.5" style={{ color: 'var(--admin-text-muted)' }}>Client Name *</label>
              <input type="text" value={clientName} onChange={e => setClientName(e.target.value)} placeholder="e.g. Jane Doe" disabled={loading} className="admin-input w-full" />
            </div>
            <div>
              <label className="block text-xs font-sans uppercase tracking-wider mb-1.5" style={{ color: 'var(--admin-text-muted)' }}>Phone (Optional)</label>
              <input type="text" value={clientPhone} onChange={e => setClientPhone(e.target.value)} placeholder="+250..." disabled={loading} className="admin-input w-full" />
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-xs font-sans uppercase tracking-wider mb-1.5" style={{ color: 'var(--admin-text-muted)' }}>Payment Method *</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PAYMENT_METHODS.map(method => (
                <label
                  key={method}
                  className={`flex items-center justify-center p-3 rounded-lg cursor-pointer text-xs font-sans font-semibold transition-all border ${
                    paymentMethod === method
                      ? 'bg-gold/10 border-gold/40 text-gold'
                      : 'border-admin-border text-admin-secondary hover:border-white/20'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  style={{
                    borderColor: paymentMethod === method ? 'var(--admin-border-focus)' : 'var(--admin-border)',
                    color: paymentMethod === method ? 'var(--color-gold)' : 'var(--admin-text-secondary)',
                  }}
                >
                  <input type="radio" name="payment" value={method} checked={paymentMethod === method} onChange={() => setPaymentMethod(method)} className="hidden" disabled={loading} />
                  {method.replace(/_/g, ' ')}
                </label>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-between items-center p-4 rounded-lg bg-white/[0.04] border border-white/[0.06]">
            <span className="font-sans text-sm" style={{ color: 'var(--admin-text-secondary)' }}>Total Due:</span>
            <span className="font-playfair text-2xl text-gold">{service ? `RWF ${service.price.toLocaleString()}` : 'RWF 0'}</span>
          </div>

          {/* Feedback */}
          {message && (
            <div className="p-4 rounded-lg text-sm font-sans bg-red-500/10 text-red-400 border border-red-500/20">
              {message}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-6 border-t border-white/[0.06]">
            <button type="button" onClick={onClose} disabled={loading} className="px-4 py-2 text-sm font-sans text-gray-400 hover:text-white transition-colors">Cancel</button>
            <ActionButton type="submit" variant="gold" loading={loading} disabled={!isFormValid}>
              Confirm Transaction
            </ActionButton>
          </div>
        </form>
      </div>
    </div>
  );
}
