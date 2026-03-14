'use client';

import { useState } from 'react';
import { saveSettings } from '@/app/actions/adminSettings';
import { Button } from '@/components/ui/Button';

// Utility component to render a form field
function SettingField({ 
  label, 
  name, 
  defaultValue, 
  type = 'text', 
  placeholder = '' 
}: { 
  label: string; 
  name: string; 
  defaultValue: string; 
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-gray-400 uppercase tracking-wider text-xs font-sans">
        {label}
      </label>
      {type === 'textarea' ? (
        <textarea
          name={name}
          defaultValue={defaultValue}
          placeholder={placeholder}
          rows={4}
          className="w-full bg-[#2a2a2a] border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-gold transition-colors font-sans resize-none"
        />
      ) : (
        <input
          type={type}
          name={name}
          defaultValue={defaultValue}
          placeholder={placeholder}
          className="w-full bg-[#2a2a2a] border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-gold transition-colors font-sans"
        />
      )}
    </div>
  );
}

export function SettingsEditor({ initialSettings }: { initialSettings: Record<string, string> }) {
  const [activeTab, setActiveTab] = useState<'GENERAL' | 'BOOKING' | 'SOCIAL'>('GENERAL');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setIsSaving(true);
    setMessage(null);
    
    const result = await saveSettings(activeTab, formData);
    
    setIsSaving(false);
    if (result.success) {
      setMessage({ type: 'success', text: 'Settings saved successfully.' });
      setTimeout(() => setMessage(null), 3000);
    } else {
      setMessage({ type: 'error', text: result.error || 'An error occurred.' });
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      
      {/* Sidebar Tabs */}
      <div className="w-full md:w-48 flex flex-col gap-2">
        {(['GENERAL', 'BOOKING', 'SOCIAL'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setMessage(null);
            }}
            className={`text-left px-4 py-3.5 font-sans text-sm tracking-wide transition-colors border-l-2 ${
              activeTab === tab 
                ? 'bg-white/10 text-gold border-gold' 
                : 'text-gray-400 hover:text-white border-transparent hover:bg-white/5'
            }`}
          >
            {tab.charAt(0) + tab.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Editor Content */}
      <div className="flex-1">
        
        {message && (
          <div className={`mb-6 p-4 text-sm font-sans ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
            {message.text}
          </div>
        )}

        {/* General Settings */}
        {activeTab === 'GENERAL' && (
          <form action={handleSubmit} className="space-y-6 animate-fade-in-up">
            <h3 className="font-playfair text-2xl text-white mb-6">Contact & Studio Information</h3>
            
            <SettingField label="WhatsApp Number" name="WHATSAPP_NUMBER" defaultValue={initialSettings['WHATSAPP_NUMBER'] || '+250788000000'} placeholder="e.g. +250 788 000 000" />
            <SettingField label="Primary Phone Number" name="PHONE_NUMBER" defaultValue={initialSettings['PHONE_NUMBER'] || '+250788000000'} placeholder="e.g. +250 788 000 000" />
            <SettingField label="Support Email" name="CONTACT_EMAIL" defaultValue={initialSettings['CONTACT_EMAIL'] || 'hello@mikebeautystudio.rw'} type="email" />
            <SettingField label="Studio Physical Address" name="STUDIO_ADDRESS" defaultValue={initialSettings['STUDIO_ADDRESS'] || '123 Beauty Lane, KN 5 Rd. Kigali, Rwanda'} />
            
            <SettingField label="Weekday Hours (Mon-Fri)" name="HOURS_WEEKDAY" defaultValue={initialSettings['HOURS_WEEKDAY'] || '9:00 AM - 7:00 PM'} />
            <SettingField label="Weekend Hours (Sat)" name="HOURS_WEEKEND" defaultValue={initialSettings['HOURS_WEEKEND'] || '10:00 AM - 6:00 PM'} />
            
            <div className="pt-4 border-t border-white/10">
              <Button type="submit" variant="primary" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save General Settings'}
              </Button>
            </div>
          </form>
        )}

        {/* Booking Rules */}
        {activeTab === 'BOOKING' && (
          <form action={handleSubmit} className="space-y-6 animate-fade-in-up">
            <h3 className="font-playfair text-2xl text-white mb-6">Booking Flow Preferences</h3>
            
            <SettingField 
              label="Cancellation Policy Text" 
              name="CANCELLATION_POLICY" 
              type="textarea"
              defaultValue={initialSettings['CANCELLATION_POLICY'] || 'Please provide at least 24 hours notice for any cancellations. Late cancellations may be subject to a 50% fee.'} 
            />
            <SettingField label="Required Deposit Amount (RWF)" name="DEPOSIT_REQUIRED" defaultValue={initialSettings['DEPOSIT_REQUIRED'] || '10000'} type="number" />
            
            <div className="pt-4 border-t border-white/10">
              <Button type="submit" variant="primary" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Booking Rules'}
              </Button>
            </div>
          </form>
        )}

        {/* Social & SEO */}
        {activeTab === 'SOCIAL' && (
          <form action={handleSubmit} className="space-y-6 animate-fade-in-up">
            <h3 className="font-playfair text-2xl text-white mb-6">Social Links & SEO</h3>
            
            <SettingField label="Instagram Profile URL" name="INSTAGRAM_URL" defaultValue={initialSettings['INSTAGRAM_URL'] || 'https://instagram.com/mikebeautystudio'} />
            <SettingField label="Default SEO Description" name="SEO_DESCRIPTION" defaultValue={initialSettings['SEO_DESCRIPTION'] || 'Award-winning luxury beauty studio offering classic, hybrid, volume, and mega volume eyelash extensions in Kigali, Rwanda.'} type="textarea" />
            
            <div className="pt-4 border-t border-white/10">
              <Button type="submit" variant="primary" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save SEO Configurations'}
              </Button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
