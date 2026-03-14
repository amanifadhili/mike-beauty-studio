import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function WorkerLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/login');
  }

  // Any logged-in user can access the worker portal (in a fuller implementation,
  // you'd check role === 'WORKER' here and redirect admins back to /admin).
  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      {children}
    </div>
  );
}
