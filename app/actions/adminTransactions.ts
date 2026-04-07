'use server';

import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth/requireRole';
import { revalidatePath } from 'next/cache';

export async function deleteTransaction(txId: string) {
  try {
    await requireAdmin();

    // Perform inside a transaction to also reverse worker commission balances
    await prisma.$transaction(async (tx) => {
      const transaction = await tx.transaction.findUnique({
        where: { id: txId }
      });

      if (!transaction) throw new Error('Transaction not found');

      // Deduct the commission from the worker's balance to reverse the transaction's payout
      if (transaction.workerCommission > 0) {
        await tx.user.update({
          where: { id: transaction.userId },
          data: { balance: { decrement: transaction.workerCommission } }
        });
      }

      await tx.transaction.delete({
        where: { id: txId }
      });
    });

    revalidatePath('/admin/transactions');
    revalidatePath('/admin/pos');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to delete transaction:', error);
    return { success: false, error: 'Failed to delete transaction.' };
  }
}

export async function updateTransaction(txId: string, paymentMethod: any) {
  try {
    await requireAdmin();
    await prisma.transaction.update({
      where: { id: txId },
      data: { paymentMethod }
    });
    revalidatePath('/admin/transactions');
    revalidatePath('/admin/pos');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to update transaction:', error);
    return { success: false, error: 'Failed to update transaction payment method.' };
  }
}
