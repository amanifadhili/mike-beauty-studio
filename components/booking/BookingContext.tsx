'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface ServiceOption {
  id: string;
  name: string;
  price: number;
}

interface BookingContextType {
  isOpen: boolean;
  preSelectedServiceId: string | undefined;
  openBooking: (serviceId?: string) => void;
  closeBooking: () => void;
  services: ServiceOption[];
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({
  children,
  services,
}: {
  children: ReactNode;
  services: ServiceOption[];
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
      value={{ isOpen, preSelectedServiceId, openBooking, closeBooking, services }}
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
