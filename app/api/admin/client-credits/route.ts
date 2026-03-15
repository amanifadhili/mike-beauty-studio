import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// GET all Client Credits (Ledger)
export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session || (session.user as any)?.role !== 'MANAGER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    // @ts-ignore - Prisma types lagging compiler
    const credits = await prisma.clientCredit.findMany({
      where: status ? { status } : undefined,
      include: {
        transaction: {
          include: {
            service: { select: { name: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, credits });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT (Repay a Credit)
export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session || (session.user as any)?.role !== 'MANAGER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, amount } = body;

    if (!id || !amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid repayment payload' }, { status: 400 });
    }

    // 1. Fetch the credit
    // @ts-ignore
    const credit = await prisma.clientCredit.findUnique({
      where: { id },
      include: { transaction: true },
    });

    if (!credit) return NextResponse.json({ error: 'Credit record not found' }, { status: 404 });
    if (credit.status === 'CLEARED') return NextResponse.json({ error: 'This credit is already cleared' }, { status: 400 });

    // 2. Calculate new totals
    const newPaidAmount = credit.paidAmount + amount;
    const newStatus = newPaidAmount >= credit.originalAmount ? 'CLEARED' : 'PENDING';

    // 3. Perform the update and log the audit
    const updated = await prisma.$transaction(async (tx) => {
      // @ts-ignore
      const updatedCredit = await tx.clientCredit.update({
        where: { id },
        data: {
          paidAmount: newPaidAmount,
          status: newStatus,
        }
      });

      // @ts-ignore
      await tx.auditLog.create({
        data: {
          action: 'DEBT_COLLECTION',
          targetType: 'CLIENT_CREDIT',
          targetId: credit.id,
          details: `Client ${credit.clientName} repaid RWF ${amount}. Total paid: ${newPaidAmount}/${credit.originalAmount}. Status: ${newStatus}`,
          userId: session.user?.id || 'unknown',
        }
      });

      return updatedCredit;
    });

    return NextResponse.json({ success: true, credit: updated });
  } catch (error: any) {
    console.error('Repayment error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
