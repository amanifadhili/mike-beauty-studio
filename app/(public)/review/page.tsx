'use client';

import { useState } from 'react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { submitReview } from '@/app/actions/submitReview';

export default function ReviewPage() {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    const formData = new FormData(e.currentTarget);
    formData.append('rating', rating.toString());
    
    // Explicitly grab the role field or allow empty
    const role = formData.get('role') as string;
    if (role) {
      formData.set('role', role);
    }
    
    const res = await submitReview(formData);
    
    setIsSubmitting(false);
    if (res.success) {
      setIsSuccess(true);
    } else {
      setError(res.error || 'Something went wrong.');
    }
  };

  return (
    <div className="bg-cream-white min-h-[calc(100vh-80px)] pt-24 pb-12 flex items-start justify-center relative z-10">
      <div className="max-w-xl w-full mx-auto px-4 mt-8 md:mt-12">
        
        {isSuccess ? (
          <div className="bg-cream p-10 md:p-16 border border-[#eaeaea] text-center shadow-2xl animate-fade-in-up">
            <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-gold/20">
              <svg className="w-10 h-10 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
            </div>
            <h2 className="font-playfair text-3xl md:text-4xl text-charcoal mb-4">Thank You!</h2>
            <p className="font-sans text-gray-600 leading-relaxed text-base">
              Your feedback means the world to us. We truly appreciate you taking the time to share your experience with Mike Beauty Studio!
            </p>
          </div>
        ) : (
          <div className="bg-cream p-8 md:p-12 border border-[#eaeaea] shadow-2xl relative overflow-hidden">
            {/* Subtle decorative background accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-bl-full pointer-events-none -mt-4 -mr-4" />
            
            <div className="text-center mb-10 relative z-10">
              <SectionHeading 
                title="Share Your Experience"
                subtitle="We take pride in our work. Please rate your service and share your thoughts to help us continue providing luxury experiences."
                alignment="center"
                className="[&>h2]:text-3xl md:[&>h2]:text-4xl [&>p]:text-sm mb-0"
              />
            </div>
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-sans text-center rounded">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="flex flex-col items-center justify-center mb-6">
                <label className="font-sans text-xs uppercase tracking-[0.2em] text-gray-500 mb-4">Overall Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                    >
                      <svg 
                        className={`w-9 h-9 transition-colors ${star <= (hoverRating || rating) ? 'text-gold fill-currentColor drop-shadow-sm' : 'text-gray-200'}`} 
                        fill="currentColor" viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block font-sans text-xs uppercase tracking-widest text-gray-500 mb-2">Your Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    required 
                    className="w-full bg-white border border-gray-200 px-4 py-3.5 text-sm font-sans focus:outline-none focus:border-gold transition-colors"
                    placeholder="e.g. Jessica B."
                  />
                </div>
                <div>
                  <label htmlFor="role" className="block font-sans text-xs uppercase tracking-widest text-gray-500 mb-2">Title or Occasion (Optional)</label>
                  <input 
                    type="text" 
                    id="role" 
                    name="role" 
                    className="w-full bg-white border border-gray-200 px-4 py-3.5 text-sm font-sans focus:outline-none focus:border-gold transition-colors"
                    placeholder="e.g. Model, Bride, CEO"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="comment" className="block font-sans text-xs uppercase tracking-widest text-gray-500 mb-2">Your Thoughts</label>
                <textarea 
                  id="comment" 
                  name="comment" 
                  required 
                  rows={5}
                  className="w-full bg-white border border-gray-200 px-4 py-3.5 text-sm font-sans focus:outline-none focus:border-gold transition-colors resize-none"
                  placeholder="Tell us about the service you received, the staff, and the atmosphere..."
                ></textarea>
              </div>

              <div className="pt-4">
                <Button type="submit" variant="primary" size="lg" fullWidth disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </Button>
              </div>
            </form>
            
            <p className="mt-8 text-center text-[10px] uppercase tracking-widest text-gray-400 font-sans border-t border-[#eaeaea] pt-6 relative z-10">
              Feedback goes directly to our management team for review. 
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
