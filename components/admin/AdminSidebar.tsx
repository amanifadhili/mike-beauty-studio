'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function AdminSidebar() {
  const pathname = usePathname();

  const links = [
    { name: 'Overview', href: '/admin' },
    { name: 'Bookings', href: '/admin/bookings' },
    { name: 'Services', href: '/admin/services' },
    { name: 'Gallery', href: '/admin/gallery' },
  ];

  return (
    <aside className="w-64 bg-[#1a1a1a] border-r border-white/10 hidden md:flex flex-col h-full absolute left-0 top-0">
      
      {/* Brand Header */}
      <div className="h-20 flex items-center px-8 border-b border-white/10">
        <Link href="/admin" className="font-playfair text-xl text-gold tracking-widest uppercase">
          Mike <span className="text-white">Admin</span>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`
                flex items-center px-4 py-3 rounded-md transition-all duration-300 font-sans text-sm tracking-wide
                ${isActive 
                  ? 'bg-gold/10 text-gold border-r-2 border-gold' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }
              `}
            >
              {link.name}
            </Link>
          );
        })}
      </nav>

      {/* Logout / Footer Actions */}
      <div className="p-4 border-t border-white/10">
        <button 
          onClick={() => window.location.href = '/'}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-white/20 text-gray-400 hover:text-white hover:border-white transition-colors text-sm font-sans tracking-wide"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Exit to Website
        </button>
      </div>

    </aside>
  );
}
