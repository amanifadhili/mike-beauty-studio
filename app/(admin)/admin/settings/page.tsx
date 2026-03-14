import { getSettings } from '@/lib/settings';
import { SettingsEditor } from '@/components/admin/SettingsEditor';

export const metadata = {
  title: 'Global Settings | Mike Beauty Studio Admin',
};

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const currentSettings = await getSettings();

  return (
    <div className="animate-fade-in-up space-y-6">

      {/* Page Header */}
      <div>
        <p className="text-[11px] font-sans uppercase tracking-[0.2em] text-gold/70 mb-1">Admin Dashboard</p>
        <h1 className="font-playfair text-3xl text-white">Application Settings</h1>
        <p className="text-gray-600 text-sm font-sans mt-1">Manage global configuration for your public-facing website.</p>
      </div>

      <div className="admin-surface border border-white/[0.06] rounded-xl p-6 lg:p-8">
        <SettingsEditor initialSettings={currentSettings} />
      </div>

    </div>
  );
}
