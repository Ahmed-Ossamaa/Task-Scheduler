import { Card, CardContent } from '@/components/ui/card';
import { getCachedSystemSettings } from '@/features/system-settings/api/get-cached-settings';

export const metadata = {
  title: 'Terms of Service',
  description: 'Read our terms of service and user agreements.',
};

export default async function TermsPage() {
  const settings = await getCachedSystemSettings();
  const appName = settings.appName as string;
  return (
    <div className="relative min-h-screen w-full pt-10 pb-20 px-4 overflow-hidden bg-background selection:bg-primary/20">
      {/* Background */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-primary/20 rounded-full blur-[120px] opacity-50 pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(#800020_0.5px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] bg-size-[24px_24px] mask-[radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)] pointer-events-none" />

      <div className="relative max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Terms of Service
          </h1>
          <p className="text-muted-foreground">Last updated: January 2026</p>
        </div>

        <Card className="bg-card/60 backdrop-blur-xl border-border/50 shadow-xl shadow-black/5 dark:shadow-black/40">
          <CardContent className="p-8 md:p-12 prose prose-sm md:prose-base dark:prose-invert max-w-none text-muted-foreground">
            <h2 className="text-2xl font-semibold text-foreground mt-0 mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="mb-6">
              By accessing and using {appName}, you accept and agree to be bound
              by the terms and provision of this agreement. In addition, when
              using these particular services, you shall be subject to any
              posted guidelines or rules applicable to such services.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mb-4">
              2. User Accounts & Security
            </h2>
            <p className="mb-6">
              To use certain features of the platform, you must register for an
              account. You are responsible for maintaining the confidentiality
              of your account credentials and for all activities that occur
              under your account. You agree to notify us immediately of any
              unauthorized use of your account.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mb-4">
              3. Acceptable Use Policy
            </h2>
            <p className="mb-4">You agree not to use the service to:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>
                Upload, post, or transmit any content that is illegal, harmful,
                or offensive.
              </li>
              <li>
                Attempt to bypass or break any security mechanism on the
                platform.
              </li>
              <li>Transmit any viruses, malware, or other destructive code.</li>
              <li>
                Use automated scripts or scrapers to access the service without
                our explicit permission.
              </li>
            </ul>

            <h2 className="text-2xl font-semibold text-foreground mb-4">
              4. Intellectual Property
            </h2>
            <p className="mb-6">
              The service and its original content, features, and functionality
              are owned by {appName}. You may not copy, modify, distribute, or use
              any part of the service without our prior written consent.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mb-4">
              5. Limitation of Liability
            </h2>
            <p className="mb-6">
              In no event shall {appName}, nor its directors, employees, partners,
              agents, suppliers, or affiliates, be liable for any indirect,
              incidental, special, consequential or punitive damages, including
              without limitation, loss of profits, data, use, goodwill, or other
              intangible losses, resulting from your access to or use of or
              inability to access or use the Service.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mb-4">
              6. Changes to Terms
            </h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace
              these Terms at any time. If a revision is material we will try to
              provide at least 30 days notice prior to any new terms taking
              effect.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
