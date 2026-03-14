'use client';

import { useState } from 'react';
import { addGalleryMedia } from '@/app/actions/adminGallery';

type ServiceCategory = {
  id: string;
  name: string;
};

export function GalleryURLAdder({ availableServices }: { availableServices: ServiceCategory[] }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorPayload, setErrorPayload] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorPayload(null);

    const formData = new FormData(e.currentTarget);
    const url = formData.get('url') as string;
    const type = formData.get('type') as string;
    const serviceId = formData.get('serviceId') as string;
    
    // Find the category name based on the selected service ID
    const selectedService = availableServices.find(s => s.id === serviceId);
    const category = selectedService ? selectedService.name : 'Uncategorized';

    const result = await addGalleryMedia({ url, type, category, serviceId });

    setIsSubmitting(false);

    if (result.success) {
      (e.target as HTMLFormElement).reset();
    } else {
      setErrorPayload(result.error || 'Failed to add image.');
    }
  };

  return (
    <div className="bg-[#1a1a1a] border border-white/5 p-8 mb-12">
      <h3 className="font-playfair text-xl text-white mb-6">Add New Media (URL)</h3>
      
      {errorPayload && (
        <div className="mb-4 p-3 bg-red-900/30 border border-red-500/50 text-red-200 text-sm font-sans">
          {errorPayload}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
        
        <div className="flex-1 flex flex-col gap-1 w-full">
          <label htmlFor="url" className="text-gray-400 uppercase tracking-wider text-xs">Direct Image/Video URL</label>
          <input 
            required id="url" name="url" type="url" 
            placeholder="https://images.unsplash.com/photo-..."
            className="w-full bg-[#2a2a2a] border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-gold transition-colors"
          />
        </div>

        <div className="flex flex-col gap-1 w-full md:w-48">
          <label htmlFor="type" className="text-gray-400 uppercase tracking-wider text-xs">Media Type</label>
          <select 
            required id="type" name="type" defaultValue="image"
            className="w-full bg-[#2a2a2a] border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-gold transition-colors"
          >
            <option value="image">Image</option>
            <option value="video">Video (MP4/WebM)</option>
          </select>
        </div>

        <div className="flex flex-col gap-1 w-full md:w-64">
          <label htmlFor="serviceId" className="text-gray-400 uppercase tracking-wider text-xs">Category Assignment</label>
          <select 
            required id="serviceId" name="serviceId"
            className="w-full bg-[#2a2a2a] border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-gold transition-colors"
          >
            <option value="">-- Select Service --</option>
            {availableServices.map(service => (
              <option key={service.id} value={service.id}>{service.name}</option>
            ))}
          </select>
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full md:w-auto px-8 py-3 bg-gold text-charcoal hover:bg-[#c9a633] transition-colors tracking-wide disabled:opacity-50"
        >
          {isSubmitting ? 'Adding...' : 'Add to Gallery'}
        </button>

      </form>
    </div>
  );
}
