import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { CreditStatus, Role } from '@prisma/client';

// GET all Client Credits (Ledger)
export async function GET(request: Request) {
  try {
    const session = await auth();
    // Allow either the Admin or Staff to view the ledger
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let whereClause = {};
    if (status && (status === CreditStatus.PENDING || status === CreditStatus.CLEARED)) {
      whereClause = { status: status as CreditStatus };
    }

    const credits = await prisma.clientCredit.findMany({
      where: whereClause,
      include: {
        client: {
          select: { name: true, phone: true } // Fetching the normalized Client Table native relation
        },
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
    console.error("Client Credit GET Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT (Repay a Credit)
export async function PUT(request: Request) {
  try {
    const session = await auth();
    // Allow Admins to manage debts
    if (!session || !session.user?.email || (session.user as any)?.role !== Role.ADMIN) {
      return NextResponse.json({ error: 'Unauthorized. Admins only.' }, { status: 401 });
    }

    let adminUserId = (session.user as any).id;
    if (!adminUserId) {
      const dbUser = await prisma.user.findUnique({ where: { email: session.user.email } });
      if (!dbUser) return NextResponse.json({ success: false, error: 'Admin user not found' }, { status: 401 });
      adminUserId = dbUser.id;
    }

    const body = await request.json();
    const { id, amount } = body;

    if (!id || !amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid repayment payload' }, { status: 400 });
    }

    // 1. Fetch the credit and its explicit Client identity
    const credit = await prisma.clientCredit.findUnique({
      where: { id },
      include: { transaction: true, client: true },
    });

    if (!credit) return NextResponse.json({ error: 'Credit record not found' }, { status: 404 });
    if (credit.status === CreditStatus.CLEARED) return NextResponse.json({ error: 'This credit is already cleared' }, { status: 400 });

    // 2. Calculate new totals
    const newPaidAmount = credit.paidAmount + amount;
    const newStatus = newPaidAmount >= credit.originalAmount ? CreditStatus.CLEARED : CreditStatus.PENDING;

    // 3. Perform the update and log the audit
    const updated = await prisma.$transaction(async (tx) => {
      const updatedCredit = await tx.clientCredit.update({
        where: { id },
        data: {
          paidAmount: newPaidAmount,
          status: newStatus,
        }
      });

      await tx.auditLog.create({
        data: {
          userId: adminUserId,
          action: 'DEBT_COLLECTION',
          targetType: 'CLIENT_CREDIT',
          targetId: credit.id,
          details: `Client ${credit.client.name} repaid RWF ${amount}. Total paid: ${newPaidAmount}/${credit.originalAmount}. Status: ${newStatus}`,
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
