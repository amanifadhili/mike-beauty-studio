'use server';

import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth/requireRole';
import { revalidatePath } from 'next/cache';

export async function deleteWorker(workerId: string) {
  try {
    await requireAdmin();

    // Check if worker has associated transactions protecting them from deletion
    const txCount = await prisma.transaction.count({
      where: { userId: workerId }
    });

    if (txCount > 0) {
      return { 
        success: false, 
        error: `Cannot delete: Worker has ${txCount} transaction(s) assigned to them. Please disable their account instead.` 
      };
    }

    await prisma.user.delete({
      where: { id: workerId }
    });

    revalidatePath('/admin/workers');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to delete worker:', error);
    return { success: false, error: 'Failed to delete worker. They may have related records preventing deletion.' };
  }
}
