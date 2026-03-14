'use server';

import { prisma } from '@/lib/prisma';

export async function getDashboardMetrics() {
  try {
    // 1. Get total number of incoming (NEW) bookings
    const newBookingsCount = await prisma.booking.count({
      where: {
        status: 'NEW',
      },
    });

    // 2. Get total number of active services
    const activeServicesCount = await prisma.service.count({
      where: {
        active: true,
      },
    });

    // 3. Get total revenue (mocking this as a simple sum of completed prices, though in real life it might be more complex)
    // For now we'll just track total total services booked to calculate potential value
    
    // 4. Fetch the 5 most recent bookings of any status
    const recentActivity = await prisma.booking.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        service: true,
      },
    });

    return {
      success: true,
      metrics: {
        newBookings: newBookingsCount,
        activeServices: activeServicesCount,
      },
      recentActivity,
    };
  } catch (error) {
    console.error('Failed to fetch dashboard metrics:', error);
    return {
      success: false,
      error: 'Failed to load dashboard data.',
    };
  }
}
