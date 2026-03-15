'use server'

import { PrismaClient } from '@prisma/client';
import { calculateCommission } from '@/lib/commission-engine';

const prisma = new PrismaClient();

export async function createPOSTransaction(data: {
  serviceId: string;
  workerId: string;
  paymentMethod: string;
  clientName: string;
  clientPhone?: string;
}) {
  try {
    // 1. Fetch Service and Worker details
    const service = await prisma.service.findUnique({ where: { id: data.serviceId } });
    if (!service) throw new Error("Service not found");

    const worker = await prisma.worker.findUnique({ where: { id: data.workerId } });
    if (!worker) throw new Error("Worker not found");

    // 2. Calculate Commissions
    const { workerCut, salonCut } = calculateCommission(
      service.price,
      worker.commissionType as 'PERCENTAGE' | 'FIXED', 
      worker.commissionRate
    );

    // 3. Execute Transaction
    const result = await prisma.$transaction(async (tx) => {
      // 3a. Log the Transaction
      const transaction = await tx.transaction.create({
        data: {
          clientName: data.clientName,
          clientPhone: data.clientPhone || null,
          serviceId: service.id,
          workerId: worker.id,
          price: service.price,
          workerCommission: workerCut,
          salonShare: salonCut,
          paymentMethod: data.paymentMethod,
          source: 'WALK_IN',
        }
      });

      // 3c. Update Worker Balance
      await tx.worker.update({
        where: { id: worker.id },
        data: {
          balance: { increment: workerCut }
        }
      });

      // 3d. Auto-generate Client Credit IOU if payment method is CREDIT
      if (data.paymentMethod === 'CREDIT') {
        if (!data.clientPhone && !data.clientName) {
           throw new Error("Client name is required to extend a line of credit.");
        }
        await tx.clientCredit.create({
          data: {
            clientName: data.clientName,
            clientPhone: data.clientPhone || null,
            transactionId: transaction.id,
            originalAmount: transaction.price,
            paidAmount: 0,
            status: 'PENDING'
          }
        });
      }

      return transaction;
    });

    return { success: true, transaction: result };
  } catch (error: any) {
    console.error("POS Transaction Error:", error);
    return { success: false, error: error.message };
  }
}
