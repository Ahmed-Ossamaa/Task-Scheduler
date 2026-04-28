import { LoginForm } from '@/features/auth/components/login-form';
import { getCachedSystemSettings } from '@/features/system-settings/api/get-cached-settings';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login | Schedio',
  description: 'Login to your account',
};

export default async function LoginPage() {

  const settings = await getCachedSystemSettings();
  const logo = settings.logo as string || undefined;
  const appName = settings.appName as string;

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-background selection:bg-primary/20">
      
      {/* glowy bg */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-primary/30 rounded-full blur-[100px] opacity-60" />

      {/* Dots bg */}
      <div className="absolute inset-0 bg-[radial-gradient(#800020_0.5px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] bg-size-[24px_24px] mask-[radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)]" />

      {/* Form Container */}
      <div className="relative z-10 w-full px-4 flex justify-center">
        <LoginForm logo= {logo} appName={appName} />
      </div>

    </div>
  );
}