import { AdminLayoutClient } from '@/components/admin/AdminLayoutClient';
import { auth } from '@/auth';

export const metadata = {
  title: 'Admin Dashboard | Mike Beauty Studio',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const userEmail = session?.user?.email || undefined;
  const userName = userEmail?.split('@')[0] || 'Admin';

  return (
    <AdminLayoutClient userEmail={userEmail} userName={userName}>
      {children}
    </AdminLayoutClient>
  );
}
