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

  // Fetch active Staff Users for the assignment checklist
  const staff = await prisma.user.findMany({
    where: { role: 'WORKER' },
    select: { id: true, name: true },
    orderBy: { name: 'asc' }
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
        users={staff} // Pass down the mapped User array
      />
    </div>
  );
}
