'use client';

import { useState, useMemo } from 'react';
import { createBooking } from '@/app/actions';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [[step, direction], setPage] = useState([1, 0]);
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

  const paginate = (newDirection: number) => {
    setPage([step + newDirection, newDirection]);
  };

  const handleNext = () => paginate(1);
  const handleBack = () => paginate(-1);

  // Generate elegant 30-day horizontal date selector
  const dateOptions = useMemo(() => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      dates.push(d);
    }
    return dates;
  }, []);

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

  // Slide Animation Variants
  const variants = {
    enter: (direction: number) => {
      return {
        x: direction > 0 ? 40 : -40,
        opacity: 0
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => {
      return {
        zIndex: 0,
        x: direction < 0 ? 40 : -40,
        opacity: 0
      };
    }
  };

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="flex flex-col items-center justify-center text-center h-full sm:py-12 space-y-6 w-full"
      >
        <div className="w-20 h-20 rounded-full border border-gold/30 flex items-center justify-center mb-4 relative before:absolute before:inset-0 before:bg-gold/5 before:rounded-full before:scale-110">
          <svg className="w-8 h-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="font-playfair text-3xl sm:text-4xl text-charcoal">Request Received</h2>
        <p className="font-sans text-gray-500 max-w-sm sm:max-w-md mx-auto leading-relaxed text-sm sm:text-base px-4">
          Thank you for choosing Mike Beauty Studio. Our team is reviewing your requested time slot. 
          We will contact you via WhatsApp shortly to confirm.
        </p>
        <div className="pt-8 w-full px-4">
          <Button variant="outline" fullWidth onClick={() => onClose ? onClose() : window.location.href = '/'}>
            Return Home
          </Button>
        </div>
      </motion.div>
    );
  }

  const stepTitles = ["Select Treatment", "Date & Time", "Client Details"];

  return (
    <div className="w-full flex flex-col h-full relative">
      
      {/* Editorial Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3 text-xs sm:text-sm font-sans uppercase tracking-widest text-gray-400">
          <span>{`0${step}`} / 03</span>
          <span className="text-charcoal font-medium">{stepTitles[step - 1]}</span>
        </div>
        <div className="w-full h-[1px] bg-[#eaeaea] relative">
          <motion.div 
            className="absolute top-0 left-0 h-[1px] bg-gold"
            initial={{ width: `${((step - 1) / 3) * 100}%` }}
            animate={{ width: `${(step / 3) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
      </div>

      <form className="flex-grow flex flex-col overflow-hidden relative" onSubmit={(e) => step === 3 ? handleSubmit(e) : e.preventDefault()}>
        
        {errorPayload && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-sm font-sans mb-6">
            {errorPayload}
          </div>
        )}

        <div className="relative flex-grow h-full">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            
            {/* Step 1: Select Treatment */}
            {step === 1 && (
              <motion.div
                key="step1"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                className="space-y-6 w-full h-full flex flex-col"
              >
                <div 
                  className="flex flex-col gap-4 overflow-y-auto pr-4 pb-8 h-full"
                  style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#eaeaea transparent',
                  }}
                >
                  {services.map(service => (
                    <div 
                      key={service.id}
                      onClick={() => setSelectedService(service.id)}
                      className={`cursor-pointer px-6 py-5 sm:px-8 sm:py-6 border transition-all duration-300 relative group rounded-sm ${
                        selectedService === service.id 
                          ? 'border-gold bg-gold/5 shadow-md' 
                          : 'border-[#eaeaea] hover:border-gold hover:bg-[#faf9f5] bg-white'
                      }`}
                    >
                      <div className="flex justify-between items-center relative z-10">
                        <span className={`font-playfair text-lg sm:text-xl font-bold leading-normal transition-colors pb-1 ${
                          selectedService === service.id ? 'text-charcoal' : 'text-charcoal/90 group-hover:text-charcoal'
                        }`}>
                          {service.name}
                        </span>
                        <span className={`text-sm sm:text-base font-sans tracking-widest whitespace-nowrap transition-colors ${
                          selectedService === service.id ? 'text-gold font-semibold' : 'text-gray-400 group-hover:text-gold'
                        }`}>
                          {service.price.toLocaleString()} RWF
                        </span>
                      </div>
                      
                      {/* Premium Check Indicator */}
                      {selectedService === service.id && (
                        <motion.div 
                          layoutId="selectedIndicator"
                          className="absolute -right-2 -top-2 w-8 h-8 bg-gold/10 rounded-full flex items-center justify-center p-[10px]"
                        >
                          <svg className="w-3 h-3 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="pt-4 mt-auto">
                  <Button 
                    type="button" 
                    variant="primary" 
                    fullWidth
                    disabled={!selectedService}
                    onClick={handleNext}
                  >
                    Select Dates
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Date and Time */}
            {step === 2 && (
              <motion.div
                key="step2"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                className="space-y-8 w-full flex flex-col h-full"
              >
                <div className="flex flex-col gap-3 font-sans relative">
                  <label className="text-xs sm:text-sm tracking-widest text-gray-400 uppercase">
                    Select Day
                  </label>
                  
                  {/* Premium Horizontal Date Selector */}
                  <div className="flex overflow-x-auto gap-3 pb-4 pt-1 px-1 custom-scrollbar snap-x">
                    {dateOptions.map((date) => {
                      const dateStr = date.toISOString().split('T')[0];
                      const isSelected = preferredDate === dateStr;
                      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                      const dayNumber = date.getDate();
                      
                      return (
                        <div 
                          key={dateStr}
                          onClick={() => setPreferredDate(dateStr)}
                          className={`flex flex-col items-center justify-center w-16 h-[80px] sm:w-[72px] sm:h-[88px] border transition-all duration-300 cursor-pointer shrink-0 snap-start ${
                            isSelected 
                              ? 'border-gold bg-gold text-charcoal shadow-md' 
                              : 'border-[#eaeaea] hover:border-gold/50 text-gray-600 bg-white'
                          }`}
                        >
                          <span className={`text-[10px] sm:text-xs uppercase tracking-wider mb-1 ${isSelected ? 'text-charcoal/80' : 'text-gray-400'}`}>
                            {dayName}
                          </span>
                          <span className={`font-playfair text-xl sm:text-2xl ${isSelected ? 'font-medium' : ''}`}>
                            {dayNumber}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="flex flex-col gap-3 font-sans relative">
                  <label className="text-xs sm:text-sm tracking-widest text-gray-400 uppercase">
                    Select Arrival Time
                  </label>
                  <div className="grid grid-cols-3 gap-3 sm:gap-4">
                    {timeSlots.map(time => (
                      <div
                        key={time}
                        onClick={() => setPreferredTime(time)}
                        className={`cursor-pointer border py-3 sm:py-4 px-2 text-center text-xs sm:text-sm tracking-widest transition-all duration-300 ${
                          preferredTime === time 
                            ? 'border-gold bg-gold/5 text-charcoal font-medium shadow-sm ring-1 ring-gold/20' 
                            : 'border-[#eaeaea] text-gray-500 hover:border-gold/50 hover:text-charcoal bg-white'
                        }`}
                      >
                        {formatTime(time)}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-8 mt-auto grid grid-cols-2 gap-4">
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
                    Your Details
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Client Details */}
            {step === 3 && (
              <motion.div
                key="step3"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                className="space-y-6 w-full flex flex-col h-full"
              >
                <div className="space-y-6 sm:space-y-8 flex-grow">
                  
                  {/* Sleek Floating-style inputs via bottom-border transitions */}
                  <div className="flex flex-col gap-2 relative group pt-2">
                    <label htmlFor="name" className="text-xs sm:text-sm tracking-widest text-gray-400 uppercase transition-colors group-focus-within:text-charcoal">
                      Full Name
                    </label>
                    <input 
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="E.g. Amani Fadhili" // Optional floating style can go here
                      className="w-full bg-transparent border-b border-[#eaeaea] px-0 py-2 sm:py-3 text-base sm:text-lg text-charcoal font-sans placeholder-gray-300 focus:outline-none focus:border-gold transition-colors duration-300"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-2 relative group pt-2">
                    <label htmlFor="phone" className="text-xs sm:text-sm tracking-widest text-gray-400 uppercase transition-colors group-focus-within:text-charcoal">
                      WhatsApp Number
                    </label>
                    <input 
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+250 7..."
                      className="w-full bg-transparent border-b border-[#eaeaea] px-0 py-2 sm:py-3 text-base sm:text-lg text-charcoal font-sans placeholder-gray-300 focus:outline-none focus:border-gold transition-colors duration-300"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-2 relative group pt-2">
                    <label htmlFor="notes" className="text-xs sm:text-sm tracking-widest text-gray-400 uppercase transition-colors group-focus-within:text-charcoal">
                      Special Notes <span className="text-gray-300 lowercase">(Optional)</span>
                    </label>
                    <textarea 
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="E.g., It's my first time..."
                      rows={2}
                      className="w-full bg-transparent border-b border-[#eaeaea] px-0 py-2 sm:py-3 text-sm sm:text-base text-charcoal font-sans placeholder-gray-300 focus:outline-none focus:border-gold transition-colors duration-300 resize-none"
                    />
                  </div>
                </div>

                <div className="pt-6 mt-auto grid grid-cols-2 gap-4">
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </form>
    </div>
  );
}
