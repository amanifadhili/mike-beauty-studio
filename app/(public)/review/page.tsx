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
    <div className="min-h-[calc(100vh-80px)] bg-[#FAFAFA] relative z-10 pt-24 pb-16 flex items-center justify-center">
      
      {/* Centered Form Panel */}
      <div className="w-full max-w-2xl px-4 sm:px-6">
        <div className="w-full mt-4 md:mt-0">
          
          {isSuccess ? (
            <div className="bg-white p-12 md:p-16 border border-[#eaeaea] text-center shadow-2xl shadow-charcoal/5 animate-fade-in-up">
              <div className="w-20 h-20 bg-gold/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-gold/20">
                <svg className="w-10 h-10 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7" /></svg>
              </div>
              <h2 className="font-playfair text-3xl md:text-4xl text-charcoal mb-4 tracking-wide">Thank You!</h2>
              <p className="font-sans text-gray-500 leading-relaxed text-[15px]">
                Your feedback means the world to us. We truly appreciate you taking the time to share your experience with Mike Beauty Studio!
              </p>
            </div>
          ) : (
            <div className="bg-white p-8 md:p-14 border border-[#eaeaea] shadow-2xl shadow-black/5 relative overflow-hidden transition-all duration-500">
              {/* Subtle decorative background accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/[0.03] rounded-bl-full pointer-events-none -mt-4 -mr-4" />
              
              <div className="text-center mb-12 relative z-10">
                <SectionHeading 
                  title="Share Your Experience"
                  subtitle="We take pride in our artistry. Please rate your service and share your thoughts to help us continue providing luxury experiences."
                  alignment="center"
                  className="[&>h2]:text-3xl md:[&>h2]:text-4xl [&>h1]:text-3xl md:[&>h1]:text-4xl [&>p]:text-[13px] md:[&>p]:text-sm mb-0"
                  isH1={true}
                />
              </div>
              
              {error && (
                <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 text-[13px] tracking-wide font-sans text-center rounded">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-7 relative z-10">
                
                {/* Rating Stars Section */}
                <div className="flex flex-col items-center justify-center mb-8 pb-8 border-b border-[#eaeaea]">
                  <label className="font-sans text-[11px] uppercase tracking-[0.2em] text-gray-400 mb-5">Overall Rating</label>
                  <div className="flex gap-3">
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
                          className={`w-10 h-10 transition-all duration-300 ${star <= (hoverRating || rating) ? 'text-gold fill-currentColor drop-shadow-sm scale-110' : 'text-gray-200 hover:text-gray-300'}`} 
                          fill="currentColor" viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name & Role Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="group">
                    <label htmlFor="name" className="block font-sans text-[10px] uppercase tracking-widest text-gray-500 mb-2 group-focus-within:text-gold transition-colors">Your Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      required 
                      className="w-full bg-[#f8f8f8] border border-transparent focus:bg-white focus:border-gold px-4 py-4 text-[13px] font-sans transition-all duration-300 outline-none"
                      placeholder="e.g. Jessica B."
                    />
                  </div>
                  <div className="group">
                    <label htmlFor="role" className="block font-sans text-[10px] uppercase tracking-widest text-gray-500 mb-2 group-focus-within:text-gold transition-colors">Title / Occasion (Optional)</label>
                    <input 
                      type="text" 
                      id="role" 
                      name="role" 
                      className="w-full bg-[#f8f8f8] border border-transparent focus:bg-white focus:border-gold px-4 py-4 text-[13px] font-sans transition-all duration-300 outline-none"
                      placeholder="e.g. Model, Bride, CEO"
                    />
                  </div>
                </div>
                
                {/* Comment Textarea */}
                <div className="group">
                  <label htmlFor="comment" className="block font-sans text-[10px] uppercase tracking-widest text-gray-500 mb-2 group-focus-within:text-gold transition-colors">Your Thoughts</label>
                  <textarea 
                    id="comment" 
                    name="comment" 
                    required 
                    rows={5}
                    className="w-full bg-[#f8f8f8] border border-transparent focus:bg-white focus:border-gold px-4 py-4 text-[13px] font-sans transition-all duration-300 outline-none resize-none leading-relaxed"
                    placeholder="Tell us about the service you received, the staff, and the atmosphere..."
                  ></textarea>
                </div>

                <div className="pt-6">
                  <Button type="submit" variant="primary" size="lg" fullWidth disabled={isSubmitting} className="tracking-widest py-4 text-[13px]">
                    {isSubmitting ? 'SUBMITTING...' : 'SUBMIT FEEDBACK'}
                  </Button>
                </div>
              </form>
              
              <p className="mt-10 text-center text-[10px] uppercase tracking-widest text-gray-400 font-sans border-t border-[#eaeaea] pt-6 relative z-10">
                Feedback goes directly to our management team for review. 
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
