import { NextRequest, NextResponse } from 'next/server';
import { executeWorkerPayout } from '@/lib/accounting-engine';
import { auth } from '@/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    let adminUserId = session.user.id;
    if (!adminUserId) {
      // Import prisma just for this fallback
      const { prisma } = await import('@/lib/prisma');
      const dbUser = await prisma.user.findUnique({ where: { email: session.user.email } });
      if (!dbUser) return NextResponse.json({ success: false, error: 'Admin user not found in DB' }, { status: 401 });
      adminUserId = dbUser.id;
    }

    // "workerId" from frontend is actually the `userId` now.
    const { workerId } = await req.json();

    if (!workerId) {
       return NextResponse.json({ success: false, error: 'User ID required for payout' }, { status: 400 });
    }

    const result = await executeWorkerPayout(workerId, adminUserId);

    return NextResponse.json(result);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
