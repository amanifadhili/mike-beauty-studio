'use server'

import { PrismaClient, PaymentMethod, TransactionSource, CreditStatus } from '@prisma/client';
import { calculateCommission } from '@/lib/commission-engine';

const prisma = new PrismaClient();

export async function createPOSTransaction(data: {
  serviceId: string;
  userId: string;
  paymentMethod: PaymentMethod;
  clientName: string;
  clientPhone?: string;
}) {
  try {
    // 1. Fetch Service and User details
    const service = await prisma.service.findUnique({ where: { id: data.serviceId } });
    if (!service) throw new Error("Service not found");

    const user = await prisma.user.findUnique({ where: { id: data.userId } });
    if (!user) throw new Error("Staff member not found");

    // 2. Client Management (Find or Create)
    // We enforce a phone number for distinct client tracking if provided, 
    // otherwise we create a generic client entry for this walk-in.
    let client;
    if (data.clientPhone && data.clientPhone.trim() !== '') {
      client = await prisma.client.upsert({
        where: { phone: data.clientPhone },
        update: { name: data.clientName }, // Update name in case it changed
        create: { name: data.clientName, phone: data.clientPhone }
      });
    } else {
       // If no phone, create a unique client record anyway (less ideal, but handles basic walk-ins)
       client = await prisma.client.create({
         data: {
           name: data.clientName || 'Anonymous Walk-in',
           phone: `${Date.now()}-walkin` // Guarantee highly unlikely collision for phone DB constraint
         }
       });
    }

    // 3. Calculate Commissions
    const { workerCut, salonCut } = calculateCommission(
      service.price,
      user.commissionType, 
      user.commissionRate
    );

    // 4. Execute Transaction
    const result = await prisma.$transaction(async (tx) => {
      // 4a. Log the Transaction
      const transaction = await tx.transaction.create({
        data: {
          clientId: client.id,
          serviceId: service.id,
          userId: user.id,
          price: service.price,
          workerCommission: workerCut,
          salonShare: salonCut,
          paymentMethod: data.paymentMethod,
          source: TransactionSource.WALK_IN,
        }
      });

      // 4b. Update Staff Balance
      await tx.user.update({
        where: { id: user.id },
        data: {
          balance: { increment: workerCut }
        }
      });

      // 4c. Auto-generate Client Credit IOU if payment method is CREDIT
      if (data.paymentMethod === PaymentMethod.CREDIT) {
        await tx.clientCredit.create({
          data: {
            clientId: client.id,
            transactionId: transaction.id,
            originalAmount: transaction.price,
            paidAmount: 0,
            status: CreditStatus.PENDING
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
