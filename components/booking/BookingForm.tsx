'use client';

import { useState } from 'react';
import { createBooking } from '@/app/actions';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface ServiceOption {
  id: string;
  name: string;
  price: number;
}

interface BookingFormProps {
  services: ServiceOption[];
  preSelectedServiceId: string;
}

export function BookingForm({ services, preSelectedServiceId }: BookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorPayload, setErrorPayload] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorPayload(null);

    const formData = new FormData(e.currentTarget);
    
    // Format the date explicitly from the HTML5 input
    const dateValue = formData.get('preferredDate') as string;
    
    const data = {
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      serviceId: formData.get('serviceId') as string,
      preferredDate: new Date(dateValue),
      preferredTime: formData.get('preferredTime') as string,
      notes: formData.get('notes') as string,
    };

    try {
      const response = await createBooking(data);
      if (response.success) {
        setIsSuccess(true);
        // Usually, here you might redirect to a thank-you page or trigger an email.
        // But throwing a local success state is much faster UX.
      } else {
        setErrorPayload(response.error || 'Something went wrong.');
      }
    } catch (err) {
      console.error(err);
      setErrorPayload('A network error occurred. Please try again or book via WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center text-center h-full py-12 space-y-6 animate-fade-in-up">
        <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="font-playfair text-3xl text-gold">Request Received</h2>
        <p className="font-sans text-gray-300 max-w-md mx-auto leading-relaxed">
          Thank you for choosing Mike Beauty Studio. Our team is reviewing your requested time slot. 
          We will contact you via WhatsApp shortly to confirm your booking and arrange the 20% deposit.
        </p>
        <div className="pt-8">
          <Button variant="outline" onClick={() => window.location.href = '/'}>
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {errorPayload && (
        <div className="p-4 bg-red-900/40 border border-red-500/50 text-red-200 text-sm font-sans mb-6">
          {errorPayload}
        </div>
      )}

      <div className="space-y-6">
        <Input 
          id="name"
          name="name"
          label="Full Name *"
          required
          placeholder="e.g. Amani Fadhili"
        />
        
        <Input 
          id="phone"
          name="phone"
          type="tel"
          label="WhatsApp Phone Number *"
          required
          placeholder="+250 7..."
        />

        {/* Custom Select styling to match Input component style */}
        <div className="flex flex-col gap-2 font-sans relative">
          <label htmlFor="serviceId" className="text-sm tracking-wider text-gray-300 uppercase">
            Desired Service *
          </label>
          <select 
            id="serviceId"
            name="serviceId"
            required
            defaultValue={preSelectedServiceId}
            className="w-full bg-transparent border-b border-gray-600 px-0 py-3 text-cream-white focus:outline-none focus:border-gold focus:ring-0 transition-colors duration-300 appearance-none rounded-none"
          >
            <option value="" disabled className="bg-charcoal text-gray-500">Select a treatment...</option>
            {services.map(service => (
              <option key={service.id} value={service.id} className="bg-[#2a2a2a] text-white">
                {service.name} ({service.price.toLocaleString()} RWF)
              </option>
            ))}
          </select>
          {/* Custom dropdown arrow */}
          <div className="pointer-events-none absolute right-2 bottom-4 text-gray-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input 
            id="preferredDate"
            name="preferredDate"
            type="date"
            label="Preferred Date *"
            required
            // Prevent booking in the past
            min={new Date().toISOString().split('T')[0]}
            className="w-full"
            style={{ colorScheme: 'dark' }}
          />

          <div className="flex flex-col gap-2 font-sans relative">
            <label htmlFor="preferredTime" className="text-sm tracking-wider text-gray-300 uppercase">
              Preferred Time *
            </label>
            <select 
              id="preferredTime"
              name="preferredTime"
              required
              className="w-full bg-transparent border-b border-gray-600 px-0 py-3 text-cream-white focus:outline-none focus:border-gold focus:ring-0 transition-colors duration-300 appearance-none rounded-none"
            >
              <option value="" disabled className="bg-charcoal text-gray-500">Pick a slot</option>
              <option value="09:00" className="bg-[#2a2a2a] text-white">09:00 AM</option>
              <option value="11:00" className="bg-[#2a2a2a] text-white">11:00 AM</option>
              <option value="13:30" className="bg-[#2a2a2a] text-white">01:30 PM</option>
              <option value="15:30" className="bg-[#2a2a2a] text-white">03:30 PM</option>
              <option value="17:30" className="bg-[#2a2a2a] text-white">05:30 PM</option>
            </select>
             {/* Custom dropdown arrow */}
            <div className="pointer-events-none absolute right-2 bottom-4 text-gray-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 font-sans">
          <label htmlFor="notes" className="text-sm tracking-wider text-gray-300 uppercase">
            Special Requests (Optional)
          </label>
          <textarea 
            id="notes"
            name="notes"
            rows={3}
            className="w-full bg-transparent border-b border-gray-600 px-0 py-3 text-cream-white focus:outline-none focus:border-gold focus:ring-0 transition-colors duration-300 resize-none rounded-none placeholder-gray-600"
            placeholder="E.g., I have sensitive eyes, or this is for a wedding..."
          />
        </div>

      </div>

      <div className="pt-6">
        <Button 
          type="submit" 
          variant="primary" 
          disabled={isSubmitting}
          className="w-full py-5 text-lg"
        >
          {isSubmitting ? 'Processing Request...' : 'Submit Booking Request'}
        </Button>
      </div>

    </form>
  );
}
