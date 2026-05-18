'use client';

import { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { useOAuthLogin } from '@/features/auth/hooks/use-auth';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

export default function OAuthSuccessPage() {
  const { mutateAsync: processOAuth, isError } = useOAuthLogin();

  const isProcessing = useRef(false);

  useEffect(() => {
    if (isProcessing.current) return;
    isProcessing.current = true;

    const finalizeLogin = async () => {
      try {
        await processOAuth();
        window.location.replace('/dashboard');
      } catch (error) {
        const axiosError = error as AxiosError<{ message: string }>;
        const errMessage = axiosError.response?.data?.message;
        toast.error(errMessage || 'OAuth token exchange failed');
        setTimeout(
          () => window.location.replace('/login?error=oauth_failed'),
          2000,
        );
      }
    };

    finalizeLogin();
  }, [processOAuth]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
      {isError ? (
        <div className="text-center space-y-2">
          <p className="text-destructive font-semibold text-lg">
            Authentication failed
          </p>
          <p className="text-muted-foreground text-sm">
            Redirecting back to login...
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <h2 className="text-xl font-semibold tracking-tight">
            Finalizing Login
          </h2>
          <p className="text-muted-foreground text-sm">
            Securing your session, please wait...
          </p>
        </div>
      )}
    </div>
  );
}
