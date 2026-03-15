'use server'

import { PrismaClient, PaymentMethod, TransactionSource, BookingStatus, CreditStatus } from '@prisma/client';
import { calculateCommission } from '@/lib/commission-engine';

const prisma = new PrismaClient();

export async function convertBookingToTransaction(data: {
  bookingId: string;
  userId: string;
  paymentMethod: PaymentMethod;
}) {
  try {
    // 1. Fetch Booking and Staff details
    const booking = await prisma.booking.findUnique({ 
      where: { id: data.bookingId },
      include: { service: true }
    });
    
    if (!booking) throw new Error("Booking not found");
    if (booking.status === BookingStatus.CONVERTED) throw new Error("Booking already converted to a transaction.");

    const user = await prisma.user.findUnique({ where: { id: data.userId } });
    if (!user) throw new Error("Staff member not found");

    // 2. Calculate Final Price (- Deposit)
    // The transaction theoretically records the gross revenue (service.price). 
    // However, if a deposit was already paid, they only owe the remainder. We record the full price in the ledger, 
    // but the actual amount collected at checkout handles the remaining balance.
    // For simplicity, Transaction records the full gross service.price.

    // 3. Calculate Commissions
    const { workerCut, salonCut } = calculateCommission(
      booking.service.price,
      user.commissionType, 
      user.commissionRate
    );

    // 4. Execute Transaction
    const result = await prisma.$transaction(async (tx) => {
      // 4a. Update Booking Status
      await tx.booking.update({
        where: { id: booking.id },
        data: { status: BookingStatus.CONVERTED }
      });

      // 4b. Log the Transaction (Gross amount)
      const transaction = await tx.transaction.create({
        data: {
          clientId: booking.clientId,
          serviceId: booking.service.id,
          userId: user.id,
          bookingId: booking.id, // Explicit linking
          price: booking.service.price,
          workerCommission: workerCut,
          salonShare: salonCut,
          paymentMethod: data.paymentMethod,
          source: TransactionSource.BOOKING,
        }
      });

      // 4c. Update Staff Balance
      await tx.user.update({
        where: { id: user.id },
        data: {
          balance: { increment: workerCut }
        }
      });

      // 4d. Auto-generate Client Credit IOU if payment method is CREDIT
      // (amount is full price minus the deposit already paid)
      if (data.paymentMethod === PaymentMethod.CREDIT) {
        const owedAmount = booking.service.price - booking.depositPaid;
        if (owedAmount > 0) {
          await tx.clientCredit.create({
            data: {
              clientId: booking.clientId,
              transactionId: transaction.id,
              originalAmount: owedAmount,
              paidAmount: 0,
              status: CreditStatus.PENDING
            }
          });
        }
      }

      return transaction;
    });

    return { success: true, transaction: result };
  } catch (error: any) {
    console.error("Booking Conversion Error:", error);
    return { success: false, error: error.message };
  }
}
