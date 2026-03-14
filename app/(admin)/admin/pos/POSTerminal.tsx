'use client';

import { useState } from 'react';
import { createPOSTransaction } from '@/actions/pos';

export default function POSTerminal({ services, workers }: { services: any[], workers: any[] }) {
  const [selectedService, setSelectedService] = useState('');
  const [selectedWorker, setSelectedWorker] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !selectedWorker || !clientName) {
      setMessage("Please fill out all required fields.");
      return;
    }

    setLoading(true);
    setMessage('');
    
    const result = await createPOSTransaction({
      serviceId: selectedService,
      workerId: selectedWorker,
      paymentMethod,
      clientName,
      clientPhone
    });

    if (result.success) {
      setMessage("Transaction completed successfully!");
      // Reset form on success
      setSelectedService('');
      setClientName('');
      setClientPhone('');
    } else {
      setMessage(`Error: ${result.error}`);
    }
    setLoading(false);
  };

  const service = services.find(s => s.id === selectedService);

  return (
    <div className="bg-white p-6 rounded-xl shadow border border-gray-100 max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Service Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Service *</label>
          <select 
            value={selectedService} 
            onChange={e => setSelectedService(e.target.value)}
            className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 disabled:opacity-50"
            disabled={loading}
          >
            <option value="">-- Select Service --</option>
            {services.map(s => (
              <option key={s.id} value={s.id}>{s.name} - RWF {s.price.toLocaleString()}</option>
            ))}
          </select>
        </div>

        {/* Worker Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Assigned Worker *</label>
          <select 
            value={selectedWorker} 
            onChange={e => setSelectedWorker(e.target.value)}
            className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 disabled:opacity-50"
            disabled={loading}
          >
            <option value="">-- Select Worker --</option>
            {workers.map(w => (
              <option key={w.id} value={w.id}>{w.user.name} ({w.roleTitle})</option>
            ))}
          </select>
        </div>

        {/* Client Details */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Client Name (Walk-In) *</label>
            <input 
              type="text" 
              value={clientName} 
              onChange={e => setClientName(e.target.value)} 
              className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 disabled:opacity-50"
              placeholder="e.g. John Doe"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone (Optional)</label>
            <input 
              type="text" 
              value={clientPhone} 
              onChange={e => setClientPhone(e.target.value)} 
              className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 disabled:opacity-50"
              placeholder="+250..."
              disabled={loading}
            />
          </div>
        </div>

        {/* Payment Methods */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method *</label>
          <div className="flex gap-4">
            {['CASH', 'MOBILE_MONEY', 'BANK_TRANSFER', 'CREDIT'].map(method => (
              <label key={method} className={`flex-1 p-3 border rounded-lg cursor-pointer text-center ${paymentMethod === method ? 'bg-black text-white' : 'bg-gray-50 hover:bg-gray-100'} ${loading ? 'opacity-50' : ''}`}>
                <input 
                  type="radio" 
                  name="payment" 
                  value={method} 
                  checked={paymentMethod === method}
                  onChange={() => setPaymentMethod(method)}
                  className="hidden"
                  disabled={loading}
                />
                {method.replace('_', ' ')}
              </label>
            ))}
          </div>
        </div>

        {/* Total Summary */}
        <div className="bg-gray-50 p-4 rounded-lg border flex justify-between items-center">
          <span className="text-gray-600 font-medium">Total Due:</span>
          <span className="text-2xl font-bold">{service ? `RWF ${service.price.toLocaleString()}` : 'RWF 0'}</span>
        </div>

        {message && (
          <div className={`p-4 rounded-lg ${message.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
            {message}
          </div>
        )}

        <button 
          type="submit" 
          disabled={loading || !selectedService || !selectedWorker || !clientName}
          className="w-full bg-black text-white p-4 rounded-lg font-bold hover:bg-gray-800 disabled:opacity-50 flex justify-center"
        >
          {loading ? 'Processing...' : 'Confirm Transaction'}
        </button>
      </form>
    </div>
  );
}
