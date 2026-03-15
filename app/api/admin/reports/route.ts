import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

/**
 * GET /api/admin/reports
 * 
 * Returns aggregated financial data:
 * - Revenue totals (today and last 30 days)
 * - Expense totals
 * - Payment method breakdown
 * - Top performing staff by revenue generated
 */
export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const period = searchParams.get('period') || '30'; // days
    const days = parseInt(period, 10);

    const periodStart = new Date();
    periodStart.setDate(periodStart.getDate() - days);
    periodStart.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Aggregate revenue for the specified period
    const [periodRevenue, todayRevenue, periodExpenses, todayExpenses, paymentBreakdown, topPerformers] = await Promise.all([
      // Period totals
      prisma.transaction.aggregate({
        where: { date: { gte: periodStart } },
        _sum: { price: true, salonShare: true, workerCommission: true },
        _count: { id: true },
      }),

      // Today totals
      prisma.transaction.aggregate({
        where: { date: { gte: today } },
        _sum: { price: true, salonShare: true },
        _count: { id: true },
      }),

      // Period expenses
      prisma.expense.aggregate({
        where: { date: { gte: periodStart } },
        _sum: { amount: true },
      }),

      // Today expenses
      prisma.expense.aggregate({
        where: { date: { gte: today } },
        _sum: { amount: true },
      }),

      // Revenue breakdown by payment method
      prisma.transaction.groupBy({
        by: ['paymentMethod'],
        where: { date: { gte: periodStart } },
        _sum: { price: true },
        _count: { id: true },
        orderBy: { _sum: { price: 'desc' } },
      }),

      // Top staff by revenue (userId on Transaction — unified User model)
      prisma.transaction.groupBy({
        by: ['userId'],
        where: { date: { gte: periodStart } },
        _sum: { price: true, workerCommission: true },
        _count: { id: true },
        orderBy: { _sum: { price: 'desc' } },
        take: 10,
      }),
    ]);

    // Enrich top performers with user names
    const userIds = topPerformers.map(t => t.userId);
    const staffUsers = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, roleTitle: true },
    });

    const enrichedTopPerformers = topPerformers.map(tp => ({
      ...tp,
      name: staffUsers.find(u => u.id === tp.userId)?.name ?? 'Unknown',
      roleTitle: staffUsers.find(u => u.id === tp.userId)?.roleTitle ?? null,
    }));

    return NextResponse.json({
      success: true,
      period: { days, start: periodStart },
      revenue: {
        period: periodRevenue._sum.price ?? 0,
        salonShare: periodRevenue._sum.salonShare ?? 0,
        workerCommissions: periodRevenue._sum.workerCommission ?? 0,
        transactionCount: periodRevenue._count.id,
        today: todayRevenue._sum.price ?? 0,
        todayTransactions: todayRevenue._count.id,
      },
      expenses: {
        period: periodExpenses._sum.amount ?? 0,
        today: todayExpenses._sum.amount ?? 0,
      },
      profit: {
        period: (periodRevenue._sum.salonShare ?? 0) - (periodExpenses._sum.amount ?? 0),
        today: (todayRevenue._sum.price ?? 0) - (todayExpenses._sum.amount ?? 0),
      },
      paymentBreakdown: paymentBreakdown.map(pm => ({
        method: pm.paymentMethod,
        total: pm._sum.price ?? 0,
        count: pm._count.id,
      })),
      topPerformers: enrichedTopPerformers,
    });

  } catch (error: any) {
    console.error('Reports API error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
