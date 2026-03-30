import { prisma } from '@/lib/prisma';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { GalleryClient } from '@/components/gallery/GalleryClient';

// Force dynamic so gallery always reflects the latest uploads
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Portfolio & Gallery | Mike Beauty Studio Kigali',
  description: 'View our stunning portfolio of luxury lash extensions, featuring Classic, Hybrid, and Volume transformations.',
};

export default async function GalleryPage() {
  const mediaItems = await prisma.media.findMany({
    where: { type: 'image' },
    include: {
      service: {
        select: { name: true }
      }
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="bg-cream-white min-h-screen pt-32 pb-24 text-charcoal relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-16">
          <SectionHeading 
            title="Studio Portfolio"
            subtitle="Browse our recent transformations. Filter by style to find the exact look you desire for your next appointment."
            alignment="center"
            className="[&>span]:text-gold"
          />
        </div>

        {mediaItems.length > 0 ? (
          <GalleryClient items={mediaItems} />
        ) : (
          <div className="text-center py-32 border border-[#eaeaea]">
            <p className="font-playfair text-xl text-gray-600">Our gallery is currently being curated. Please check back soon.</p>
          </div>
        )}

      </div>
    </div>
  );
}
