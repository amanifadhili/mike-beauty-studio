import { prisma } from '@/lib/prisma';
import { GalleryUploader } from '@/components/admin/GalleryUploader';
import { deleteGalleryMedia } from '@/app/actions/adminGallery';
import Image from 'next/image';

export const metadata = {
  title: 'Gallery Manager | Mike Beauty Studio Admin',
};

export const dynamic = 'force-dynamic';

export default async function AdminGalleryPage() {
  
  // 1. Fetch available services to populate category dropdown
  const services = await prisma.service.findMany({
    where: { active: true },
    select: { id: true, name: true },
    orderBy: { name: 'asc' }
  });

  // 2. Fetch all current media
  const media = await prisma.media.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      service: {
        select: { name: true }
      }
    }
  });

  return (
    <div className="animate-fade-in-up space-y-6">
      
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[11px] font-sans uppercase tracking-[0.2em] text-gold/70 mb-1">Admin Dashboard</p>
          <h1 className="font-playfair text-3xl text-white">Gallery Manager</h1>
          <p className="text-gray-600 text-sm font-sans mt-1">Upload images and videos directly from your device to your public portfolio.</p>
        </div>
        <div className="flex items-center gap-2 bg-[#161616] border border-white/[0.06] px-4 py-2 rounded-lg">
          <span className="text-gray-600 font-sans text-xs">Total</span>
          <span className="text-white font-semibold font-sans">{media.length}</span>
        </div>
      </div>

      <GalleryUploader availableServices={services} />

      <div>
        <h2 className="font-playfair text-xl text-white mb-4">Current Portfolio</h2>
        
        {media.length === 0 ? (
          <div className="bg-[#1a1a1a] border border-white/5 p-12 text-center text-gray-500 font-sans">
            No media found.
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {media.map((item) => (
              <div key={item.id} className="relative group bg-[#1a1a1a] border border-white/5 overflow-hidden aspect-square">
                
                <Image 
                  src={item.url} 
                  alt="Gallery Item" 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end h-1/2">
                  <span className="text-gold font-sans text-xs uppercase tracking-widest mb-1">
                    {item.service?.name || item.category || 'Uncategorized'}
                  </span>
                  
                  <form action={async () => {
                    'use server'
                    await deleteGalleryMedia(item.id);
                  }}>
                    <button type="submit" className="text-red-400 hover:text-red-300 text-xs font-sans uppercase mt-2">
                      Delete Image
                    </button>
                  </form>
                </div>

                {item.type === 'video' && (
                  <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded text-[10px] text-white uppercase tracking-widest">
                    Video
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
