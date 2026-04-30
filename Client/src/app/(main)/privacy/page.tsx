import { getCachedSystemSettings } from '@/features/system-settings/api/get-cached-settings';
import { Metadata } from 'next';
import { Card, CardContent } from '@/components/ui/card';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getCachedSystemSettings();
  return {
    title: 'Privacy Policy',
    description: `Privacy Policy for ${settings.appName || 'our application'}`,
  };
}

export default async function PrivacyPolicyPage() {
  const settings = await getCachedSystemSettings();
  const appName = settings.appName as string;
  const email = settings.contactEmail as string;

  return (
    <div className="relative min-h-screen w-full pt-10 pb-20 px-4 overflow-hidden bg-background selection:bg-primary/20">
      {/* Background */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-50 h-50 bg-primary/20 rounded-full blur-[120px] opacity-50 pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(#800020_0.5px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] bg-size-[24px_24px] mask-[radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)] pointer-events-none" />

      <div className="relative max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground">Last updated: January 2026</p>
        </div>

        {/* Content Card */}
        <Card className="bg-card/60 backdrop-blur-xl border-border/50 shadow-xl shadow-black/5 dark:shadow-black/40">
          <CardContent className="p-8 md:p-12 prose prose-sm md:prose-base dark:prose-invert max-w-none text-muted-foreground">
            <h2 className="text-2xl font-semibold text-foreground mt-0 mb-4">
              1. Introduction
            </h2>
            <p className="mb-6">
              Welcome to <strong>{appName}</strong>. We respect your privacy and
              are committed to protecting your personal data. This privacy
              policy will inform you as to how we look after your personal data
              when you visit our website and tell you about your privacy rights.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mb-4">
              2. Data We Collect
            </h2>
            <p className="mb-4">
              We may collect, use, store and transfer different kinds of
              personal data about you which we have grouped together as follows:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>
                <strong>Identity Data:</strong> includes first name, last name,
                username or similar identifier.
              </li>
              <li>
                <strong>Contact Data:</strong> includes email address and
                telephone numbers.
              </li>
              <li>
                <strong>Technical Data:</strong> includes internet protocol (IP)
                address, browser type and version, time zone setting, and
                operating system.
              </li>
            </ul>

            <h2 className="text-2xl font-semibold text-foreground mb-4">
              3. How We Use Your Data
            </h2>
            <p className="mb-6">
              We will only use your personal data when the law allows us to.
              Most commonly, we will use your personal data to provide the
              services you requested, to manage our relationship with you, and
              to improve our platform&apos;s functionality and security.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mb-4">
              4. Data Security
            </h2>
            <p className="mb-6">
              We have put in place appropriate security measures to prevent your
              personal data from being accidentally lost, used or accessed in an
              unauthorized way, altered or disclosed.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mb-4">
              5. Contact Us
            </h2>
            <p className="mb-6">
              If you have any questions about this privacy policy or our privacy
              practices, please contact our support team at:{' '}
              <a
                href={`mailto:${email}`}
                className="text-primary hover:text-primary/80 transition-colors font-medium underline-offset-4"
              >
                {email}
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
