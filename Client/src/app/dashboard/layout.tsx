import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/sidebar';
import { Separator } from '@/components/ui/separator';
import { TooltipProvider } from '@/components/ui/tooltip';
import HeaderTitle from '@/components/layout/headerTitle';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { getCachedSystemSettings } from '@/features/system-settings/api/get-cached-settings';

export const metadata = {
  title: 'Dashboard | Schedio',
  description: 'Manage your team\'s project spaces.',
}
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getCachedSystemSettings();
  const appName = settings.appName as string;
  const logo = settings.logo;
  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar appName={appName} logo={logo}/>
        <main className="w-full">
          {/* Header */}
          <div className="flex h-12 items-center gap-4 border-b border-border bg-sidebar px-6">
              <SidebarTrigger />
              <Separator orientation="vertical" className="h-6" />
              <HeaderTitle />
            <div className="ml-auto">
              <ThemeToggle />
            </div>
          </div>

          {/* Main Page Content */}
          <div className="p-6">{children}</div>
        </main>
      </SidebarProvider>
    </TooltipProvider>
  );
}
