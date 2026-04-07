'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth/requireRole';

export async function toggleReviewApproval(id: string, approved: boolean) {
  try {
    await requireAdmin();
    
    await prisma.review.update({
      where: { id },
      data: { approved }
    });
    
    revalidatePath('/admin/reviews');
    revalidatePath('/'); // assuming reviews might show on homepage later
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteReview(id: string) {
  try {
    await requireAdmin();
    
    await prisma.review.delete({
      where: { id }
    });
    
    revalidatePath('/admin/reviews');
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
