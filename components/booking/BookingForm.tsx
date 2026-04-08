'use client';

import { useState, useRef, useMemo } from 'react';
import { createBooking } from '@/app/actions';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import type { BookingSettings } from '@/components/booking/BookingContext';

interface ServiceOption {
  id: string;
  name: string;
  price: number;
}

interface BookingFormProps {
  services: ServiceOption[];
  preSelectedServiceId: string;
  onClose?: () => void;
  bookingSettings?: BookingSettings;
}

const getFlagEmoji = (countryCode: string) => {
  if (!countryCode) return '';
  const codePoints = countryCode.toUpperCase().split('').map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

const COUNTRY_CODES = [
  // Primary (East Africa & Neighbors)
  { code: '+250', label: 'RW' },
  { code: '+254', label: 'KE' },
  { code: '+256', label: 'UG' },
  { code: '+257', label: 'BI' },
  { code: '+255', label: 'TZ' },
  { code: '+243', label: 'CD' },
  { code: '+211', label: 'SS' },
  { code: '+251', label: 'ET' },
  { code: '+252', label: 'SO' },
  { code: '+260', label: 'ZM' },
  { code: '+265', label: 'MW' },
  { code: '+258', label: 'MZ' },
  { code: '+263', label: 'ZW' },
  { code: '+27', label: 'ZA' },
  { code: '+264', label: 'NA' },
  { code: '+267', label: 'BW' },
  { code: '+244', label: 'AO' },
  { code: '+234', label: 'NG' },
  { code: '+233', label: 'GH' },
  { code: '+221', label: 'SN' },
  { code: '+225', label: 'CI' },
  { code: '+237', label: 'CM' },
  { code: '+20', label: 'EG' },
  { code: '+212', label: 'MA' },
  { code: '+216', label: 'TN' },
  { code: '+213', label: 'DZ' },
  // Americas
  { code: '+1', label: 'US/CA' },
  { code: '+52', label: 'MX' },
  { code: '+55', label: 'BR' },
  { code: '+54', label: 'AR' },
  { code: '+57', label: 'CO' },
  { code: '+56', label: 'CL' },
  { code: '+51', label: 'PE' },
  // Europe
  { code: '+44', label: 'UK' },
  { code: '+33', label: 'FR' },
  { code: '+32', label: 'BE' },
  { code: '+49', label: 'DE' },
  { code: '+31', label: 'NL' },
  { code: '+41', label: 'CH' },
  { code: '+39', label: 'IT' },
  { code: '+34', label: 'ES' },
  { code: '+46', label: 'SE' },
  { code: '+47', label: 'NO' },
  { code: '+45', label: 'DK' },
  { code: '+358', label: 'FI' },
  { code: '+353', label: 'IE' },
  { code: '+43', label: 'AT' },
  { code: '+351', label: 'PT' },
  { code: '+48', label: 'PL' },
  { code: '+420', label: 'CZ' },
  { code: '+36', label: 'HU' },
  { code: '+30', label: 'GR' },
  { code: '+90', label: 'TR' },
  // Middle East
  { code: '+971', label: 'UAE' },
  { code: '+966', label: 'SA' },
  { code: '+974', label: 'QA' },
  { code: '+965', label: 'KW' },
  { code: '+968', label: 'OM' },
  { code: '+973', label: 'BH' },
  { code: '+972', label: 'IL' },
  // Asia
  { code: '+86', label: 'CN' },
  { code: '+81', label: 'JP' },
  { code: '+82', label: 'KR' },
  { code: '+91', label: 'IN' },
  { code: '+92', label: 'PK' },
  { code: '+880', label: 'BD' },
  { code: '+94', label: 'LK' },
  { code: '+65', label: 'SG' },
  { code: '+60', label: 'MY' },
  { code: '+62', label: 'ID' },
  { code: '+66', label: 'TH' },
  { code: '+84', label: 'VN' },
  { code: '+63', label: 'PH' },
  // Oceania
  { code: '+61', label: 'AU' },
  { code: '+64', label: 'NZ' }
];

function ModernPickerField({ 
  type, 
  value, 
  onChange, 
  placeholder, 
  icon,
  min
}: { 
  type: 'date' | 'time'; 
  value: string; 
  onChange: (val: string) => void; 
  placeholder: string; 
  icon: React.ReactNode;
  min?: string;
}) {
  const displayValue = value ? (
    type === 'date' 
      ? new Date(value).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) 
      : (() => {
          const [h, m] = value.split(':');
          const hr = parseInt(h, 10);
          const ampm = hr >= 12 ? 'PM' : 'AM';
          const hr12 = hr % 12 || 12;
          return `${hr12}:${m} ${ampm}`;
        })()
  ) : placeholder;

  return (
    <div className="relative w-full group">
      <style dangerouslySetInnerHTML={{__html: `
        .picker-expand::-webkit-calendar-picker-indicator {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          width: 100%; height: 100%;
          opacity: 0; cursor: pointer;
        }
      `}} />
      <input 
        type={type}
        value={value}
        min={min}
        onChange={(e) => onChange(e.target.value)}
        className="picker-expand absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />
      <div className={`flex items-center justify-between w-full px-5 py-4 sm:py-5 border-[0.5px] transition-all duration-300 rounded-sm font-sans tracking-widest uppercase text-xs sm:text-sm ${
        value 
          ? 'border-gold bg-charcoal text-white shadow-xl' 
          : 'border-gray-300 bg-transparent text-gray-500 hover:border-gray-400 hover:bg-[#faf9f5]'
      }`}>
        <span className={value ? 'font-medium' : 'opacity-80'}>
          {displayValue}
        </span>
        <div className={value ? 'text-gold' : 'text-gray-400 group-hover:text-charcoal transition-colors'}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export function BookingForm({ services, preSelectedServiceId, onClose, bookingSettings }: BookingFormProps) {
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
  const [countryCode, setCountryCode] = useState('+250');
  const [isCountryModalOpen, setIsCountryModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const phoneInputRef = useRef<HTMLInputElement>(null);

  const [notes, setNotes] = useState('');
  const [touched, setTouched] = useState({ name: false, phone: false });

  const isPhoneValid = phone.length >= 7 && phone.length <= 15;
  const isNameValid = name.trim().length > 1;
  const canSubmit = isNameValid && isPhoneValid && !isSubmitting;

  const filteredCountries = useMemo(() => {
    if (!searchQuery) return COUNTRY_CODES;
    const query = searchQuery.toLowerCase();
    return COUNTRY_CODES.filter(c => c.label.toLowerCase().includes(query) || c.code.includes(query));
  }, [searchQuery]);

  const paginate = (newDirection: number) => {
    setPage([step + newDirection, newDirection]);
  };

  const handleNext = () => paginate(1);
  const handleBack = () => paginate(-1);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorPayload(null);

    const data = {
      name,
      phone: `${countryCode}${phone}`,
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
        <h2 className="font-playfair text-3xl sm:text-4xl text-charcoal">Booking Received</h2>
        <p className="font-sans text-gray-500 max-w-sm sm:max-w-md mx-auto leading-relaxed text-sm sm:text-base px-4">
          Thank you for choosing Mike Beauty Studio. 
          {bookingSettings && bookingSettings.depositAmount > 0 
            ? " Your booking will be confirmed once you have deposited the required amount. We will contact you via WhatsApp shortly." 
            : " Our team is reviewing your requested time slot. We will contact you via WhatsApp shortly to confirm."}
        </p>

        {/* Admin-set Booking Policies + MoMo Payment */}
        {bookingSettings && (bookingSettings.depositAmount > 0 || bookingSettings.momoNumber) && (
          <div className="w-full px-4 space-y-4 border-t border-[#eaeaea] pt-6">
            
            {/* MoMo Payment Card */}
            {bookingSettings.momoNumber && bookingSettings.depositAmount > 0 && (
              <div className="bg-[#faf9f5] border border-gold/30 rounded-sm p-5 text-left space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-gold text-lg">💳</span>
                  <p className="font-playfair text-base text-charcoal font-semibold">
                    Secure Your Slot — Pay Deposit
                  </p>
                </div>

                {/* Amount */}
                <div className="flex items-baseline gap-2">
                  <span className="font-playfair text-2xl text-gold font-bold">
                    {bookingSettings.depositAmount.toLocaleString()}
                  </span>
                  <span className="font-sans text-xs text-gray-500 uppercase tracking-widest">RWF</span>
                </div>

                {/* MoMo details box */}
                <div className="bg-white border border-[#eaeaea] rounded-sm p-4 space-y-2 font-sans text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-xs uppercase tracking-widest">Send To</span>
                    <span className="font-bold text-charcoal tracking-widest">{bookingSettings.momoNumber}</span>
                  </div>
                  {bookingSettings.momoName && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-xs uppercase tracking-widest">Name</span>
                      <span className="text-charcoal">{bookingSettings.momoName}</span>
                    </div>
                  )}
                </div>

                {/* Steps */}
                <ol className="space-y-2 font-sans text-xs text-gray-600 list-none">
                  <li className="flex gap-2 items-start">
                    <span className="w-5 h-5 rounded-full bg-gold/20 text-gold flex items-center justify-center font-bold shrink-0 text-[10px]">1</span>
                    <span>Open your <strong>MTN Mobile Money</strong> app or dial <strong>*182#</strong></span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <span className="w-5 h-5 rounded-full bg-gold/20 text-gold flex items-center justify-center font-bold shrink-0 text-[10px]">2</span>
                    <span>Select <strong>Transfer Money</strong> → <strong>Enter number</strong> above</span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <span className="w-5 h-5 rounded-full bg-gold/20 text-gold flex items-center justify-center font-bold shrink-0 text-[10px]">3</span>
                    <span>Enter <strong>{bookingSettings.depositAmount.toLocaleString()} RWF</strong> and confirm</span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <span className="w-5 h-5 rounded-full bg-gold/20 text-gold flex items-center justify-center font-bold shrink-0 text-[10px]">4</span>
                    <span>Screenshot your receipt and send it to us <strong>via WhatsApp</strong> to confirm your booking</span>
                  </li>
                </ol>
              </div>
            )}

            {/* Cancellation Policy */}
            {bookingSettings.cancellationPolicy && (
              <div className="flex items-start gap-3 text-left">
                <span className="text-gold mt-0.5 shrink-0">•</span>
                <p className="font-sans text-xs text-gray-500">
                  <strong className="text-charcoal">Cancellation Policy:</strong>{' '}
                  {bookingSettings.cancellationPolicy}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="pt-4 w-full px-4">
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

      <form className="flex-grow flex flex-col overflow-hidden relative" noValidate onSubmit={(e) => step === 3 ? handleSubmit(e) : e.preventDefault()}>
        
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
                <div className="flex flex-col gap-8 font-sans relative flex-grow justify-center py-4">
                  <div className="space-y-3">
                    <label className="text-xs sm:text-sm tracking-widest text-gray-400 uppercase px-1">
                      Date
                    </label>
                    <ModernPickerField 
                      type="date"
                      value={preferredDate}
                      onChange={setPreferredDate}
                      placeholder="Select Appointment Date"
                      min={new Date().toISOString().split('T')[0]}
                      icon={
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      }
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs sm:text-sm tracking-widest text-gray-400 uppercase px-1">
                      Time
                    </label>
                    <ModernPickerField 
                      type="time"
                      value={preferredTime}
                      onChange={setPreferredTime}
                      placeholder="Select Arrival Time"
                      icon={
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      }
                    />
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
                <div className="space-y-4 flex-grow py-4">
                  
                  {/* Name Pill */}
                  <div className="relative group pb-4">
                    <div className={`flex w-full bg-[#f8f8f8] border-b-2 rounded-t-sm transition-colors duration-300 ${
                        touched.name && !isNameValid 
                          ? 'border-red-400 focus-within:border-red-500' 
                          : 'border-[#eaeaea] focus-within:border-charcoal'
                      }`}>
                      <div className="flex flex-col relative w-full pt-6 pb-2 px-4">
                        <label htmlFor="name" className={`absolute left-4 top-2 text-[10px] tracking-widest uppercase transition-all duration-300 ${
                          touched.name && !isNameValid ? 'text-red-400' : 'text-gray-400 group-focus-within:text-charcoal'
                        }`}>
                          Full Name
                        </label>
                        <input 
                          id="name"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          onBlur={() => setTouched({ ...touched, name: true })}
                          placeholder="e.g. Amani Fadhili" 
                          className="bg-transparent w-full text-base sm:text-lg text-charcoal focus:outline-none placeholder-gray-300"
                        />
                      </div>
                    </div>
                    {touched.name && !isNameValid && (
                      <p className="text-[10px] text-red-400 mt-1 uppercase tracking-widest absolute bottom-0 left-0">Please enter your full name</p>
                    )}
                  </div>

                  {/* WhatsApp Pill */}
                  <div className="relative group pb-4">
                    <div className={`flex w-full bg-[#f8f8f8] border-b-2 rounded-t-sm transition-colors duration-300 ${
                        touched.phone && !isPhoneValid 
                          ? 'border-red-400 focus-within:border-red-500' 
                          : 'border-[#eaeaea] focus-within:border-charcoal'
                      }`}>
                      <div className="flex flex-col relative w-full pt-6 pb-2 px-4">
                        <label htmlFor="phone" className={`absolute left-4 top-2 text-[10px] tracking-widest uppercase transition-all duration-300 ${
                          touched.phone && !isPhoneValid ? 'text-red-400' : 'text-gray-400 group-focus-within:text-charcoal'
                        }`}>
                          WhatsApp Number
                        </label>
                        <div className="flex items-center gap-1 sm:gap-2">
                          <button 
                            type="button"
                            onClick={() => setIsCountryModalOpen(true)}
                            className="flex items-center gap-1.5 focus:outline-none pr-1 group/btn"
                          >
                            <span className="text-xl leading-none">{getFlagEmoji(COUNTRY_CODES.find(c => c.code === countryCode)?.label || 'RW')}</span>
                            <span className="text-charcoal/80 font-medium text-base sm:text-lg tracking-widest">{countryCode}</span>
                            <svg className="w-4 h-4 text-gray-400 group-hover/btn:text-charcoal transition-colors pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          <div className="w-[1px] h-5 bg-[#eaeaea] mx-1"></div>
                          <input 
                            id="phone"
                            type="tel"
                            ref={phoneInputRef}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                            onBlur={() => setTouched({ ...touched, phone: true })}
                            placeholder="7..."
                            className="bg-transparent w-full text-base sm:text-lg text-charcoal focus:outline-none placeholder-gray-300 tracking-widest"
                          />
                        </div>
                      </div>
                    </div>
                    {touched.phone && !isPhoneValid && (
                      <p className="text-[10px] text-red-400 mt-1 uppercase tracking-widest absolute bottom-0 left-0">Valid number required</p>
                    )}
                  </div>

                  {/* Notes Pill */}
                  <div className="relative group pb-4">
                    <div className="flex w-full bg-[#f8f8f8] border-b-2 rounded-t-sm border-[#eaeaea] focus-within:border-charcoal transition-colors duration-300">
                      <div className="flex flex-col relative w-full pt-6 pb-2 px-4">
                        <label htmlFor="notes" className="absolute left-4 top-2 text-[10px] tracking-widest uppercase text-gray-400 group-focus-within:text-charcoal transition-colors">
                          Special Notes <span className="opacity-60 lowercase">(optional)</span>
                        </label>
                        <input 
                          id="notes"
                          type="text"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="e.g. It's my first time..."
                          className="bg-transparent w-full text-base sm:text-lg text-charcoal focus:outline-none placeholder-gray-300"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 mt-auto grid grid-cols-2 gap-4">
                  <Button type="button" variant="outline" onClick={handleBack} fullWidth className="tracking-widest uppercase text-xs sm:text-sm h-12">
                    Back
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={!canSubmit}
                    fullWidth
                    className={`tracking-widest uppercase text-xs sm:text-sm h-12 flex items-center justify-center gap-2 transition-all duration-300 ${
                      canSubmit && !isSubmitting ? 'bg-charcoal text-white hover:bg-black border-transparent shadow-lg' : ''
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-inherit" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Loading</span>
                      </>
                    ) : 'Confirm Book'}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </form>

      {/* Searchable Country Modal Overlay */}
      <AnimatePresence>
        {isCountryModalOpen && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute inset-0 z-50 bg-white flex flex-col h-full rounded-sm shadow-2xl overflow-hidden"
          >
            {/* Search Header */}
            <div className="flex-none p-4 border-b border-[#eaeaea] bg-white text-charcoal flex items-center gap-3">
              <button 
                type="button" 
                onClick={() => setIsCountryModalOpen(false)}
                className="p-2 hover:bg-[#f8f8f8] rounded-full transition-colors focus:outline-none"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="flex-grow relative">
                <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input 
                  type="text" 
                  autoFocus
                  placeholder="Search country..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#f8f8f8] border border-transparent focus:border-[#eaeaea] focus:bg-white focus:outline-none rounded-md py-2 pl-9 pr-4 text-sm font-sans text-charcoal transition-all placeholder-gray-400"
                />
              </div>
            </div>

            {/* Scrolling List */}
            <div className="flex-grow overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <style dangerouslySetInnerHTML={{__html: `::-webkit-scrollbar { display: none; }`}} />
              {filteredCountries.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-xs tracking-widest uppercase font-sans">
                  No matches found
                </div>
              ) : (
                filteredCountries.map((country, idx) => (
                  <button
                    key={`${country.code}-${idx}`}
                    type="button"
                    onClick={() => {
                      setCountryCode(country.code);
                      setIsCountryModalOpen(false);
                      setSearchQuery('');
                      setTimeout(() => phoneInputRef.current?.focus(), 100);
                    }}
                    className="w-full flex items-center justify-between h-[48px] px-4 border-b border-[#eaeaea]/50 hover:bg-[#faf9f5] focus:bg-[#faf9f5] focus:outline-none transition-colors group text-left"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-[22px] leading-none">{getFlagEmoji(country.label)}</span>
                      <span className="text-charcoal font-medium font-sans text-base">{country.label}</span>
                    </div>
                    <span className="text-gray-400 group-hover:text-gold text-sm tracking-widest font-sans transition-colors">
                      {country.code}
                    </span>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
