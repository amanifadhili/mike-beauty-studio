'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { AdminSidebar } from './AdminSidebar';

interface AdminLayoutClientProps {
  userEmail?: string;
  userName: string;
  children: React.ReactNode;
}

export function AdminLayoutClient({ userEmail, userName, children }: AdminLayoutClientProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Close sidebar automatically on route change
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  // Prevent body scroll when sidebar drawer is open on mobile
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSidebarOpen]);

  return (
    <div className="bg-[#0e0e0e] min-h-screen text-cream-white flex">

      {/* Sidebar — fixed on desktop, slide-over on mobile */}
      <AdminSidebar
        userEmail={userEmail}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main content — offset by sidebar width on desktop */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">

        {/* Sticky top navbar */}
        <header className="sticky top-0 z-40 h-14 bg-[#111111]/95 backdrop-blur-sm border-b border-white/[0.06] flex items-center justify-between px-4 sm:px-6">

          {/* Left: hamburger (mobile) + breadcrumb (desktop) */}
          <div className="flex items-center gap-3">
            {/* Hamburger — only visible on mobile */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open navigation menu"
              className="md:hidden flex flex-col justify-center items-center w-9 h-9 rounded-lg hover:bg-white/[0.06] transition-colors gap-[5px] shrink-0"
            >
              <span className="w-4.5 h-px bg-white/70 block" />
              <span className="w-4.5 h-px bg-white/70 block" />
              <span className="w-3 h-px bg-white/70 block self-start" />
            </button>

            {/* Brand name on mobile (replaces breadcrumb) */}
            <span className="font-playfair text-gold text-base md:hidden">Mike Admin</span>

            {/* Breadcrumb on desktop */}
            <span className="hidden md:flex items-center gap-2 text-gray-600 text-xs font-sans">
              <span className="text-gray-700">Studio</span>
              <span>/</span>
              <span className="text-gray-400">Dashboard</span>
            </span>
          </div>

          {/* Right: status + user */}
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
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>

      </div>
    </div>
  );
}
