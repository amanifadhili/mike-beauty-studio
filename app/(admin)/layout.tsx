import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { auth } from '@/auth';

export const metadata = {
  title: 'Admin Dashboard | Mike Beauty Studio',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const userEmail = session?.user?.email || undefined;
  const userName = userEmail?.split('@')[0] || 'Admin';

  return (
    <div className="bg-[#0e0e0e] min-h-screen text-cream-white flex">

      {/* Fixed Sidebar — always on screen */}
      <AdminSidebar userEmail={userEmail} />

      {/* Main content — offset by sidebar width */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">

        {/* Sticky top navbar */}
        <header className="sticky top-0 z-40 h-14 bg-[#111111]/95 backdrop-blur-sm border-b border-white/[0.06] flex items-center justify-between px-6">
          {/* Left: page breadcrumb (mobile shows logo) */}
          <span className="font-playfair text-gold text-base md:hidden">Mike Admin</span>
          <span className="hidden md:flex items-center gap-2 text-gray-600 text-xs font-sans">
            <span className="text-gray-700">Studio</span>
            <span>/</span>
            <span className="text-gray-400">Dashboard</span>
          </span>

          {/* Right: user info + status dot */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-gray-600 font-sans text-xs">Live</span>
            </div>
            <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.06] rounded-full pl-2 pr-3 py-1">
              <div className="w-5 h-5 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center">
                <span className="text-gold font-sans text-[9px] font-semibold">
                  {userName.slice(0, 2).toUpperCase()}
                </span>
              </div>
              <span className="text-gray-400 font-sans text-xs capitalize hidden sm:block">{userName}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>

      </div>
    </div>
  );
}
