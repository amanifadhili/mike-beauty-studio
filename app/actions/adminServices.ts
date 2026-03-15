'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function toggleServiceStatus(serviceId: string, currentStatus: boolean) {
  try {
    await prisma.service.update({
      where: { id: serviceId },
      data: { active: !currentStatus },
    });
    
    revalidatePath('/admin/services');
    revalidatePath('/services'); // Revalidate public page
    revalidatePath('/booking');  // Revalidate public booking dropdown
    
    return { success: true };
  } catch (error) {
    console.error('Failed to toggle service:', error);
    return { success: false, error: 'Operation failed.' };
  }
}

export async function saveService(data: {
  id?: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  categoryId?: string | null;
  userIds?: string[];
}) {
  try {
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
    revalidatePath('/services');
    revalidatePath('/booking');
    
    return { success: true };
  } catch (error) {
    console.error('Failed to save service:', error);
    return { success: false, error: 'Failed to save service. Check logs.' };
  }
}

export async function deleteService(serviceId: string) {
  try {
    // Note: Due to foreign key constraints, you can only delete a service 
    // if it has no associated Bookings or Media, OR if you configured cascading deletes in Prisma.
    // Assuming cascading isn't blindly on for bookings (we want to keep history), 
    // it's usually safer to just 'deactivate' it. But we provide the delete method for truly orphaned records.
    await prisma.service.delete({
      where: { id: serviceId }
    });
    
    revalidatePath('/admin/services');
    revalidatePath('/services');
    
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
