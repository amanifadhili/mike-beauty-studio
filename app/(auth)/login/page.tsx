import { LoginForm } from '@/components/auth/LoginForm';

export const metadata = {
  title: 'Admin Login | Mike Beauty Studio',
  description: 'Secure admin portal login.',
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#0e0e0e] flex">
      
      {/* Left decorative panel */}
      <div className="hidden lg:flex flex-col justify-between w-96 bg-[#111111] border-r border-white/[0.06] p-12">
        <div>
          <div className="flex items-center gap-3 mb-16">
            <div className="w-8 h-8 bg-gold/10 border border-gold/30 flex items-center justify-center">
              <svg className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L9.09 8.26L2 9.27L7 14.14L5.82 21.02L12 17.77L18.18 21.02L17 14.14L22 9.27L14.91 8.26L12 2Z"/>
              </svg>
            </div>
            <div>
              <span className="font-playfair text-white text-sm tracking-wide leading-none block">Mike Beauty</span>
              <span className="font-sans text-[10px] text-gold/70 uppercase tracking-[0.15em]">Admin Studio</span>
            </div>
          </div>

          <h2 className="font-playfair text-3xl text-white leading-tight mb-4">
            Your Studio.<br/>Your Control.
          </h2>
          <p className="text-gray-600 font-sans text-sm leading-relaxed">
            The secure hub for managing bookings, services, gallery, and global configurations for Mike Beauty Studio.
          </p>
        </div>

        <div className="space-y-4">
          {[
            { label: 'Booking Management', icon: '📅' },
            { label: 'Service Catalog', icon: '✨' },
            { label: 'Gallery Control', icon: '🖼️' },
            { label: 'Site Settings', icon: '⚙️' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3 text-gray-500 font-sans text-sm">
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right login panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          
          {/* Mobile logo (only visible on mobile) */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-8 h-8 bg-gold/10 border border-gold/30 flex items-center justify-center">
              <svg className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L9.09 8.26L2 9.27L7 14.14L5.82 21.02L12 17.77L18.18 21.02L17 14.14L22 9.27L14.91 8.26L12 2Z"/>
              </svg>
            </div>
            <span className="font-playfair text-white">Mike Beauty Admin</span>
          </div>

          <div className="mb-8">
            <h1 className="font-playfair text-4xl text-white mb-2">Welcome back</h1>
            <p className="text-gray-600 font-sans text-sm">Sign in to access the admin dashboard.</p>
          </div>

          <div className="bg-[#161616] border border-white/[0.06] rounded-2xl p-8">
            <LoginForm />
          </div>

          <p className="text-center text-gray-700 font-sans text-xs mt-6">
            Authorized personnel only. All activity is logged.
          </p>
        </div>
      </div>

    </main>
  );
}
