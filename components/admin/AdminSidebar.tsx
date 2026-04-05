'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logOut } from '@/app/actions/authActions';

interface AdminSidebarProps {
  userEmail?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

const navLinks = [
  // ── Main Action Items (Always Visible, no group header) ──────────
  {
    group: '',
    items: [
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
        name: 'POS (Walk-In)',
        href: '/admin/pos',
        icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6M17 13l1.5 6M9 19h6" />
          </svg>
        ),
      },
    ],
  },
  // ── Operations & Finances ────────
  {
    group: 'Operations',
    items: [
      {
        name: 'Transactions',
        href: '/admin/transactions',
        icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        ),
      },
      {
        name: 'Expenses',
        href: '/admin/expenses',
        icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
      },
      {
        name: 'Client IOUs',
        href: '/admin/client-credits',
        icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
          </svg>
        ),
      },
      {
        name: 'Reports',
        href: '/admin/reports',
        icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        ),
      },
    ],
  },
  // ── Studio Management (Collapsible Dropdown) ───────────────────────────────
  {
    group: 'Studio Management',
    isDropdown: true,
    icon: (
      <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    items: [
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
        name: 'Categories',
        href: '/admin/categories',
        icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
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
        name: 'Workers',
        href: '/admin/workers',
        icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        ),
      },
      {
        name: 'Settings',
        href: '/admin/settings',
        icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
        ),
      },
    ],
  },
];


/** The inner sidebar panel — shared between desktop (fixed) and mobile (drawer) */
function SidebarPanel({ userEmail, onClose }: { userEmail?: string; onClose?: () => void }) {
  const pathname = usePathname();
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});

  // Auto-expand the dropdown if a child link is currently active
  useEffect(() => {
    const defaultOpenStates: Record<string, boolean> = {};
    navLinks.forEach(group => {
      if (group.isDropdown) {
        const isActiveChild = group.items.some(link => pathname.startsWith(link.href));
        if (isActiveChild) {
          defaultOpenStates[group.group] = true;
        }
      }
    });
    setOpenDropdowns(prev => ({ ...prev, ...defaultOpenStates }));
  }, [pathname]);

  const toggleDropdown = (groupName: string) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  const initials = userEmail
    ? userEmail.slice(0, 2).toUpperCase()
    : 'AD';

  return (
    <div className="w-full h-full flex flex-col" style={{ background: 'var(--admin-overlay)' }}>

      {/* Brand Header */}
      <div className="h-20 flex items-center px-6 border-b border-white/[0.06] shrink-0">
        <Link href="/admin" onClick={onClose} className="flex items-center gap-3 group">
          <div className="w-8 h-8 bg-gold/10 border border-gold/30 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L9.09 8.26L2 9.27L7 14.14L5.82 21.02L12 17.77L18.18 21.02L17 14.14L22 9.27L14.91 8.26L12 2Z"/>
            </svg>
          </div>
          <div>
            <span className="font-playfair text-white text-sm tracking-wide leading-none block">Mike Beauty</span>
            <span className="font-sans text-[10px] text-gold/70 uppercase tracking-[0.15em]">Admin Studio</span>
          </div>
        </Link>

        {/* Close button — only visible in mobile drawer mode */}
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close navigation"
            className="ml-auto md:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/[0.06] transition-colors text-gray-500 hover:text-white"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-4 overflow-y-auto">
        {navLinks.map((group) => {
          if (group.isDropdown) {
            const isOpen = openDropdowns[group.group];
            return (
              <div key={group.group}>
                <button
                  onClick={() => toggleDropdown(group.group)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-gray-500 hover:text-gray-200 hover:bg-white/[0.04] transition-all duration-200 group font-sans text-sm outline-none"
                >
                  <div className="flex items-center gap-3">
                    {group.icon && <span className="transition-colors group-hover:text-gray-400">{group.icon}</span>}
                    <span className="tracking-wide select-none">{group.group}</span>
                  </div>
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180 text-gold' : 'rotate-0'}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100 mt-1' : 'max-h-0 opacity-0'}`}
                >
                  <div className="pl-9 space-y-0.5 border-l border-white/[0.06] ml-[1.35rem]">
                    {group.items.map((link) => {
                      const isActive = pathname.startsWith(link.href);
                      return (
                        <Link
                          key={link.name}
                          href={link.href}
                          onClick={onClose}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group font-sans text-[13px] ${
                            isActive
                              ? 'bg-gold/10 text-gold'
                              : 'text-gray-500 hover:text-gray-200 hover:bg-white/[0.04]'
                          }`}
                        >
                          <span className={`transition-colors shrink-0 ${isActive ? 'text-gold' : 'text-gray-600 group-hover:text-gray-400'}`}>
                            {link.icon}
                          </span>
                          <span className="tracking-wide">{link.name}</span>
                          {isActive && (
                            <span className="ml-auto w-1 h-1 rounded-full bg-gold shrink-0" />
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div key={group.group || 'uncategorized'}>
              {group.group && (
                <p className="text-[10px] font-sans uppercase tracking-[0.15em] text-gray-600 px-3 mb-2">{group.group}</p>
              )}
              <div className="space-y-0.5">
                {group.items.map((link) => {
                  const isActive = link.href === '/admin'
                    ? pathname === '/admin'
                    : pathname.startsWith(link.href);

                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={onClose}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group font-sans text-sm ${
                        isActive
                          ? 'bg-gold/10 text-gold shadow-sm'
                          : 'text-gray-500 hover:text-gray-200 hover:bg-white/[0.04]'
                      }`}
                    >
                      <span className={`transition-colors shrink-0 ${isActive ? 'text-gold' : 'text-gray-600 group-hover:text-gray-400'}`}>
                        {link.icon}
                      </span>
                      <span className="tracking-wide">{link.name}</span>
                      {isActive && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-gold shrink-0 shadow-[0_0_8px_rgba(255,215,0,0.6)]" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>


      {/* Footer / User Area */}
      <div className="p-4 border-t border-white/[0.06] space-y-3 shrink-0">
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
            className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-400/[0.06] transition-all duration-200 text-sm font-sans group"
          >
            <svg className="w-4 h-4 shrink-0 transition-colors group-hover:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="tracking-wide">Sign Out</span>
          </button>
        </form>
      </div>
    </div>
  );
}

export function AdminSidebar({ userEmail, isOpen = false, onClose }: AdminSidebarProps) {
  return (
    <>
      {/* ─── DESKTOP: fixed sidebar (always visible on md+) ─── */}
      <aside className="w-64 border-r border-white/[0.06] hidden md:block fixed top-0 left-0 h-screen z-50">
        <SidebarPanel userEmail={userEmail} />
      </aside>

      {/* ─── MOBILE: off-canvas slide-over drawer ─── */}
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`
          md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm
          transition-opacity duration-300
          ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
      />

      {/* Drawer panel */}
      <aside
        className={`
          md:hidden fixed top-0 left-0 h-screen w-72 z-50
          transform transition-transform duration-300 ease-in-out
          border-r border-white/[0.06]
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        aria-label="Mobile navigation"
      >
        <SidebarPanel userEmail={userEmail} onClose={onClose} />
      </aside>
    </>
  );
}
