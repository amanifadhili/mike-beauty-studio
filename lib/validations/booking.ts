import { z } from 'zod';
import { BookingStatus } from '@prisma/client';

export const CreateBookingSchema = z.object({
  clientId: z.string().uuid('Invalid client ID'),
  preferredDate: z.string().or(z.date()),
  preferredTime: z.string().min(1, 'Time is required'),
  depositPaid: z.number().int().min(0).default(0),
  notes: z.string().optional(),
  serviceId: z.string().uuid('Invalid service ID'),
});

export const UpdateBookingStatusSchema = z.object({
  status: z.nativeEnum(BookingStatus, { message: 'Invalid booking status' }),
});
