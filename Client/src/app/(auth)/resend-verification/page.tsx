'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { authApi } from '@/features/auth/api/auth-api';
import { AxiosError } from 'axios';
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  resendVerificationSchema,
  verificationFormValues,
} from '@/features/auth/schemas/auth.schema';

function ResendVerificationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSuccess, setIsSuccess] = useState(false);

  const defaultEmail = searchParams.get('email') || '';

  const form = useForm<verificationFormValues>({
    resolver: zodResolver(resendVerificationSchema),
    defaultValues: {
      email: defaultEmail,
    },
  });

  const isLoading = form.formState.isSubmitting;

  // Submit Handler
  const onSubmit = async (values: verificationFormValues) => {
    try {
      const response = await authApi.resendVerification(values.email);
      setIsSuccess(true);
      toast.success(response.data.message || 'Verification link sent!');
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(
        axiosError.response?.data?.message ||
          'Failed to resend verification email.',
      );
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-background selection:bg-primary/20">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-primary/30 rounded-full blur-[100px] opacity-60" />
      <div className="absolute inset-0 bg-[radial-gradient(#800020_0.5px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] bg-size-[24px_24px] mask-[radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)]" />

      <div className="w-full max-w-md flex flex-col relative bg-card/60 backdrop-blur-xl border border-border/50 p-8 rounded-3xl shadow-2xl shadow-black/5 dark:shadow-black/40">
        {!isSuccess ? (
          <>
            <div className="text-center mb-6">
              <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                Resend Verification
              </h2>
              <p className="text-muted-foreground mt-2 text-sm">
                Enter your email address and we will send you a new link to
                verify your account.
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="you@example.com"
                          type="email"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || !form.formState.isValid}
                >
                  {isLoading && <Loader2 className="animate-spin h-4 w-4" />}
                  {isLoading ? 'Sending...' : 'Send Verification Link'}
                </Button>
              </form>
            </Form>
          </>
        ) : (
          <div className="text-center">
            <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Check your inbox
            </h2>
            <p className="text-gray-500 mb-6">
              We have sent a new verification link to{' '}
              <strong className="text-gray-900">
                {form.getValues('email')}
              </strong>
              .
            </p>
          </div>
        )}

        {/* Back to Login */}
        <div className="mt-6 text-center">
          <Button
            variant={'link'}
            onClick={() => router.push('/login')}
            className="inline-flex items-center text-[12px] text-muted-foreground hover:text-primary transition-colors hover:underline underline-offset-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to login
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function ResendVerificationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Loader2 className="animate-spin h-12 w-12 text-primary" />
        </div>
      }
    >
      <ResendVerificationContent />
    </Suspense>
  );
}
