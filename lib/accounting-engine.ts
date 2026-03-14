import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Executes a worker payout.
 * Automatically clears their balance, deducts pending advances,
 * creates a WorkerPayment record, and logs an Expense for the salon.
 */
export async function executeWorkerPayout(
  workerId: string,
  adminUserId: string
) {
  return await prisma.$transaction(async (tx) => {
    // 1. Fetch worker and their pending advances
    const worker = await tx.worker.findUnique({
      where: { id: workerId },
      include: {
        advances: {
          where: { status: 'PENDING' }
        }
      }
    });

    if (!worker) {
      throw new Error(`Worker with ID ${workerId} not found.`);
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

    // 3. Update worker balance to 0 (since we are paying out whatever they have)
    // If they owed more in advances than they earned, technically the balance is zeroed,
    // and the remaining advance amount should ideally stay 'PENDING' if partially paid, 
    // but for simplicity in v1, we assume advances are smaller than entire balance.
    await tx.worker.update({
      where: { id: workerId },
      data: { balance: 0 }
    });

    // 4. Mark all fully paid advances as DEDUCTED
    // Simple logic: if netPayout >= 0, all pending advances were covered
    if (totalAdvances <= worker.balance) {
      await tx.workerAdvance.updateMany({
        where: { workerId: workerId, status: 'PENDING' },
        data: { status: 'DEDUCTED' }
      });
    }

    // 5. Create WorkerPayment record
    const payment = await tx.workerPayment.create({
      data: {
        workerId: workerId,
        amount: netPayout,
      }
    });

    // 6. Log as a business Expense
    await tx.expense.create({
      data: {
        title: `Payout: ${worker.roleTitle} ${workerId.slice(0, 5)}`, 
        amount: netPayout,
        category: 'WORKER_PAYOUT',
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
          net_paid: netPayout
        })
      }
    });

    return {
      success: true,
      grossBalance: worker.balance,
      advancesDeducted: deductionAmount,
      netPayout: netPayout,
    };
  });
}
