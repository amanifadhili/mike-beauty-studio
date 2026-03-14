'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function addGalleryMedia(data: {
  url: string;
  type: string; // 'image' or 'video'
  category: string;
  serviceId?: string;
}) {
  try {
    const newMedia = await prisma.media.create({
      data: {
        url: data.url,
        type: data.type,
        category: data.category,
        serviceId: data.serviceId || null,
      }
    });

    revalidatePath('/admin/gallery');
    revalidatePath('/gallery'); // Revalidate the public gallery page
    return { success: true, media: newMedia };
  } catch (error) {
    console.error('Failed to add gallery media:', error);
    return { success: false, error: 'Failed to add media.' };
  }
}

export async function deleteGalleryMedia(mediaId: string) {
  try {
    await prisma.media.delete({
      where: { id: mediaId }
    });

    revalidatePath('/admin/gallery');
    revalidatePath('/gallery');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete gallery media:', error);
    return { success: false, error: 'Failed to truncate media.' };
  }
}
