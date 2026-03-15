import { NextRequest, NextResponse } from 'next/server';
import { executeWorkerPayout } from '@/lib/accounting-engine';
import { auth } from '@/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // "workerId" from frontend is actually the `userId` now.
    const { workerId } = await req.json();

    if (!workerId) {
       return NextResponse.json({ success: false, error: 'User ID required for payout' }, { status: 400 });
    }

    const result = await executeWorkerPayout(workerId, session.user.id || 'system');

    return NextResponse.json(result);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
