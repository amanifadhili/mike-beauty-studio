'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logOut } from '@/app/actions/authActions';

interface AdminSidebarProps {
  userEmail?: string;
}

const navLinks = [
  {
    name: 'Overview',
    href: '/admin',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    name: 'Bookings',
    href: '/admin/bookings',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    name: 'Services',
    href: '/admin/services',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
  },
  {
    name: 'Gallery',
    href: '/admin/gallery',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

export function AdminSidebar({ userEmail }: AdminSidebarProps) {
  const pathname = usePathname();

  const initials = userEmail
    ? userEmail.slice(0, 2).toUpperCase()
    : 'AD';

  return (
    <aside className="w-64 bg-[#111111] border-r border-white/[0.06] hidden md:flex flex-col fixed top-0 left-0 h-screen z-50">

      {/* Brand Header */}
      <div className="h-20 flex items-center px-6 border-b border-white/[0.06]">
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="w-8 h-8 bg-gold/10 border border-gold/30 flex items-center justify-center">
            <svg className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L9.09 8.26L2 9.27L7 14.14L5.82 21.02L12 17.77L18.18 21.02L17 14.14L22 9.27L14.91 8.26L12 2Z"/>
            </svg>
          </div>
          <div>
            <span className="font-playfair text-white text-sm tracking-wide leading-none block">Mike Beauty</span>
            <span className="font-sans text-[10px] text-gold/70 uppercase tracking-[0.15em]">Admin Studio</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        <p className="text-[10px] font-sans uppercase tracking-[0.15em] text-gray-600 px-3 mb-4">Navigation</p>
        {navLinks.map((link) => {
          const isActive = link.href === '/admin'
            ? pathname === '/admin'
            : pathname.startsWith(link.href);

          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group font-sans text-sm ${
                isActive
                  ? 'bg-gold/10 text-gold'
                  : 'text-gray-500 hover:text-gray-200 hover:bg-white/[0.04]'
              }`}
            >
              <span className={`transition-colors ${isActive ? 'text-gold' : 'text-gray-600 group-hover:text-gray-400'}`}>
                {link.icon}
              </span>
              <span className="tracking-wide">{link.name}</span>
              {isActive && (
                <span className="ml-auto w-1 h-1 rounded-full bg-gold" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / User Area */}
      <div className="p-4 border-t border-white/[0.06] space-y-3">
        {/* User pill */}
        {userEmail && (
          <div className="flex items-center gap-3 px-3 py-2 bg-white/[0.03] rounded-lg">
            <div className="w-7 h-7 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center shrink-0">
              <span className="text-gold font-sans text-[10px] font-semibold">{initials}</span>
            </div>
            <div className="min-w-0">
              <p className="text-white/80 text-xs font-sans truncate">{userEmail}</p>
              <p className="text-[10px] text-gray-600 font-sans">Administrator</p>
            </div>
          </div>
        )}

        <form action={logOut}>
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-400/[0.06] transition-all duration-200 text-sm font-sans group"
          >
            <svg className="w-4 h-4 shrink-0 transition-colors group-hover:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="tracking-wide">Sign Out</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
