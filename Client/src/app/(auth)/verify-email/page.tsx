'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { authApi } from '@/features/auth/api/auth-api';
import { AxiosError } from 'axios';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    token ? 'loading' : 'error',
  );

  const [errorMessage, setErrorMessage] = useState(
    token ? '' : 'Invalid or missing verification token.',
  );

  const hasTriedVerification = useRef(false);

  useEffect(() => {
    if (!token) return;

    // Prevent double firing in dev Mode (first call remove the token , second call fails "undefined")
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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md flex flex-col relative bg-card/60 backdrop-blur-xl border border-border/50 p-8 rounded-3xl shadow-2xl shadow-black/5 dark:shadow-black/40">
        {/* Loading */}
        {status === 'loading' && (
          <div>
            <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              Verifying your email...
            </h2>
            <p className="text-gray-500">Please wait a moment.</p>
          </div>
        )}

        {/* Success */}
        {status === 'success' && (
          <div>
            <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Email Verified!</h2>
            <p className="text-gray-500 mb-6">
              Your account is now active. Redirecting to login...
            </p>
            <button
              onClick={() => router.push('/login')}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
            >
              Go to Login Now
            </button>
          </div>
        )}

        {/* On Error */}
        {status === 'error' && (
          <div>
            <XCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Verification Failed</h2>
            <p className="text-red-500 mb-6">{errorMessage}</p>

            <Button
              onClick={() => router.push('/login')}
              className="w-full"
            >
              Back to Login
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Loader2 className="animate-spin h-12 w-12 text-primary" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
  