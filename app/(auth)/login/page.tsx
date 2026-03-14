import { LoginForm } from '@/components/auth/LoginForm';
import { SectionHeading } from '@/components/ui/SectionHeading';

export const metadata = {
  title: 'Admin Login | Mike Beauty Studio',
  description: 'Secure admin portal login.',
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-charcoal flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#1a1a1a] border border-white/5 p-8 shadow-2xl animate-fade-in-up">
        
        <div className="text-center mb-8">
          <SectionHeading 
            title="Studio Portal"
            subtitle="Authorized Personnel Only"
            alignment="center"
          />
        </div>

        <LoginForm />
        
      </div>
    </main>
  );
}
