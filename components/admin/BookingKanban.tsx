'use client';

import React, { useState, useTransition, useOptimistic } from 'react';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  useDroppable,
} from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { PaymentMethod } from '@prisma/client';
import { updateBookingStatus } from '@/app/actions/adminBookings';
import { convertBookingToTransaction } from '@/actions/bookings';
import { ActionButton } from '@/components/ui';
import { BookingCard } from './BookingCard';
import { BookingDrawer } from './BookingDrawer';

const COLUMNS = [
  { id: 'NEW', title: 'NEW' },
  { id: 'CONFIRMED', title: 'CONFIRMED' },
  { id: 'COMPLETED', title: 'COMPLETED' },
];

function DroppableColumn({ col, colBookings, setSelectedBookingId }: { col: any; colBookings: any[]; setSelectedBookingId: (id: string) => void }) {
  const { setNodeRef } = useDroppable({
    id: col.id,
  });

  return (
    <div className="flex flex-col flex-1 min-w-[320px] max-w-[400px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-sans text-xs uppercase tracking-widest text-white/50">{col.title}</h3>
        <span className="text-xs font-mono text-white/40 bg-white/5 py-0.5 px-2 rounded-full">
          {colBookings.length}
        </span>
      </div>
      
      <div ref={setNodeRef} className="flex-1 rounded-2xl bg-[#111] border border-white/5 p-3 overflow-y-auto">
        <SortableContext id={col.id} items={colBookings.map((b) => b.id)} strategy={verticalListSortingStrategy}>
          <div className="min-h-[200px]">
            {colBookings.map((b) => (
              <BookingCard key={b.id} booking={b} onClick={() => setSelectedBookingId(b.id)} />
            ))}
            {colBookings.length === 0 && (
              <div className="h-full flex items-center justify-center text-xs text-white/20 italic font-sans py-10 border border-dashed border-white/5 rounded-xl">
                Drop here
              </div>
            )}
          </div>
        </SortableContext>
      </div>
    </div>
  );
}

export function BookingKanban({ initialBookings, staff = [] }: { initialBookings: any[]; staff?: any[] }) {
  const [bookings, setBookings] = useState(initialBookings);
  const [isPending, startTransition] = useTransition();

  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  
  // Conversion state
  const [convertingBooking, setConvertingBooking] = useState<any | null>(null);
  const [selectedWorker, setSelectedWorker] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [converting, setConverting] = useState(false);

  // Optimistic updates for snappy UI
  const [optimisticBookings, addOptimisticBooking] = useOptimistic(
    bookings,
    (state, updatedBooking: { id: string; status: string }) =>
      state.map((b) => (b.id === updatedBooking.id ? { ...b, status: updatedBooking.status } : b))
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const activeBooking = optimisticBookings.find((b) => b.id === activeId);
  const selectedBooking = optimisticBookings.find((b) => b.id === selectedBookingId);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;
    
    // Sortable items return the item ID. But if dropped on an empty column, the over.id is the column ID.
    // Determine the new status based on what was dropped over.
    let newStatus = over.id as string;
    
    // If dropped on another card, get that card's status
    const overSrt = optimisticBookings.find(b => b.id === newStatus);
    if (overSrt) {
      newStatus = overSrt.status;
    }

    // Only NEW, CONFIRMED, COMPLETED columns are supported for drag and drop
    if (!['NEW', 'CONFIRMED', 'COMPLETED'].includes(newStatus)) return;

    const activeItem = optimisticBookings.find(b => b.id === active.id);
    if (!activeItem || activeItem.status === newStatus) return;

    // Optimistically update
    startTransition(() => {
      addOptimisticBooking({ id: activeItem.id, status: newStatus });
    });

    // Actually update DB
    const res = await updateBookingStatus(activeItem.id, newStatus);
    if (res.success) {
      setBookings((prev) => prev.map((b) => (b.id === activeItem.id ? { ...b, status: newStatus } : b)));
    } else {
      // Revert if failed (optimistic state will reset when server state finishes)
      alert('Failed to update status');
    }
  };

  const handleConvertSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!convertingBooking || !selectedWorker) return;
    const target = convertingBooking;
    setConverting(true);
    
    const result = await convertBookingToTransaction({
      bookingId: target.id,
      userId: selectedWorker,
      paymentMethod: paymentMethod as PaymentMethod
    });
    
    if (result.success) {
      setBookings((prev) => prev.map((b) => (b.id === target.id ? { ...b, status: 'CONVERTED' } : b)));
      setConvertingBooking(null);
      setSelectedBookingId(null);
    } else {
      alert(`Conversion failed: ${result.error}`);
    }
    setConverting(false);
  };

  return (
    <div className="flex flex-col h-full animate-fade-in-up">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-1 overflow-x-auto gap-6 pb-4">
          {COLUMNS.map((col) => {
            const colBookings = optimisticBookings.filter((b) => b.status === col.id);
            return (
              <DroppableColumn 
                key={col.id} 
                col={col} 
                colBookings={colBookings} 
                setSelectedBookingId={setSelectedBookingId} 
              />
            );
          })}
        </div>
        
        <DragOverlay>
          {activeBooking ? <BookingCard booking={activeBooking} onClick={() => {}} /> : null}
        </DragOverlay>
      </DndContext>

      {/* Slide-over Drawer for Details */}
      <BookingDrawer
        booking={selectedBooking}
        onClose={() => setSelectedBookingId(null)}
        onConvert={(b) => setConvertingBooking(b)}
      />

       {/* Convert to Transaction Modal (reused from earlier logic) */}
       {convertingBooking && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setConvertingBooking(null)}>
          <div className="admin-card p-6 w-full max-w-md animate-fade-in-up bg-[#1a1a1a] border border-white/10" onClick={e => e.stopPropagation()}>
            <h2 className="font-playfair text-xl mb-2 text-white">Convert to Transaction</h2>
            <p className="text-sm mb-6 font-sans text-white/60">
              Convert <strong className="text-white">{convertingBooking.client.name}</strong>'s appointment into a finalized revenue record.
            </p>
            <form onSubmit={handleConvertSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-sans uppercase tracking-wider mb-1.5 text-white/40">Assign Worker</label>
                <select value={selectedWorker} onChange={e => setSelectedWorker(e.target.value)} className="admin-select w-full" required>
                  <option value="">-- Choose Staff --</option>
                  {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-sans uppercase tracking-wider mb-1.5 text-white/40">Payment Method</label>
                <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className="admin-select w-full">
                  <option value="CASH">Cash</option>
                  <option value="MOBILE_MONEY">Mobile Money</option>
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                  <option value="CREDIT">Client Credit</option>
                </select>
              </div>
              <div className="flex justify-between items-center p-4 rounded-lg bg-white/5 border border-white/10">
                <p className="text-xs font-sans text-white/60">Revenue to Log</p>
                <div className="text-right">
                  <p className="font-playfair text-2xl text-gold">{(convertingBooking.service.price - convertingBooking.depositPaid).toLocaleString()} RWF</p>
                  {convertingBooking.depositPaid > 0 && (
                     <p className="text-xs text-white/40 font-sans">(-{convertingBooking.depositPaid} Deposit)</p>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setConvertingBooking(null)} className="px-4 py-2 text-sm font-sans text-white/60 hover:text-white transition-colors">Cancel</button>
                <ActionButton type="submit" variant="gold" loading={converting} loadingText="Converting..." disabled={!selectedWorker} className="w-auto px-6">
                  Finalize Sale
                </ActionButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
