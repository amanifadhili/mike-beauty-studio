'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { unlink } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

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
    const media = await prisma.media.findUnique({ where: { id: mediaId } });
    
    await prisma.media.delete({ where: { id: mediaId } });

    // If the file was uploaded locally (not an external URL), delete it from disk
    if (media?.url?.startsWith('/uploads/')) {
      const filePath = path.join(process.cwd(), 'public', media.url);
      if (existsSync(filePath)) {
        await unlink(filePath);
      }
    }

    revalidatePath('/admin/gallery');
    revalidatePath('/gallery');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete gallery media:', error);
    return { success: false, error: 'Failed to delete media.' };
  }
}
