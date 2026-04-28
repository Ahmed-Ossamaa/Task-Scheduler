import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { getCachedSystemSettings } from '@/features/system-settings/api/get-cached-settings';

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getCachedSystemSettings();
  const appName = settings.appName as string;
  const logo = settings.logo as string || undefined;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar appName={appName} logo={logo} />

      <main className="flex-1 pt-10">{children}</main>

      <Footer settings={settings} appName={appName} />
    </div>
  );
}
