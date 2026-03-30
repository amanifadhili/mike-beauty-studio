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
  onClose?: () => void;
}

export function BookingForm({ services, preSelectedServiceId, onClose }: BookingFormProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorPayload, setErrorPayload] = useState<string | null>(null);

  // Form State
  const [selectedService, setSelectedService] = useState(preSelectedServiceId || '');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  const timeSlots = ["09:00", "11:00", "13:30", "15:30", "17:30"];
  
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${ampm}`;
  };

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorPayload(null);

    const data = {
      name,
      phone,
      serviceId: selectedService,
      preferredDate: new Date(preferredDate),
      preferredTime,
      notes,
    };

    try {
      const response = await createBooking(data);
      if (response.success) {
        setIsSuccess(true);
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
      <div className="flex flex-col items-center justify-center text-center h-full sm:py-12 space-y-6 animate-fade-in-up w-full">
        <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="font-playfair text-2xl sm:text-3xl text-charcoal">Request Received</h2>
        <p className="font-sans text-gray-600 max-w-sm sm:max-w-md mx-auto leading-relaxed text-sm lg:text-base px-4">
          Thank you for choosing Mike Beauty Studio. Our team is reviewing your requested time slot. 
          We will contact you via WhatsApp shortly.
        </p>
        <div className="pt-8 w-full sm:w-auto px-4">
          <Button variant="outline" fullWidth onClick={() => onClose ? onClose() : window.location.href = '/'}>
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Step Indicator */}
      <div className="flex items-center justify-between mb-6 sm:mb-8 relative">
        <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-[#eaeaea] -z-10"></div>
        {[1, 2, 3].map((s) => (
          <div 
            key={s} 
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-sans text-xs sm:text-sm transition-colors duration-300 ${
              step >= s ? 'bg-gold text-charcoal shadow-md' : 'bg-cream text-gray-400 border border-[#eaeaea]'
            }`}
          >
            {s}
          </div>
        ))}
      </div>

      <form onSubmit={(e) => step === 3 ? handleSubmit(e) : e.preventDefault()}>
        
        {errorPayload && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-sm font-sans mb-6">
            {errorPayload}
          </div>
        )}

        {/* Step 1: Select Treatment */}
        {step === 1 && (
          <div className="space-y-4 sm:space-y-6 animate-fade-in-up">
            <div className="text-center sm:text-left mb-4">
              <h3 className="font-playfair text-lg sm:text-xl text-charcoal">Select Treatment</h3>
              <p className="font-sans text-xs sm:text-sm text-gray-500 mt-1">Choose the service you would like to book today.</p>
            </div>
            
            <div className="flex flex-wrap gap-2 sm:gap-3 max-h-[50vh] sm:max-h-none overflow-y-auto pr-1 pb-1 custom-scrollbar">
              {services.map(service => (
                <div 
                  key={service.id}
                  onClick={() => setSelectedService(service.id)}
                  className={`cursor-pointer py-2 px-3 border rounded-none flex items-center gap-2 transition-all duration-300 group ${
                    selectedService === service.id 
                      ? 'border-gold bg-gold text-charcoal shadow-sm' 
                      : 'border-[#eaeaea] hover:border-gold hover:bg-gray-50 bg-white text-gray-600'
                  }`}
                >
                  <span className="font-sans text-xs sm:text-sm whitespace-nowrap">
                    {service.name}
                  </span>
                  <span className={`text-[10px] sm:text-xs tracking-wider whitespace-nowrap ${selectedService === service.id ? 'text-charcoal' : 'text-gold'}`}>
                    • {service.price.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-6">
              <Button 
                type="button" 
                variant="primary" 
                fullWidth
                disabled={!selectedService}
                onClick={handleNext}
              >
                Continue to Dates
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Date and Time */}
        {step === 2 && (
          <div className="space-y-4 sm:space-y-6 animate-fade-in-up">
            <div className="text-center sm:text-left mb-4">
              <h3 className="font-playfair text-lg sm:text-xl text-charcoal">Date & Time</h3>
              <p className="font-sans text-xs sm:text-sm text-gray-500 mt-1">Please select your preferred arrival slot.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="flex flex-col gap-1 font-sans relative">
                 <label htmlFor="preferredDate" className="text-xs sm:text-sm tracking-widest text-gray-400 uppercase">
                  Select Date
                </label>
                <input 
                  id="preferredDate"
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full bg-transparent border-b border-[#eaeaea] px-0 py-2 sm:py-3 text-sm sm:text-base text-charcoal focus:outline-none focus:border-gold transition-colors duration-300"
                />
              </div>

              <div className="flex flex-col gap-2 font-sans relative">
                <label className="text-xs sm:text-sm tracking-widest text-gray-400 uppercase mb-1">
                  Select Arrival Time
                </label>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {timeSlots.map(time => (
                    <div
                      key={time}
                      onClick={() => setPreferredTime(time)}
                      className={`cursor-pointer border py-2 px-1 text-center text-[11px] sm:text-xs tracking-wider transition-all duration-300 ${
                        preferredTime === time 
                          ? 'border-gold bg-gold text-charcoal font-medium shadow-sm' 
                          : 'border-[#eaeaea] text-gray-600 hover:border-gold/50 hover:text-charcoal bg-white'
                      }`}
                    >
                      {formatTime(time)}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 grid grid-cols-2 gap-4">
              <Button type="button" variant="outline" onClick={handleBack} fullWidth>
                Back
              </Button>
              <Button 
                type="button" 
                variant="primary" 
                disabled={!preferredDate || !preferredTime}
                onClick={handleNext} 
                fullWidth
              >
                Final Details
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Client Details */}
        {step === 3 && (
          <div className="space-y-4 sm:space-y-6 animate-fade-in-up">
            <div className="text-center sm:text-left mb-4">
              <h3 className="font-playfair text-lg sm:text-xl text-charcoal">Your Details</h3>
              <p className="font-sans text-xs sm:text-sm text-gray-500 mt-1">Almost done. We just need your contact information to confirm your slot.</p>
            </div>

            <div className="space-y-4">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div className="flex flex-col gap-1 font-sans relative">
                  <label htmlFor="name" className="text-xs sm:text-sm tracking-widest text-gray-400 uppercase">
                    Full Name
                  </label>
                  <input 
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="E.g. Amani Fadhili"
                    className="w-full bg-transparent border-b border-[#eaeaea] px-0 py-2 sm:py-3 text-sm sm:text-base text-charcoal focus:outline-none focus:border-gold transition-colors duration-300"
                    required
                  />
                </div>

                 <div className="flex flex-col gap-1 font-sans relative">
                  <label htmlFor="phone" className="text-xs sm:text-sm tracking-widest text-gray-400 uppercase">
                    WhatsApp Number
                  </label>
                  <input 
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+250 7..."
                    className="w-full bg-transparent border-b border-[#eaeaea] px-0 py-2 sm:py-3 text-sm sm:text-base text-charcoal focus:outline-none focus:border-gold transition-colors duration-300"
                    required
                  />
                </div>
              </div>

               <div className="flex flex-col gap-1 font-sans relative pb-2">
                <label htmlFor="notes" className="text-xs sm:text-sm tracking-widest text-gray-400 uppercase">
                  Special Notes (Optional)
                </label>
                <textarea 
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="E.g., It's my first time..."
                  rows={1}
                  className="w-full bg-transparent border-b border-[#eaeaea] px-0 py-2 sm:py-3 text-sm sm:text-base text-charcoal focus:outline-none focus:border-gold transition-colors duration-300 resize-none"
                />
              </div>
            </div>

            <div className="pt-2 grid grid-cols-2 gap-4">
              <Button type="button" variant="outline" onClick={handleBack} fullWidth>
                Back
              </Button>
              <Button 
                type="submit" 
                variant="primary" 
                disabled={!name || !phone || isSubmitting}
                fullWidth
              >
                {isSubmitting ? 'Sending...' : 'Confirm Book'}
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
