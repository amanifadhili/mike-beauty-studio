/**
 * A plain server-side helper (NOT a Server Action) to fetch the global
 * App Settings from the database. This can be safely called from
 * async Server Components during SSR and build time.
 * 
 * It falls back gracefully if the DB has no values yet (e.g., first deploy).
 */

import { prisma } from '@/lib/prisma';

export async function getSettings(): Promise<Record<string, string>> {
  try {
    const settings = await prisma.appSetting.findMany();
    const settingsMap: Record<string, string> = {};
    for (const s of settings) {
      settingsMap[s.key] = s.value;
    }
    return settingsMap;
  } catch (error) {
    // Don't crash the page if DB isn't available during build / prerender
    console.warn('[getSettings] Could not fetch settings from DB:', error);
    return {};
  }
}
