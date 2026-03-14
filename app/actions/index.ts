'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// SERVICES
export async function getServices() {
  try {
    return await prisma.service.findMany({
      where: { active: true },
      include: { medias: true }
    });
  } catch (error) {
    console.error('Failed to fetch services:', error);
    return [];
  }
}

export async function getServiceById(id: string) {
  try {
    return await prisma.service.findUnique({
      where: { id },
      include: { medias: true }
    });
  } catch (error) {
    console.error(`Failed to fetch service ${id}:`, error);
    return null;
  }
}

// BOOKINGS
export async function createBooking(data: {
  name: string;
  phone: string;
  preferredDate: Date;
  preferredTime: string;
  notes?: string;
  serviceId: string;
}) {
  try {
    const booking = await prisma.booking.create({
      data: {
        name: data.name,
        phone: data.phone,
        preferredDate: data.preferredDate,
        preferredTime: data.preferredTime,
        notes: data.notes,
        serviceId: data.serviceId,
        status: 'NEW'
      }
    });
    
    // Revalidate admin paths if they exist
    revalidatePath('/admin/bookings');
    
    return { success: true, booking };
  } catch (error) {
    console.error('Failed to create booking:', error);
    return { success: false, error: 'Failed to create booking request. Please try again or contact us directly on WhatsApp.' };
  }
}
