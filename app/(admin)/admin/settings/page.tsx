import { getSettings } from '@/lib/settings';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SettingsEditor } from '@/components/admin/SettingsEditor';

export const metadata = {
  title: 'Global Settings | Mike Beauty Studio Admin',
};

// Force dynamic so we always fetch the latest settings
export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  // Fetch existing settings mapping
  const currentSettings = await getSettings();

  return (
    <div className="animate-fade-in-up space-y-8">
      
      <SectionHeading 
        title="Application Settings"
        subtitle="Manage the global configuration for your public-facing website."
      />

      <div className="bg-[#1a1a1a] border border-white/5 p-6 rounded-lg">
        <SettingsEditor initialSettings={currentSettings} />
      </div>

    </div>
  );
}
