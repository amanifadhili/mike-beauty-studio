import { PrismaClient, AdvanceStatus, ExpenseCategory } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Executes a worker payout.
 * Automatically clears their balance, deducts pending advances,
 * logs an Expense for the salon FIRST, and creates a WorkerPayment record tied strictly to that Expense.
 */
export async function executeWorkerPayout(
  userId: string,
  adminUserId: string
) {
  return await prisma.$transaction(async (tx) => {
    // 1. Fetch user (worker) and their pending advances
    const worker = await tx.user.findUnique({
      where: { id: userId },
      include: {
        advances: {
          where: { status: AdvanceStatus.PENDING }
        }
      }
    });

    if (!worker) {
      throw new Error(`Worker with ID ${userId} not found.`);
    }

    if (worker.balance <= 0) {
      throw new Error(`Worker has no positive balance to pay out.`);
    }

    // 2. Calculate deductions
    const totalAdvances = worker.advances.reduce((acc, curr) => acc + curr.amount, 0);
    
    // We can only deduct up to what they've earned
    let deductionAmount = totalAdvances;
    if (deductionAmount > worker.balance) {
      deductionAmount = worker.balance; // They still owe advance money next payout
    }

    const netPayout = worker.balance - deductionAmount;

    // 3. Update worker balance to 0
    await tx.user.update({
      where: { id: userId },
      data: { balance: 0 }
    });

    // 4. Mark all fully paid advances as DEDUCTED
    if (totalAdvances <= worker.balance) {
      await tx.workerAdvance.updateMany({
        where: { userId: userId, status: AdvanceStatus.PENDING },
        data: { status: AdvanceStatus.DEDUCTED }
      });
    }

    // 5. Log as a business Expense FIRST to gather ID (Orphan Prevention)
    const expense = await tx.expense.create({
      data: {
        title: `Payout: ${worker.roleTitle || 'Staff'} ${userId.slice(0, 5)}`, 
        amount: netPayout,
        category: ExpenseCategory.WORKER_PAYOUT,
      }
    });

    // 6. Create WorkerPayment record strictly tied to Expense
    const payment = await tx.workerPayment.create({
      data: {
        userId: userId,
        expenseId: expense.id,
        amount: netPayout,
      }
    });

    // 7. Audit Log
    await tx.auditLog.create({
      data: {
        userId: adminUserId,
        action: 'PAY_WORKER',
        targetId: payment.id,
        targetType: 'WorkerPayment',
        details: JSON.stringify({
          gross_balance: worker.balance,
          advances_deducted: deductionAmount,
          net_paid: netPayout,
          expense_id: expense.id
        })
      }
    });

    return {
      success: true,
      grossBalance: worker.balance,
      advancesDeducted: deductionAmount,
      netPayout: netPayout,
      expenseId: expense.id
    };
  });
}
