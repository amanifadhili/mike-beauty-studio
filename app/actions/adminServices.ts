'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath, revalidateTag } from 'next/cache';
import { requireAdmin } from '@/lib/auth/requireRole';
import { z } from 'zod';
import { slugify } from '@/lib/slug';

const SaveServiceSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug must be lowercase, alphanumeric, and dashes only').optional().or(z.literal('')),
  description: z.string().min(1, 'Description is required'),
  price: z.number().int().min(0, 'Price must be positive'),
  duration: z.string().min(1, 'Duration is required'),
  imageUrl: z.string().nullable().optional()
});

export async function toggleServiceStatus(serviceId: string, currentStatus: boolean) {
  try {
    await requireAdmin();
    await prisma.service.update({
      where: { id: serviceId },
      data: { active: !currentStatus },
    });
    
    revalidatePath('/admin/services');
    revalidatePath('/'); // Revalidate public homepage
    revalidatePath('/booking');  // Revalidate public booking dropdown
    // @ts-expect-error - Next 16 typing requires a second param profile
    revalidateTag('dashboard-metrics');
    
    return { success: true };
  } catch (error) {
    console.error('Failed to toggle service:', error);
    return { success: false, error: 'Operation failed.' };
  }
}

export async function saveService(rawPayload: {
  id?: string;
  name: string;
  slug?: string;
  description: string;
  price: number;
  duration: string;
  imageUrl?: string;
}) {
  try {
    await requireAdmin();
    const parsed = SaveServiceSchema.safeParse(rawPayload);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }
    const data = parsed.data;

    let serviceId = data.id;
    let finalSlug = data.slug && data.slug.trim().length > 0 ? data.slug : slugify(data.name);

    if (data.id) {
      // Update existing
      await prisma.service.update({
        where: { id: data.id },
        data: {
          name: data.name,
          slug: finalSlug,
          description: data.description,
          price: data.price,
          duration: data.duration,
        }
      });
    } else {
      // Create new
      const newService = await prisma.service.create({
        data: {
          name: data.name,
          slug: finalSlug,
          description: data.description,
          price: data.price,
          duration: data.duration,
          active: true, // Default to true on creation
        }
      });
      serviceId = newService.id;
    }

    // Handle Image Relation
    if (serviceId) {
      if (data.imageUrl && data.imageUrl.trim().length > 0) {
        const existingMedia = await prisma.media.findFirst({
          where: { serviceId: serviceId, type: 'image' }
        });
        if (existingMedia) {
          await prisma.media.update({
            where: { id: existingMedia.id },
            data: { url: data.imageUrl }
          });
        } else {
          await prisma.media.create({
            data: {
              url: data.imageUrl,
              type: 'image',
              serviceId: serviceId
            }
          });
        }
      } else {
        // If imageUrl was cleared out, delete the relation
        await prisma.media.deleteMany({
          where: { serviceId: serviceId, type: 'image' }
        });
      }
    }

    revalidatePath('/admin/services');
    revalidatePath('/');
    revalidatePath('/booking');
    // @ts-expect-error - Next 16 typing requires a second param profile
    revalidateTag('dashboard-metrics');
    
    return { success: true };
  } catch (error) {
    console.error('Failed to save service:', error);
    return { success: false, error: 'Failed to save service. Check logs.' };
  }
}

export async function deleteService(serviceId: string) {
  try {
    await requireAdmin();
    // Assuming cascading isn't blindly on for bookings (we want to keep history), 
    // it's usually safer to just 'deactivate' it. But we provide the delete method for truly orphaned records.
    await prisma.service.delete({
      where: { id: serviceId }
    });
    
    revalidatePath('/admin/services');
    revalidatePath('/');
    // @ts-expect-error - Next 16 typing requires a second param profile
    revalidateTag('dashboard-metrics');
    
    return { success: true };
  } catch (error: any) {
    console.error('Failed to delete service:', error);
    return { 
      success: false, 
      error: error.code === 'P2003' 
        ? 'Cannot delete service: There are bookings or images attached to it. Please deactivate it instead.' 
        : 'Failed to delete service.' 
    };
  }
}
