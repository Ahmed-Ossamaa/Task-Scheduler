
import { SystemMaintenanceActions } from '@/features/system-settings/components/system-maintenance-actions';
import { SystemSettingsForm } from '@/features/system-settings/components/system-settings-form';
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'System Settings | Admin Dashboard',
  description:
    'Manage global application settings, branding, and system configuration.',
};

export default function SystemSettingsPage() {
  return (
    <div className="flex-1 space-y-4 ">
      {/* Page Header */}
        <div>
          <p className="text-muted-foreground mt-1">
            Manage your platform&apos;s core identity, contact details, branding assets, and Logs.
          </p>
        </div>


      <div className="flex flex-col space-y-8 max-w-5xl mx-auto w-full pb-10">
        <SystemSettingsForm />
        <SystemMaintenanceActions />
      </div>
    </div>
  );
}
