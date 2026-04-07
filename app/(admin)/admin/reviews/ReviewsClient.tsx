'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { toggleReviewApproval, deleteReview } from '@/app/actions/adminReviews';

type Review = {
  id: string;
  name: string;
  rating: number;
  comment: string;
  approved: boolean;
  createdAt: Date;
};

export default function ReviewsClient({ initialReviews }: { initialReviews: Review[] }) {
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED'>('ALL');
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const filteredReviews = initialReviews.filter(r => {
    if (filter === 'PENDING') return !r.approved;
    if (filter === 'APPROVED') return r.approved;
    return true;
  });

  const handleToggle = async (id: string, currentlyApproved: boolean) => {
    setIsProcessing(true);
    const res = await toggleReviewApproval(id, !currentlyApproved);
    setIsProcessing(false);
    if (res.success) {
      router.refresh();
    } else {
      alert(res.error || 'Failed to update review status.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this review?')) return;
    setIsProcessing(true);
    const res = await deleteReview(id);
    setIsProcessing(false);
    if (res.success) {
      router.refresh();
    } else {
      alert(res.error || 'Failed to delete review.');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Filters */}
      <div className="flex gap-2">
        <button 
          onClick={() => setFilter('ALL')}
          className={`px-4 py-2 text-xs uppercase tracking-widest font-sans rounded-lg transition-colors border ${filter === 'ALL' ? 'bg-gold/10 text-gold border-gold/30' : 'bg-transparent text-gray-500 border-white/5 hover:text-white'}`}
        >
          All
        </button>
        <button 
          onClick={() => setFilter('PENDING')}
          className={`px-4 py-2 text-xs uppercase tracking-widest font-sans rounded-lg transition-colors border ${filter === 'PENDING' ? 'bg-orange-500/10 text-orange-400 border-orange-500/30' : 'bg-transparent text-gray-500 border-white/5 hover:text-white'}`}
        >
          Pending
        </button>
        <button 
          onClick={() => setFilter('APPROVED')}
          className={`px-4 py-2 text-xs uppercase tracking-widest font-sans rounded-lg transition-colors border ${filter === 'APPROVED' ? 'bg-green-500/10 text-green-400 border-green-500/30' : 'bg-transparent text-gray-500 border-white/5 hover:text-white'}`}
        >
          Approved
        </button>
      </div>

      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredReviews.length === 0 && (
            <div className="col-span-full admin-card p-12 flex items-center justify-center text-gray-500 font-sans tracking-widest uppercase text-xs">
              No reviews match this filter.
            </div>
          )}
          {filteredReviews.map(r => (
            <motion.div
              layout
              key={r.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative admin-card p-6 space-y-4 hover:border-white/20 transition-all flex flex-col"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`w-4 h-4 ${i < r.rating ? 'text-gold fill-currentColor' : 'text-gray-600'}`} viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded font-sans uppercase tracking-widest ${r.approved ? 'bg-green-500/10 text-green-400' : 'bg-orange-500/10 text-orange-400'}`}>
                  {r.approved ? 'Published' : 'Pending'}
                </span>
              </div>

              <div>
                <p className="font-playfair text-xl text-white tracking-wide">{r.name}</p>
                {r.role && <p className="text-[10px] uppercase font-sans text-gold/80 mt-0.5 tracking-wider">{r.role}</p>}
                <p suppressHydrationWarning className="text-[10px] font-sans text-gray-500 mt-1">
                  {new Date(r.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>

              <div className="bg-white/5 rounded-lg p-3 border border-white/5 flex-1 relative group">
                 <p className="font-sans text-sm text-gray-300 leading-relaxed italic block">&quot;{r.comment}&quot;</p>
              </div>

              <div className="pt-4 flex gap-2 w-full border-t border-white/5 justify-end mt-auto">
                <button 
                  disabled={isProcessing}
                  onClick={() => handleToggle(r.id, r.approved)} 
                  className={`px-4 py-2 rounded text-xs uppercase tracking-widest font-sans flex items-center justify-center transition-all border border-transparent disabled:opacity-50 ${r.approved ? 'bg-orange-500/10 text-orange-400 hover:bg-orange-500/20' : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'}`}
                >
                  {r.approved ? 'Hide' : 'Approve'}
                </button>
                <button 
                  disabled={isProcessing}
                  onClick={() => handleDelete(r.id)} 
                  className="w-8 h-8 flex items-center justify-center rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-transparent hover:border-red-500/20 disabled:opacity-50 transition-all"
                  aria-label="Delete Review"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
