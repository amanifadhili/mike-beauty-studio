'use server'

import { PrismaClient } from '@prisma/client';
import { calculateCommission } from '@/lib/commission-engine';

const prisma = new PrismaClient();

export async function convertBookingToTransaction(data: {
  bookingId: string;
  workerId: string;
  paymentMethod: string;
}) {
  try {
    // 1. Fetch Booking and Worker details
    const booking = await prisma.booking.findUnique({ 
      where: { id: data.bookingId },
      include: { service: true }
    });
    
    if (!booking) throw new Error("Booking not found");
    if (booking.status === 'CONVERTED') throw new Error("Booking already converted to a transaction.");

    const worker = await prisma.worker.findUnique({ where: { id: data.workerId } });
    if (!worker) throw new Error("Worker not found");

    // 2. Calculate Commissions
    const { workerCut, salonCut } = calculateCommission(
      booking.service.price,
      worker.commissionType as 'PERCENTAGE' | 'FIXED', 
      worker.commissionRate
    );

    // 3. Execute Transaction
    const result = await prisma.$transaction(async (tx) => {
      // 3a. Update Booking Status
      await tx.booking.update({
        where: { id: booking.id },
        data: { status: 'CONVERTED' }
      });

      // 3b. Log the Transaction
      const transaction = await tx.transaction.create({
        data: {
          clientName: booking.name,
          clientPhone: booking.phone || null,
          serviceId: booking.service.id,
          workerId: worker.id,
          bookingId: booking.id, // Explicit linking
          price: booking.service.price,
          workerCommission: workerCut,
          salonShare: salonCut,
          paymentMethod: data.paymentMethod,
          source: 'BOOKING',
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
        await tx.clientCredit.create({
          data: {
            clientName: booking.name,
            clientPhone: booking.phone || null,
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
    console.error("Booking Conversion Error:", error);
    return { success: false, error: error.message };
  }
}
