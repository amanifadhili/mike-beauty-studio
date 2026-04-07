import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { title, amount, category } = await req.json();

    if (!id || !title || !amount || !category) {
      return NextResponse.json({ success: false, error: 'Missing fields' }, { status: 400 });
    }

    const expense = await prisma.expense.update({
      where: { id },
      data: { title, amount: Number(amount), category: category.toUpperCase() }
    });

    return NextResponse.json({ success: true, expense });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing id' }, { status: 400 });
    }

    const expense = await prisma.expense.findUnique({
      where: { id },
      include: { payments: true }
    });

    if (!expense) {
      return NextResponse.json({ success: false, error: 'Expense not found.' }, { status: 404 });
    }

    /* -------------------------------------------------------------------------- */
    /* PAYOUT REVERSAL ALGORITHM                                                  */
    /* If this expense is a staff payout, we must refund the staff member first   */
    /* -------------------------------------------------------------------------- */
    if (expense.category === 'WORKER_PAYOUT' && expense.payments.length > 0) {
      const payment = expense.payments[0];
      const session = await auth();
      let adminId = session?.user?.id;
      
      if (!adminId && session?.user?.email) {
        const admin = await prisma.user.findUnique({ where: { email: session.user.email } });
        adminId = admin?.id;
      }

      await prisma.$transaction(async (tx) => {
        // 1. Refund Worker Balance
        await tx.user.update({
          where: { id: payment.userId },
          data: { balance: { increment: payment.amount } }
        });

        // 2. Delete the payment link
        await tx.workerPayment.delete({
          where: { id: payment.id }
        });

        // 3. Delete the parent expense
        await tx.expense.delete({
          where: { id }
        });

        // 4. Audit Log
        if (adminId) {
          await tx.auditLog.create({
            data: {
              userId: adminId,
              action: 'REVERSE_PAYOUT',
              targetId: payment.userId,
              targetType: 'User',
              details: JSON.stringify({ reversed_amount: payment.amount, deleted_expense: id })
            }
          });
        }
      });

      return NextResponse.json({ success: true, message: 'Payout safely reversed. Worker balance refunded.' });
    }

    /* -------------------------------------------------------------------------- */
    /* STANDARD EXPENSE DELETION                                                  */
    /* -------------------------------------------------------------------------- */
    await prisma.expense.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    if (err.code === 'P2003') {
      return NextResponse.json({ 
        success: false, 
        error: 'Cannot delete this expense because it is permanently tied to an existing staff payout record. To fix this, delete the staff payout first.' 
      }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
