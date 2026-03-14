import { AdminSidebar } from '@/components/admin/AdminSidebar';

export const metadata = {
  title: 'Admin Dashboard | Mike Beauty Studio',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-charcoal min-h-screen text-cream-white relative flex">
      {/* 
        Note: We hide the standard Navbar globally in the root layout later if needed, 
        or we accept that the user must use a dedicated route group that swaps root layouts. 
        For now, this layout nests inside the root layout. 
        To prevent the public navbar from showing, we usually conditionally render it in the root layout based on pathname.
      */}
      
      {/* Desktop Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <main className="flex-1 md:pl-64 h-screen overflow-y-auto">
        <div className="min-h-full bg-[#111111] p-6 lg:p-12 relative z-10">
            {children}
        </div>
      </main>

    </div>
  );
}
