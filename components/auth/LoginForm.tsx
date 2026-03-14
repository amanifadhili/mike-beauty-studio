'use client';

import { useActionState } from 'react';
import { authenticate } from '@/app/actions/authActions';

export function LoginForm() {
  const [errorMessage, dispatch, isPending] = useActionState(authenticate, undefined);

  return (
    <form action={dispatch} className="space-y-5">
      
      <div className="space-y-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-gray-500 uppercase tracking-wider text-[10px] font-sans" htmlFor="email">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="mike@beauty.com"
            required
            className="w-full bg-[#1e1e1e] border border-white/[0.08] rounded-lg px-4 py-3 text-white placeholder-gray-700 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all font-sans text-sm"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-gray-500 uppercase tracking-wider text-[10px] font-sans" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="••••••••"
            required
            minLength={6}
            className="w-full bg-[#1e1e1e] border border-white/[0.08] rounded-lg px-4 py-3 text-white placeholder-gray-700 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all font-sans text-sm"
          />
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
        className="w-full flex items-center justify-center gap-2 bg-gold text-charcoal rounded-lg py-3 font-sans font-semibold tracking-wide hover:bg-[#c9a633] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
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
