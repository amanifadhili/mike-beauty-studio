'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function submitReview(formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const role = formData.get('role') as string;
    const rating = parseInt(formData.get('rating') as string, 10);
    const comment = formData.get('comment') as string;

    if (!name || !rating || !comment) {
      return { success: false, error: 'Please fill out all required fields.' };
    }

    if (rating < 1 || rating > 5) {
      return { success: false, error: 'Rating must be between 1 and 5 stars.' };
    }

    await prisma.review.create({
      data: {
        name,
        role: role || null,
        rating,
        comment,
        approved: false // Requires admin moderation to show on site
      }
    });

    revalidatePath('/review');
    return { success: true };
  } catch (error: any) {
    console.error('Review submission error:', error);
    return { success: false, error: error.message || 'An error occurred. Please try again.' };
  }
}
