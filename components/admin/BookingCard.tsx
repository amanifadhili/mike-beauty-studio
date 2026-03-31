'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MessageCircle } from 'lucide-react';
import { StatusBadge } from '@/components/ui'; // check if this export exists, or assume standard

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
};

export function BookingCard({ booking, onClick }: BookingCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: booking.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isNew = booking.status === 'NEW';

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const phone = booking.client.phone.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${phone}`, '_blank');
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={`relative p-4 rounded-xl cursor-grab active:cursor-grabbing border border-white/5 bg-white/5 backdrop-blur-md mb-3 transition-colors hover:bg-white/10 ${
        isDragging ? 'opacity-50 ring-2 ring-emerald-400 z-50' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className={`transition-shadow ${isNew ? 'shadow-[0_0_12px_rgba(56,189,248,0.5)] rounded-full' : ''}`}>
          <StatusBadge status={booking.status} />
        </div>
        <span className="text-xs font-sans text-white/50">
          {new Date(booking.preferredDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · {booking.preferredTime}
        </span>
      </div>

      <div className="mb-3">
        <p className="font-medium text-white font-sans">{booking.client.name}</p>
        <p className="font-bold text-white/90 text-sm mt-1">{booking.service.name}</p>
      </div>

      <div className="flex items-center justify-between mt-4">
        <button
          onClick={handleWhatsApp}
          className="flex items-center gap-1.5 text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-2.5 py-1.5 rounded-md hover:bg-green-500/20 transition-colors"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          Message
        </button>
        <span className="text-xs text-white/40 font-mono">
          {booking.client.phone}
        </span>
      </div>
    </div>
  );
}
