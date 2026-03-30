'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath, revalidateTag } from 'next/cache';
import { requireAdmin } from '@/lib/auth/requireRole';
import { z } from 'zod';

const SaveServiceSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().int().min(0, 'Price must be positive'),
  duration: z.string().min(1, 'Duration is required'),
  categoryId: z.string().nullable().optional(),
  userIds: z.array(z.string()).optional()
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
  description: string;
  price: number;
  duration: string;
  categoryId?: string | null;
  userIds?: string[];
}) {
  try {
    await requireAdmin();
    const parsed = SaveServiceSchema.safeParse(rawPayload);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }
    const data = parsed.data;

    if (data.id) {
      // Update existing
      await prisma.service.update({
        where: { id: data.id },
        data: {
          name: data.name,
          description: data.description,
          price: data.price,
          duration: data.duration,
          categoryId: data.categoryId || null,
          workers: {
            set: data.userIds ? data.userIds.map(id => ({ id })) : []
          }
        }
      });
    } else {
      // Create new
      await prisma.service.create({
        data: {
          name: data.name,
          description: data.description,
          price: data.price,
          duration: data.duration,
          active: true, // Default to true on creation
          categoryId: data.categoryId || null,
          workers: {
            connect: data.userIds ? data.userIds.map(id => ({ id })) : []
          }
        }
      });
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
    // Note: Due to foreign key constraints, you can only delete a service 
    // if it has no associated Bookings or Media, OR if you configured cascading deletes in Prisma.
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
