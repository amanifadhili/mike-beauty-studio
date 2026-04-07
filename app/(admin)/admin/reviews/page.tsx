import { prisma } from '@/lib/prisma';
import ReviewsClient from './ReviewsClient';
import { PageHeader } from '@/components/ui';

export const metadata = { title: 'Client Reviews | Mike Beauty Studio Admin' };
export const dynamic = 'force-dynamic';

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="animate-fade-in-up space-y-6">
      <PageHeader 
        title="Client Testimonials" 
        subtitle="Review, approve, and manage feedback submitted by your clients." 
      />
      <ReviewsClient initialReviews={reviews} />
    </div>
  );
}
