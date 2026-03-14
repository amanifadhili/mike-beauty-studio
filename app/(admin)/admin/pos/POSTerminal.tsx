'use client';

import { useState } from 'react';
import { createPOSTransaction } from '@/actions/pos';
import { ActionButton, StatusBadge } from '@/components/ui';

const PAYMENT_METHODS = ['CASH', 'MOBILE_MONEY', 'BANK_TRANSFER', 'CREDIT'] as const;

export default function POSTerminal({ services, workers }: { services: any[]; workers: any[] }) {
  const [selectedService, setSelectedService] = useState('');
  const [selectedWorker, setSelectedWorker] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<string>('CASH');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const service = services.find(s => s.id === selectedService);
  const isFormValid = !!(selectedService && selectedWorker && clientName);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setLoading(true);
    setMessage('');

    const result = await createPOSTransaction({ serviceId: selectedService, workerId: selectedWorker, paymentMethod, clientName, clientPhone });

    if (result.success) {
      setIsSuccess(true);
      setMessage('Transaction completed successfully!');
      setSelectedService('');
      setClientName('');
      setClientPhone('');
    } else {
      setIsSuccess(false);
      setMessage(result.error ?? 'An unknown error occurred.');
    }
    setLoading(false);
  };

  return (
    <div className="admin-card p-6 max-w-2xl">
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

        {/* Worker */}
        <div>
          <label className="block text-xs font-sans uppercase tracking-wider mb-1.5" style={{ color: 'var(--admin-text-muted)' }}>Assigned Worker *</label>
          <select value={selectedWorker} onChange={e => setSelectedWorker(e.target.value)} disabled={loading} className="admin-select w-full">
            <option value="">-- Select Worker --</option>
            {workers.map(w => (
              <option key={w.id} value={w.id}>{w.user.name} ({w.roleTitle})</option>
            ))}
          </select>
        </div>

        {/* Client */}
        <div className="grid grid-cols-2 gap-4">
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
        <div className="flex justify-between items-center p-4 rounded-lg" style={{ background: 'var(--admin-elevated)' }}>
          <span className="font-sans text-sm" style={{ color: 'var(--admin-text-secondary)' }}>Total Due:</span>
          <span className="font-playfair text-2xl text-gold">{service ? `RWF ${service.price.toLocaleString()}` : 'RWF 0'}</span>
        </div>

        {/* Feedback */}
        {message && (
          <div
            className="p-4 rounded-lg text-sm font-sans"
            style={{
              background: isSuccess ? 'rgba(74,222,128,0.08)' : 'rgba(248,113,113,0.08)',
              color: isSuccess ? 'var(--status-completed-text)' : 'var(--status-cancelled-text)',
              border: `1px solid ${isSuccess ? 'var(--status-completed-border)' : 'var(--status-cancelled-border)'}`,
            }}
          >
            {message}
          </div>
        )}

        <ActionButton variant="gold" loading={loading} disabled={!isFormValid}>
          Confirm Transaction
        </ActionButton>
      </form>
    </div>
  );
}
