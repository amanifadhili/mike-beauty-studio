import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { workerId } = await req.json();

    const worker = await prisma.worker.findUnique({
      where: { id: workerId },
      include: { advances: { where: { status: 'PENDING' } } }
    });

    if (!worker) return NextResponse.json({ success: false, error: 'Worker not found' }, { status: 404 });
    if (worker.balance <= 0) return NextResponse.json({ success: false, error: 'Worker has no balance to pay out' });

    const totalAdvances = worker.advances.reduce((s, a) => s + a.amount, 0);
    const deducted = Math.min(totalAdvances, worker.balance);
    const netPayout = worker.balance - deducted;

    await prisma.$transaction(async (tx) => {
      await tx.worker.update({ where: { id: workerId }, data: { balance: 0 } });
      if (deducted > 0) {
        await tx.workerAdvance.updateMany({ where: { workerId, status: 'PENDING' }, data: { status: 'DEDUCTED' } });
      }
      await tx.workerPayment.create({ data: { workerId, amount: netPayout } });
      await tx.expense.create({ data: { title: `Worker Payout: ${worker.id.slice(0, 6)}`, amount: netPayout, category: 'WORKER_PAYOUT' } });
    });

    return NextResponse.json({ success: true, netPayout });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
