'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { authApi } from '@/features/auth/api/auth-api';
import { AxiosError } from 'axios';
import { ArrowLeft, CheckCircle2, Loader2, XCircle } from 'lucide-react';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';

export function VerifyEmailContent({ token }: { token: string | null }) {
  const router = useRouter();

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    token ? 'loading' : 'error',
  );

  const [errorMessage, setErrorMessage] = useState(
    token ? '' : 'Invalid or missing verification token.',
  );

  const hasTriedVerification = useRef(false);

  useEffect(() => {
    if (!token) return;

    if (hasTriedVerification.current) return;
    hasTriedVerification.current = true;

    const verifyToken = async () => {
      try {
        const response = await authApi.verifyEmail(token);
        setStatus('success');
        toast.success(response.data.message);

        setTimeout(() => router.push('/login'), 3000);
      } catch (error) {
        const axiosError = error as AxiosError<{ message: string }>;
        setStatus('error');
        setErrorMessage(
          axiosError.response?.data?.message ||
            'Verification failed. The link may have expired.',
        );
      }
    };

    verifyToken();
  }, [token, router]);

  return (
    <>
      {status === 'loading' && (
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Verifying your email...
          </h2>
          <p className="text-[13px] text-muted-foreground">
            Please wait a moment.
          </p>
        </div>
      )}

      {status === 'success' && (
        <div className="text-center">
          <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Email Verified!
          </h2>
          <p className="text-[13px] text-muted-foreground mb-6">
            Your account is now active. Redirecting to login...
          </p>
          <Link
            href="/login"
            className={buttonVariants({ className: 'w-full h-11' })}
          >
            Go to Login Now
          </Link>
        </div>
      )}

      {status === 'error' && (
        <div className="text-center">
          <XCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Verification Failed
          </h2>
          <p className="text-[13px] font-medium text-destructive mb-6">
            {errorMessage}
          </p>

          <Link
            href="/login"
            className={buttonVariants({
              variant: 'link',
              className:
                'inline-flex items-center text-[12px] text-muted-foreground hover:text-primary transition-colors hover:underline underline-offset-4',
            })}
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to login
          </Link>
        </div>
      )}
    </>
  );
}
