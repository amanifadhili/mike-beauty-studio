'use client';

import { useState } from 'react';
import { saveService } from '@/app/actions/adminServices';

type ServiceData = {
  id?: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  categoryId?: string | null;
  workers?: { id: string }[];
};

type CategoryOption = { id: string; name: string };
type WorkerOption = { id: string; user: { name: string } };

interface ServiceModalProps {
  initialData?: ServiceData | null;
  categories: CategoryOption[];
  workers: WorkerOption[];
  onClose: () => void;
}

export function ServiceModal({ initialData, categories, workers, onClose }: ServiceModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorPayload, setErrorPayload] = useState<string | null>(null);
  
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || '');
  const [selectedWorkers, setSelectedWorkers] = useState<string[]>(
    initialData?.workers?.map(w => w.id) || []
  );

  const toggleWorker = (id: string) => {
    setSelectedWorkers(prev => 
      prev.includes(id) ? prev.filter(wId => wId !== id) : [...prev, id]
    );
  };

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
      categoryId: categoryId || null,
      workerIds: selectedWorkers,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="admin-surface-alt border border-white/10 p-8 max-w-lg w-full relative shadow-2xl">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h3 className="font-playfair text-2xl text-gold mb-6">
          {initialData ? 'Edit Service' : 'Add New Service'}
        </h3>

        {errorPayload && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-500/50 text-red-200 text-sm font-sans">
            {errorPayload}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 font-sans text-sm">
          
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-gray-400 uppercase tracking-wider text-xs">Service Name</label>
            <input 
              required id="name" name="name" type="text" 
              defaultValue={initialData?.name}
              className="w-full admin-input border-none border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-gold transition-colors"
              placeholder="e.g. Volume Set"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="description" className="text-gray-400 uppercase tracking-wider text-xs">Description</label>
            <textarea 
              required id="description" name="description" rows={2}
              defaultValue={initialData?.description}
              className="w-full admin-input border-none border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-gold transition-colors resize-none"
              placeholder="Describe the treatment..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-gray-400 uppercase tracking-wider text-xs">Category</label>
              <select
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                className="w-full admin-input border-none border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-gold transition-colors appearance-none"
              >
                <option value="">-- No Category --</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-gray-400 uppercase tracking-wider text-xs">Qualified Workers</label>
              <div className="w-full admin-input border border-white/10 px-4 py-2 flex flex-col gap-2 max-h-32 overflow-y-auto">
                {workers.map(w => (
                  <label key={w.id} className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={selectedWorkers.includes(w.id)}
                      onChange={() => toggleWorker(w.id)}
                      className="accent-gold"
                    />
                    <span className="text-white text-sm">{w.user.name}</span>
                  </label>
                ))}
                {workers.length === 0 && <span className="text-gray-500 text-sm">No workers available</span>}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="price" className="text-gray-400 uppercase tracking-wider text-xs">Price (RWF)</label>
              <input 
                required id="price" name="price" type="number" min="0"
                defaultValue={initialData?.price}
                className="w-full admin-input border-none border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-gold transition-colors"
                placeholder="25000"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="duration" className="text-gray-400 uppercase tracking-wider text-xs">Duration (Mins)</label>
              <input 
                required id="duration" name="duration" type="text"
                defaultValue={initialData?.duration}
                className="w-full admin-input border-none border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-gold transition-colors"
                placeholder="e.g. 2 hours"
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3 justify-end">
            <button 
              type="button" 
              onClick={onClose}
              className="px-6 py-3 border border-gray-600 text-gray-300 hover:text-white hover:border-gray-400 transition-colors tracking-wide"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="px-6 py-3 bg-gold text-charcoal hover:bg-gold/90 transition-colors tracking-wide disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Service'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
