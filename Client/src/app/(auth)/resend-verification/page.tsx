

import { Suspense } from 'react';
import Link from 'next/link';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import { ResendVerificationForm } from '@/features/auth/components/resend-verification-form';

export const metadata = {
  title: 'Resend Verification | Schedio',
  description: 'Resend verification email.',
};

export default function ResendVerificationPage() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-background selection:bg-primary/20 p-4">
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-primary/30 rounded-full blur-[100px] opacity-60" />
      <div className="absolute inset-0 bg-[radial-gradient(#800020_0.5px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] bg-size-[24px_24px] mask-[radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)]" />

      <Card className="w-full max-w-md relative bg-card/60 backdrop-blur-xl border border-border/50 rounded-3xl shadow-2xl shadow-black/5 dark:shadow-black/40 overflow-hidden">
        
        <CardContent className="pt-8 px-8 pb-4">
          <Suspense
            fallback={
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            }
          >
            <ResendVerificationForm />
          </Suspense>
        </CardContent>

        <CardFooter className="flex justify-center pb-2 pt-2">
          <Link
            href="/login"
            className={buttonVariants({
              variant: 'link',
              className: 'inline-flex items-center text-[12px] text-muted-foreground hover:text-primary transition-colors hover:underline underline-offset-4',
            })}
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to login
          </Link>
        </CardFooter>

      </Card>
    </div>
  );
}