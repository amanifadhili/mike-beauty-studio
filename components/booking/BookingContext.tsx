'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface ServiceOption {
  id: string;
  name: string;
  price: number;
}

export interface BookingSettings {
  cancellationPolicy: string;
  depositAmount: number;
  momoNumber: string;
  momoName: string;
}

interface BookingContextType {
  isOpen: boolean;
  preSelectedServiceId: string | undefined;
  openBooking: (serviceId?: string) => void;
  closeBooking: () => void;
  services: ServiceOption[];
  bookingSettings: BookingSettings;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({
  children,
  services,
  bookingSettings,
}: {
  children: ReactNode;
  services: ServiceOption[];
  bookingSettings: BookingSettings;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [preSelectedServiceId, setPreSelectedServiceId] = useState<string | undefined>();

  const openBooking = (serviceId?: string) => {
    setPreSelectedServiceId(serviceId);
    setIsOpen(true);
  };

  const closeBooking = () => {
    setIsOpen(false);
    setTimeout(() => setPreSelectedServiceId(undefined), 300);
  };

  return (
    <BookingContext.Provider
      value={{ isOpen, preSelectedServiceId, openBooking, closeBooking, services, bookingSettings }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}
