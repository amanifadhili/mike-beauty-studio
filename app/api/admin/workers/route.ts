import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function POST(req: Request) {
  try {
    const session = await auth();
    // In production, ensure session.user.role === 'ADMIN'
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { userId, roleTitle, commissionType, commissionRate } = body;

    if (!userId || !roleTitle || !commissionType || commissionRate === undefined) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // Verify user doesn't already have a profile
    const existing = await prisma.worker.findUnique({ where: { userId } });
    if (existing) {
      return NextResponse.json({ success: false, error: 'User already has a worker profile' }, { status: 400 });
    }

    const worker = await prisma.worker.create({
      data: {
        userId,
        roleTitle,
        commissionType,
        commissionRate: parseFloat(commissionRate.toString()),
        status: 'ACTIVE',
        balance: 0,
      },
      include: {
        user: { select: { name: true, email: true } },
      }
    });

    return NextResponse.json({ success: true, worker });

  } catch (error: any) {
    console.error('Create worker error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, roleTitle, commissionType, commissionRate, status } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Worker ID is required' }, { status: 400 });
    }

    const worker = await prisma.worker.update({
      where: { id },
      data: {
        roleTitle,
        commissionType,
        commissionRate: commissionRate !== undefined ? parseFloat(commissionRate.toString()) : undefined,
        status,
      },
      include: {
        user: { select: { name: true, email: true } },
      }
    });

    return NextResponse.json({ success: true, worker });

  } catch (error: any) {
    console.error('Update worker error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
