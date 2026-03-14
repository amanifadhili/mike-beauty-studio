import { prisma } from '@/lib/prisma';
import { ServicesDashboardClient } from '@/app/(admin)/admin/services/ServicesClient';

export const metadata = {
  title: 'Manage Services | Mike Beauty Studio Admin',
};

export const dynamic = 'force-dynamic';

export default async function AdminServicesPage() {
  
  // Fetch Categories for organizing the layout
  const categories = await prisma.serviceCategory.findMany({
    orderBy: { order: 'asc' }
  });

  // Fetch active workers for the assignment checklist
  const workers = await prisma.worker.findMany({
    where: { status: 'ACTIVE' },
    select: { id: true, user: { select: { name: true } } },
    orderBy: { user: { name: 'asc' } }
  });

  // Fetch all services, displaying active ones first, then alphabetical
  const services = await prisma.service.findMany({
    include: {
      workers: { select: { id: true } }
    },
    orderBy: [
      { active: 'desc' },
      { name: 'asc' },
    ]
  });

  return (
    <div className="animate-fade-in-up">
      <ServicesDashboardClient 
        initialServices={services} 
        categories={categories}
        workers={workers as any} // Force type match for the client
      />
    </div>
  );
}
