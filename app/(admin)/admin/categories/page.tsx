import { prisma } from '@/lib/prisma';
import { CategoryClient } from './CategoryClient';
import { PageHeader } from '@/components/ui';

export const metadata = {
  title: 'Service Categories | Mike Beauty Studio Admin',
};

export const dynamic = 'force-dynamic';

export default async function AdminCategoriesPage() {
  const categories = await prisma.serviceCategory.findMany({
    orderBy: { order: 'asc' },
    include: {
      _count: { select: { services: true } }
    }
  });

  return (
    <div className="animate-fade-in-up">
      <CategoryClient initialCategories={categories} />
    </div>
  );
}
