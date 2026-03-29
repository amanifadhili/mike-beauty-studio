import { z } from 'zod';
import { PaymentMethod, TransactionSource, ExpenseCategory } from '@prisma/client';

export const CreateTransactionSchema = z.object({
  clientId: z.string().uuid('Invalid client ID'),
  serviceId: z.string().uuid('Invalid service ID'),
  userId: z.string().uuid('Invalid user ID'),
  bookingId: z.string().uuid().optional().nullable(),
  price: z.number().int().min(0),
  workerCommission: z.number().int().min(0),
  salonShare: z.number().int().min(0),
  paymentMethod: z.nativeEnum(PaymentMethod, { message: 'Invalid payment method' }),
  source: z.nativeEnum(TransactionSource, { message: 'Invalid transaction source' }),
});

export const CreateExpenseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  amount: z.number().int().min(0, 'Amount must be positive'),
  category: z.nativeEnum(ExpenseCategory, { message: 'Invalid expense category' }),
});
