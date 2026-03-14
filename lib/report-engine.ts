import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getDashboardFinancials() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Today's Revenue (from Transactions)
  const todayTransactions = await prisma.transaction.aggregate({
    where: {
      date: { gte: today }
    },
    _sum: {
      price: true,
      salonShare: true,
      workerCommission: true,
    }
  });

  // Today's Expenses
  const todayExpenses = await prisma.expense.aggregate({
    where: {
      date: { gte: today }
    },
    _sum: {
      amount: true
    }
  });

  const revenue = todayTransactions._sum.price || 0;
  const netProfit = (todayTransactions._sum.salonShare || 0) - (todayExpenses._sum.amount || 0);
  
  return {
    revenue,
    expenses: todayExpenses._sum.amount || 0,
    workerCommissionsUnpaid: todayTransactions._sum.workerCommission || 0,
    netProfit
  };
}
