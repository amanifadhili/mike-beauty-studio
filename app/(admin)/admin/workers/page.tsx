import { prisma } from '@/lib/prisma';
import WorkersClient from './WorkersClient';

export const metadata = { title: 'Workers | Mike Beauty Studio Admin' };
export const dynamic = 'force-dynamic';

export default async function WorkersPage() {
  const workers = await prisma.worker.findMany({
    include: {
      user: { select: { name: true, email: true } },
      advances: { where: { status: 'PENDING' } },
      payments: { orderBy: { date: 'desc' }, take: 1 },
    },
    orderBy: { createdAt: 'desc' },
  });

  const users = await prisma.user.findMany({
    where: { workerProfile: null, role: 'WORKER' },
    select: { id: true, name: true, email: true },
  });

  return (
    <div className="animate-fade-in-up space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[11px] font-sans uppercase tracking-[0.2em] text-gold/70 mb-1">Admin Dashboard</p>
          <h1 className="font-playfair text-3xl text-white">Workers</h1>
          <p className="text-gray-600 text-sm font-sans mt-1">Manage staff profiles, commission models, and payouts.</p>
        </div>
        <span className="bg-[#161616] border border-white/[0.06] px-4 py-2 rounded-lg text-white font-semibold font-sans text-sm">{workers.length} Staff</span>
      </div>
      <WorkersClient workers={workers} users={users} />
    </div>
  );
}
