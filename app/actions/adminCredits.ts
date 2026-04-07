'use server';

import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth/requireRole';
import { revalidatePath } from 'next/cache';

export async function deleteClientCredit(creditId: string) {
  try {
    await requireAdmin();

    await prisma.clientCredit.delete({
      where: { id: creditId }
    });

    revalidatePath('/admin/client-credits');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to delete client credit:', error);
    return { success: false, error: 'Failed to delete client credit record.' };
  }
}

export async function updateClientCredit(creditId: string, originalAmount: number) {
  try {
    await requireAdmin();

    await prisma.clientCredit.update({
      where: { id: creditId },
      data: { originalAmount }
    });

    revalidatePath('/admin/client-credits');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to update client credit:', error);
    return { success: false, error: 'Failed to update credit record.' };
  }
}

