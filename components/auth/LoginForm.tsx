'use client';

import { useActionState } from 'react';
import { authenticate } from '@/app/actions/authActions';
import { Button } from '@/components/ui/Button';

export function LoginForm() {
  const [errorMessage, dispatch, isPending] = useActionState(authenticate, undefined);

  return (
    <form action={dispatch} className="space-y-6">
      
      <div className="space-y-4">
        <div className="flex flex-col gap-1">
          <label className="text-gray-400 uppercase tracking-wider text-xs" htmlFor="email">
            Admin Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="mike@beauty.com"
            required
            className="w-full bg-[#2a2a2a] border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-gold transition-colors font-sans"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-gray-400 uppercase tracking-wider text-xs" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="Enter secure password"
            required
            minLength={6}
            className="w-full bg-[#2a2a2a] border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-gold transition-colors font-sans"
          />
        </div>
      </div>

      <div
        className="flex h-8 items-end space-x-1"
        aria-live="polite"
        aria-atomic="true"
      >
        {errorMessage && (
          <p className="text-sm text-red-500 font-sans">{errorMessage}</p>
        )}
      </div>

      <Button 
        variant="primary" 
        size="lg" 
        className="w-full flex justify-center mt-4 tracking-wider" 
        disabled={isPending}
      >
        {isPending ? 'Authenticating...' : 'Sign In'}
      </Button>
    </form>
  );
}
