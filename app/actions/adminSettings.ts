'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth/requireRole';

// Action to save a batch of settings - this IS a Server Action (mutations only)
export async function saveSettings(category: string, formData: FormData) {
  const entries = Array.from(formData.entries());
  
  // Filter out any Next.js specific hidden inputs
  const validEntries = entries.filter(([key]) => !key.startsWith('$ACTION_'));

  try {
    await requireAdmin();
    // Run all updates in a transaction
    await prisma.$transaction(
      validEntries.map(([key, value]) => 
        prisma.appSetting.upsert({
          where: { key: key.toString() },
          update: { value: value.toString() },
          create: { 
            key: key.toString(), 
            value: value.toString(), 
            category 
          }
        })
      )
    );

    // Revalidate paths that might show these settings
    revalidatePath('/');
    revalidatePath('/contact');
    revalidatePath('/admin/settings');
    
    return { success: true };
  } catch (error) {
    console.error("Failed to save settings:", error);
    return { success: false, error: "Failed to save settings to the database." };
  }
}
