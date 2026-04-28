
import { Card, CardContent } from '@/components/ui/card';
import { VerifyEmailContent } from '@/features/auth/components/verify-email-content';

export const metadata = {
  title: 'Verify Email',
  description: 'Securely verify your email address.',
};

export default function VerifyEmailPage({
  searchParams,
}: {
  searchParams: { [key: string]: string  | undefined };
}) {
  const token = searchParams.token as string | undefined;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md relative bg-card/60 backdrop-blur-xl border border-border/50 rounded-3xl shadow-2xl shadow-black/5 dark:shadow-black/40 overflow-hidden">
        <CardContent className="pt-10 px-8 pb-10">
          
          <VerifyEmailContent token={token || null} />
          
        </CardContent>
      </Card>
    </div>
  );
}