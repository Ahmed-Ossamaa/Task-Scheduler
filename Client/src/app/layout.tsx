import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Providers from './providers';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { getCachedSystemSettings } from '@/features/system-settings/api/get-cached-settings';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getCachedSystemSettings();
  const appName = settings.appName || 'Schedio';
  const img =
    (settings.landingPageImage as string | undefined) || '';

  return {
    title: {
      default: appName,
      template: `%s | ${appName}`,
    },
    description:'Manage your team\'s project spaces.',

    openGraph: {
      title: appName,
      images: [
        {
          url: img,
        },
      ],
    },
  };
}

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            {children}
            <Toaster richColors position="top-right" />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
