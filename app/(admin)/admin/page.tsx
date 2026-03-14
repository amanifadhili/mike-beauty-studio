import { getDashboardMetrics } from '@/app/actions/admin';
import { SectionHeading } from '@/components/ui/SectionHeading';

export default async function AdminOverviewPage() {
  const result = await getDashboardMetrics();

  if (!result.success || !result.metrics) {
    return (
      <div className="text-red-400 p-8">
        Failed to load dashboard metrics. {result.error}
      </div>
    );
  }

  const { metrics, recentActivity } = result;

  return (
    <div className="space-y-12 animate-fade-in-up">
      <SectionHeading 
        title="Dashboard Overview"
        subtitle="Current vital statistics and recent booking activity."
      />

      {/* Top Level Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-[#1a1a1a] border border-white/5 p-8 flex flex-col gap-4">
          <span className="font-sans text-gray-400 text-sm tracking-wider uppercase">New Booking Requests</span>
          <span className="font-playfair text-5xl text-gold">{metrics.newBookings}</span>
        </div>

        <div className="bg-[#1a1a1a] border border-white/5 p-8 flex flex-col gap-4">
          <span className="font-sans text-gray-400 text-sm tracking-wider uppercase">Active Services</span>
          <span className="font-playfair text-5xl text-white">{metrics.activeServices}</span>
        </div>

        <div className="bg-[#1a1a1a] border border-white/5 p-8 flex flex-col gap-4">
          <span className="font-sans text-gray-400 text-sm tracking-wider uppercase">Platform Status</span>
          <span className="font-playfair text-xl text-green-400 mt-auto">Online & Running</span>
        </div>

      </div>

      {/* Recent Activity Table View */}
      <div className="bg-[#1a1a1a] border border-white/5 mt-12">
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <h3 className="font-playfair text-xl text-white">Recent Activity</h3>
          <span className="text-xs uppercase tracking-widest text-gold font-sans">Latest 5</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full font-sans text-sm text-left">
            <thead className="text-xs text-gray-400 uppercase bg-[#222222]">
              <tr>
                <th scope="col" className="px-6 py-4">Client Name</th>
                <th scope="col" className="px-6 py-4">Service</th>
                <th scope="col" className="px-6 py-4">Requested Date</th>
                <th scope="col" className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentActivity && recentActivity.length > 0 ? (
                recentActivity.map((booking) => (
                  <tr key={booking.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">
                      {booking.name}
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {booking.service.name}
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {new Date(booking.preferredDate).toLocaleDateString()} @ {booking.preferredTime}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs uppercase tracking-widest rounded-full border ${
                        booking.status === 'NEW' ? 'border-amber-500/50 text-amber-500 bg-amber-500/10' :
                        booking.status === 'COMPLETED' ? 'border-green-500/50 text-green-500 bg-green-500/10' :
                        'border-blue-500/50 text-blue-500 bg-blue-500/10'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    No recent booking activity found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
