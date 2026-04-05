'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { StatusBadge } from '@/components/ui';

type BookingCardProps = {
  booking: {
    id: string;
    clientId: string;
    preferredDate: Date | string;
    preferredTime: string;
    notes: string | null;
    status: string;
    depositPaid: number;
    client: { name: string; phone: string };
    service: { name: string; price: number };
  };
  onClick: () => void;
  onStatusChange: (status: string) => void;
  isUpdating?: boolean;
};

export function BookingCard({ booking, onClick, onStatusChange, isUpdating }: BookingCardProps) {
  const isNew = booking.status === 'NEW';

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const phone = booking.client.phone.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${phone}`, '_blank');
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    onStatusChange(e.target.value);
  };

  return (
    <div
      onClick={onClick}
      className={`relative p-5 rounded-2xl cursor-pointer border border-white/5 bg-white/5 backdrop-blur-md transition-all hover:bg-white/10 hover:border-white/10 shadow-lg hover:shadow-xl group
        ${isUpdating ? 'opacity-50 pointer-events-none' : ''}
      `}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`transition-shadow ${isNew ? 'shadow-[0_0_12px_rgba(56,189,248,0.5)] rounded-full' : ''}`}>
          <StatusBadge status={booking.status} />
        </div>
        <span className="text-xs font-sans text-white/50">
          {new Date(booking.preferredDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · {booking.preferredTime}
        </span>
      </div>

      <div className="mb-5">
        <p className="font-medium text-white font-sans text-lg">{booking.client.name}</p>
        <p className="font-bold text-white/90 text-sm mt-1">{booking.service.name}</p>
      </div>

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
        <button
          onClick={handleWhatsApp}
          className="flex items-center gap-1.5 text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-3 py-1.5 rounded-lg hover:bg-green-500/20 transition-colors"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          Message
        </button>
        
        <div onClick={(e) => e.stopPropagation()} className="relative">
          <select
            value={booking.status}
            onChange={handleStatusChange}
            disabled={isUpdating || booking.status === 'CONVERTED'}
            className="appearance-none bg-black/40 text-white/70 text-xs px-3 py-1.5 pr-8 rounded-lg border border-white/10 focus:border-white/30 focus:outline-none transition-colors cursor-pointer hover:bg-black/60 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="NEW">New</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="CONVERTED">Convert to Sale ✨</option>
          </select>
          {/* Custom dropdown arrow */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white/40">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
