'use server';

import { prisma } from '@/lib/prisma';
import { BookingStatus } from '@prisma/client';
import { requireAdmin } from '@/lib/auth/requireRole';
import { unstable_cache } from 'next/cache';

const getCachedMetrics = unstable_cache(
  async () => {
    const newBookingsCount = await prisma.booking.count({
      where: {
        status: BookingStatus.NEW,
      },
    });

    const activeServicesCount = await prisma.service.count({
      where: {
        active: true,
      },
    });

    const recentActivity = await prisma.booking.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        client: { select: { name: true } },
        service: true,
      },
    });

    return {
      metrics: {
        newBookings: newBookingsCount,
        activeServices: activeServicesCount,
      },
      recentActivity,
    };
  },
  ['dashboard-metrics-key'],
  {
    revalidate: 60,
    tags: ['dashboard-metrics'],
  }
);

export async function getDashboardMetrics() {
  try {
    await requireAdmin();
    const data = await getCachedMetrics();

    return {
      success: true,
      ...data,
    };
  } catch (error) {
    console.error('Failed to fetch dashboard metrics:', error);
    return {
      success: false,
      error: 'Failed to load dashboard data.',
    };
  }
}
