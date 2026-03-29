import { auth } from '@/auth';
import { Role } from '@prisma/client';

/**
 * Throws an error if the current session is not an Admin.
 * Use this to abruptly halt unauthorized server actions.
 */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== Role.ADMIN) {
    throw new Error('Unauthorized: Admin access required.');
  }
  return session.user;
}

/**
 * Returns false if the current session is not an Admin.
 * Use this for graceful handling in server actions (e.g. returning { success: false }).
 */
export async function checkIsAdmin() {
  const session = await auth();
  return session?.user?.role === Role.ADMIN;
}
