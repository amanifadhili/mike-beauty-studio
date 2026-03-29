import { getDashboardMetrics } from '@/app/actions/admin';
import { PageHeader, StatCard, StatusBadge, DataTable } from '@/components/ui';
import Link from 'next/link';

export default async function AdminOverviewPage() {
  const result = await getDashboardMetrics();

  if (!result.success || !('metrics' in result) || !('recentActivity' in result) || !result.metrics || !result.recentActivity) {
    throw new Error(`Metrics Failure: ${'error' in result ? result.error : 'Unable to aggregate booking statistics.'}`);
  }

  const { metrics, recentActivity } = result;

  const statCards = [
    {
      label: 'New Bookings',
      value: metrics.newBookings,
      href: '/admin/bookings',
      color: 'text-amber-400',
      glow: 'before:bg-amber-400/10',
      border: 'border-amber-500/10',
      icon: (
        <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      label: 'Active Services',
      value: metrics.activeServices,
      href: '/admin/services',
      color: 'text-gold',
      glow: 'before:bg-gold/10',
      border: 'border-gold/10',
      icon: (
        <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
    },
    {
      label: 'System Status',
      value: null,
      statusText: 'Live',
      href: null,
      color: 'text-green-400',
      glow: 'before:bg-green-400/10',
      border: 'border-green-500/10',
      icon: (
        <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-12 animate-fade-in-up">

      {/* Page Header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[11px] font-sans uppercase tracking-[0.2em] text-gold/70 mb-1">Admin Dashboard</p>
          <h1 className="font-playfair text-3xl text-white">Overview</h1>
        </div>
        <p className="text-gray-600 font-sans text-xs">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statCards.map((card) => {
          const inner = (
            <div className={`relative admin-surface border ${card.border} p-6 rounded-xl overflow-hidden group transition-all duration-300 hover:border-white/10`}>
              {/* Subtle glow blob */}
              <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-60 transition-opacity group-hover:opacity-100 ${card.glow.replace('before:', '')}`} />
              
              <div className="relative">
                <div className={`flex items-center gap-2 mb-4`}>
                  <div className="p-2 bg-white/[0.04] rounded-lg">{card.icon}</div>
                  <span className="text-gray-500 text-xs font-sans uppercase tracking-widest">{card.label}</span>
                </div>
                {card.value !== null ? (
                  <p className={`font-playfair text-5xl ${card.color} leading-none`}>{card.value}</p>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <p className={`font-playfair text-2xl ${card.color}`}>{card.statusText}</p>
                  </div>
                )}
              </div>
            </div>
          );

          return card.href ? (
            <Link key={card.label} href={card.href} aria-label={`View ${card.label}`} className="block">
              {inner}
            </Link>
          ) : (
            <div key={card.label}>{inner}</div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <div>
            <h2 className="font-playfair text-lg text-white">Recent Bookings</h2>
            <p className="text-gray-600 text-xs font-sans mt-0.5">Latest 5 requests</p>
          </div>
          <Link href="/admin/bookings" className="text-xs font-sans text-gold hover:text-gold/80 transition-colors tracking-wider uppercase shrink-0">
            View All →
          </Link>
        </div>

        <DataTable
          data={recentActivity}
          columns={['Client', 'Service', 'Date', 'Status']}
          emptyStateMessage="No recent booking activity found."
          renderRow={(booking: any) => (
            <tr key={booking.id} className="hover:bg-white/[0.02] transition-colors group">
              <td className="px-6 py-4 text-white font-medium">{booking.client.name}</td>
              <td className="px-6 py-4 text-gray-400">{booking.service.name}</td>
              <td className="px-6 py-4 text-gray-500">
                {new Date(booking.preferredDate).toLocaleDateString()} · {booking.preferredTime}
              </td>
              <td className="px-6 py-4">
                <StatusBadge status={booking.status} />
              </td>
            </tr>
          )}
          renderCard={(booking: any) => (
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-white font-sans font-medium text-sm">{booking.client.name}</p>
                <StatusBadge status={booking.status} />
              </div>
              <p className="text-gray-400 font-sans text-xs">{booking.service.name}</p>
              <p className="text-gray-600 font-sans text-xs">
                {new Date(booking.preferredDate).toLocaleDateString()} · {booking.preferredTime}
              </p>
            </div>
          )}
        />
      </div>
    </div>
  );
}
