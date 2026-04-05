import { prisma } from '@/lib/prisma';
import { ServicesDashboardClient } from '@/app/(admin)/admin/services/ServicesClient';

export const metadata = {
  title: 'Manage Services | Mike Beauty Studio Admin',
};

export const dynamic = 'force-dynamic';

export default async function AdminServicesPage() {
  
  // Fetch all services, displaying active ones first, then alphabetical
  // Update: Included medias relation to support graphical grid layout
  const services = await prisma.service.findMany({
    include: {
      workers: { select: { id: true } },
      medias: { select: { id: true, url: true, type: true } }
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
      />
    </div>
  );
}
