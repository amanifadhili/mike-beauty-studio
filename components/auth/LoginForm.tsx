'use client';

import { useActionState } from 'react';
import { authenticate } from '@/app/actions/authActions';

export function LoginForm() {
  const [errorMessage, dispatch, isPending] = useActionState(authenticate, undefined);

  return (
    <form action={dispatch} className="space-y-5">
      
      <div className="space-y-6 pt-2">
        <div className="relative group pb-2">
          <input
            id="email"
            type="email"
            name="email"
            placeholder="mike@beauty.com"
            required
            className="w-full bg-transparent border-b border-white/20 px-0 py-3 text-white placeholder-white/20 focus:outline-none focus:border-gold transition-colors duration-300 font-sans text-base sm:text-lg tracking-wide peer"
          />
          <label className="absolute left-0 -top-3 text-[10px] text-white/50 tracking-widest uppercase transition-all duration-300 peer-focus:text-gold peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-transparent pointer-events-none" htmlFor="email">
            Email Address
          </label>
        </div>

        <div className="relative group pb-2">
          <input
            id="password"
            type="password"
            name="password"
            placeholder="••••••••"
            required
            minLength={6}
            className="w-full bg-transparent border-b border-white/20 px-0 py-3 text-white focus:outline-none placeholder-white/20 focus:border-gold transition-colors duration-300 font-sans text-base sm:text-lg tracking-widest peer"
          />
          <label className="absolute left-0 -top-3 text-[10px] text-white/50 tracking-widest uppercase transition-all duration-300 peer-focus:text-gold peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-transparent pointer-events-none" htmlFor="password">
            Secure Password
          </label>
        </div>
      </div>

      {errorMessage && (
        <div
          className="flex items-center gap-2 p-3 bg-red-500/[0.08] border border-red-500/20 rounded-lg text-red-400 text-sm font-sans"
          aria-live="polite"
          aria-atomic="true"
        >
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {errorMessage}
        </div>
      )}

      <button 
        type="submit"
        className="w-full flex items-center justify-center gap-2 bg-gold text-charcoal rounded-sm py-4 font-sans font-bold tracking-widest hover:brightness-110 hover:shadow-[0_0_20px_rgba(200,160,80,0.3)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-8 uppercase text-xs sm:text-sm"
        disabled={isPending}
      >
        {isPending ? (
          <>
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            Signing in...
          </>
        ) : 'Sign In'}
      </button>
    </form>
  );
}
