import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { systemSettingsApi } from '@/features/system-settings/api/system-settings.api';

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let settings = null;
  try {
    settings = await systemSettingsApi.getSettings();
  } catch(error) {
    console.error(error,'Failed to fetch global settings on server');
  }
  const appName = settings?.appName || 'TaskFlow';
  const logo = settings?.logo || null;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar appName={appName} logo={logo} />

      <main className="flex-1 pt-10">{children}</main>

     <Footer settings={settings} appName={appName} />
    </div>
  );
}
