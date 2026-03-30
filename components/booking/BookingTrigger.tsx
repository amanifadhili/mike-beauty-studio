'use client';

import { useBooking } from './BookingContext';
import React from 'react';

interface BookingTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  serviceId?: string;
  className?: string;
}

export function BookingTrigger({ children, serviceId, className, ...props }: BookingTriggerProps) {
  const { openBooking } = useBooking();
  return (
    <button onClick={() => openBooking(serviceId)} className={className} {...props}>
      {children}
    </button>
  );
}
