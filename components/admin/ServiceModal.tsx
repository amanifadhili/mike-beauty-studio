'use client';

import { useState } from 'react';
import { saveService } from '@/app/actions/adminServices';

type MediaObj = { id: string; url: string; type: string };

type ServiceData = {
  id?: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  workers?: { id: string }[];
  medias?: MediaObj[];
};

interface ServiceModalProps {
  initialData?: ServiceData | null;
  onClose: () => void;
}

export function ServiceModal({ initialData, onClose }: ServiceModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorPayload, setErrorPayload] = useState<string | null>(null);

  const defaultImage = initialData?.medias?.find(m => m.type === 'image' || m.url.match(/\.(jpeg|jpg|gif|png|webp)$/i))?.url || '';
  const [imageUrlPreview, setImageUrlPreview] = useState<string>(defaultImage);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorPayload(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      id: initialData?.id,
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: parseInt(formData.get('price') as string, 10),
      duration: formData.get('duration') as string,
      imageUrl: formData.get('imageUrl') as string,
    };

    const result = await saveService(data);
    
    if (result.success) {
      onClose();
    } else {
      setErrorPayload(result.error || 'Failed to save');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-md animate-fade-in" onClick={onClose}>
      <div 
        className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-[0_0_50px_rgba(0,0,0,0.5)] relative flex flex-col md:flex-row"
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/20 text-gray-400 hover:text-white hover:bg-black/50 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <form id="service-form" onSubmit={handleSubmit} className="flex flex-col md:flex-row w-full flex-grow">
          
          {/* LEFT COLUMN: Visuals */}
          <div className="w-full md:w-[35%] bg-white/[0.02] border-b md:border-b-0 md:border-r border-white/5 p-6 flex flex-col">
            <div className="mb-4">
              <h3 className="font-playfair text-xl text-gold mb-1">
                {initialData ? 'Edit Service' : 'New Service'}
              </h3>
              <p className="font-sans text-[10px] uppercase tracking-widest text-gray-500">Service Configuration</p>
            </div>

            <div className="flex-grow flex flex-col">
              <label htmlFor="imageUrl" className="text-gray-400 uppercase tracking-wider text-[10px] mb-2 pl-1 block">Cover Image URL</label>
              
              {/* Image Preview Box */}
              <div className="w-full aspect-square bg-charcoal rounded-xl border border-white/10 overflow-hidden relative mb-4 flex items-center justify-center shadow-inner group">
                {imageUrlPreview ? (
                  <img 
                    src={imageUrlPreview} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                    onError={() => setImageUrlPreview('')}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-white/20 gap-2">
                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-[10px] uppercase tracking-widest">No Image</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex items-center justify-center backdrop-blur-sm">
                  <span className="text-xs text-white/70 tracking-widest uppercase">Preview</span>
                </div>
              </div>

              {/* URL Input */}
              <input 
                id="imageUrl" name="imageUrl" type="url" 
                defaultValue={defaultImage}
                onChange={(e) => setImageUrlPreview(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 placeholder:text-gray-600 focus:outline-none focus:border-gold/50 transition-colors"
                placeholder="https://example.com/image.jpg"
              />
              <p className="text-[10px] text-gray-600 mt-2 text-center">Paste a direct image link</p>
            </div>
          </div>


          {/* RIGHT COLUMN: Form Data */}
          <div className="w-full md:w-[65%] p-6 md:p-8 flex flex-col font-sans">
            
            {errorPayload && (
              <div className="mb-6 p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-red-300 text-sm flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errorPayload}
              </div>
            )}

            <div className="flex flex-col gap-1.5 focus-within:text-gold text-gray-400 mb-5">
              <label htmlFor="name" className="uppercase tracking-wider text-[10px] pl-1 transition-colors">Service Name *</label>
              <input 
                required id="name" name="name" type="text" 
                defaultValue={initialData?.name}
                className="w-full bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:bg-white/[0.08] focus:border-gold/50 transition-all text-sm"
                placeholder="e.g. Classic Full Set"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div className="flex flex-col gap-1.5 focus-within:text-gold text-gray-400">
                <label htmlFor="price" className="uppercase tracking-wider text-[10px] pl-1 transition-colors">Price (RWF) *</label>
                <input 
                  required id="price" name="price" type="number" min="0" step="500"
                  defaultValue={initialData?.price}
                  className="w-full bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:bg-white/[0.08] focus:border-gold/50 transition-all text-sm"
                  placeholder="25000"
                />
              </div>

              <div className="flex flex-col gap-1.5 focus-within:text-gold text-gray-400">
                <label htmlFor="duration" className="uppercase tracking-wider text-[10px] pl-1 transition-colors">Duration Estim. *</label>
                <input 
                  required id="duration" name="duration" type="text"
                  defaultValue={initialData?.duration}
                  className="w-full bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:bg-white/[0.08] focus:border-gold/50 transition-all text-sm"
                  placeholder="e.g. 1h 30m"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 focus-within:text-gold text-gray-400 mb-5 relative flex-grow">
              <label htmlFor="description" className="uppercase tracking-wider text-[10px] pl-1 transition-colors">Client Description *</label>
              <textarea 
                required id="description" name="description" rows={5}
                defaultValue={initialData?.description}
                className="w-full flex-grow bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:bg-white/[0.08] focus:border-gold/50 transition-all text-sm resize-none leading-relaxed"
                placeholder="Describe the treatment clearly for your clients..."
              />
            </div>

            {/* Actions Footer */}
            <div className="pt-6 mt-2 border-t border-white/5 flex gap-3 justify-end shrink-0">
              <button 
                type="button" 
                onClick={onClose}
                className="px-5 py-2.5 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-colors tracking-wide text-sm font-medium"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gold text-charcoal hover:bg-gold/90 transition-all tracking-wide disabled:opacity-50 text-sm font-medium shadow-[0_0_15px_rgba(255,215,0,0.2)]"
              >
                {isSubmitting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  'Save Service'
                )}
              </button>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}
