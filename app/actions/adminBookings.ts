'use server';

import { BookingStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { revalidatePath, revalidateTag } from 'next/cache';
import { requireAdmin } from '@/lib/auth/requireRole';
import { UpdateBookingStatusSchema } from '@/lib/validations/booking';

export async function updateBookingStatus(bookingId: string, newStatus: string) {
  try {
    await requireAdmin();
    const parsed = UpdateBookingStatusSchema.safeParse({ status: newStatus.toUpperCase() });
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: parsed.data.status },
    });

    // Revalidate the admin dashboard so changes reflect immediately
    revalidatePath('/admin');
    revalidatePath('/admin/bookings');
    // @ts-expect-error - Next 16 typing requires a second param profile
    revalidateTag('dashboard-metrics');

    return { success: true, booking: updatedBooking };
  } catch (error) {
    console.error('Failed to update booking status:', error);
    return { success: false, error: 'Failed to update status.' };
  }
}
