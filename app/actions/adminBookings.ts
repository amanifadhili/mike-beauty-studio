'use server';

import { BookingStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateBookingStatus(bookingId: string, newStatus: string) {
  try {
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: newStatus.toUpperCase() as BookingStatus },
    });

    // Revalidate the admin dashboard so changes reflect immediately
    revalidatePath('/admin');
    revalidatePath('/admin/bookings');

    return { success: true, booking: updatedBooking };
  } catch (error) {
    console.error('Failed to update booking status:', error);
    return { success: false, error: 'Failed to update status.' };
  }
}
