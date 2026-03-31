import { LoginForm } from '@/components/auth/LoginForm';
import Link from 'next/link';

export const metadata = {
  title: 'Admin Portal | Mike Beauty Studio',
  description: 'Authorized personnel only.',
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Escape Hatch */}
      <Link href="/" className="absolute top-6 left-6 sm:top-8 sm:left-8 flex items-center gap-2 text-white/40 hover:text-white transition-colors duration-300 font-sans text-[10px] sm:text-xs uppercase tracking-[0.2em] z-50 group">
        <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Return to Site
      </Link>

      {/* Ambient background glows for enhanced glassmorphism depth */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-[420px] relative z-10">
        
        {/* Glassmorphism Vault Card */}
        <div className="bg-[#111111]/60 backdrop-blur-3xl border border-white/10 rounded-2xl p-8 sm:p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] flex flex-col relative overflow-hidden">
          {/* Subtle top border highlight */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          
          {/* Branding Header */}
          <div className="flex flex-col items-center justify-center mb-10 w-full text-center">
            <div className="w-12 h-12 bg-black/50 border border-gold/30 rounded-lg flex items-center justify-center mb-5 shadow-inner">
              <svg className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L9.09 8.26L2 9.27L7 14.14L5.82 21.02L12 17.77L18.18 21.02L17 14.14L22 9.27L14.91 8.26L12 2Z"/>
              </svg>
            </div>
            <h1 className="font-playfair text-2xl text-white tracking-wide">Mike Beauty Studio</h1>
            <p className="font-sans text-[10px] text-gold/70 uppercase tracking-[0.2em] mt-2">Admin Portal</p>
          </div>

          {/* Form Injection */}
          <div className="w-full">
            <LoginForm />
          </div>
          
        </div>
        
        {/* Security Footer */}
        <div className="text-center mt-10 space-y-2">
          <p className="text-[10px] text-white/40 font-sans tracking-widest uppercase">
            Authorized personnel only
          </p>
          <p className="text-[9px] text-white/20 font-sans tracking-widest uppercase">
            All activity is strictly logged and monitored
          </p>
        </div>
      </div>
    </main>
  );
}
