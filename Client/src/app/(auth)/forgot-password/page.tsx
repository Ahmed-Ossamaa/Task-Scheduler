'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForgotPassword } from '@/features/auth/hooks/use-auth';
import { toast } from 'sonner';
import { KeyRound, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { forgotPasswordSchema, ForgotPasswordValues } from '@/lib/schema/password.schema';
import { AxiosError } from 'axios';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isSuccess, setIsSuccess] = useState(false);
  const { mutateAsync: forgotPasswordMutation, isPending } =
    useForgotPassword();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isValid },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onTouched',
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: ForgotPasswordValues) => {
    try {
      const response = await forgotPasswordMutation(data.email);
      setIsSuccess(true);
      toast.success(response.data.message || 'Reset link sent!');
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errMessage = axiosError.response?.data?.message;
      toast.error(errMessage || 'Failed to send reset link.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md flex flex-col relative bg-card/60 backdrop-blur-xl border border-border/50 p-8 rounded-3xl shadow-2xl shadow-black/5 dark:shadow-black/40">
        {!isSuccess ? (
          <>
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                <KeyRound className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-medium tracking-tight text-foreground mb-2">
                Forgot Password
              </h1>
              <p className="text-[13px] text-muted-foreground">
                Enter your email address and we&apos;ll send you a link to reset
                your password.
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="flex flex-col gap-5"
            >
              <div className="space-y-2">
                <label className="text-[11px] font-bold tracking-[0.15em] uppercase text-muted-foreground">
                  Email Address
                </label>
                <Input
                  type="email"
                  disabled={isPending}
                  {...register('email')}
                  className={
                    errors.email
                      ? 'border-destructive focus-visible:ring-1 focus-visible:ring-destructive'
                      : ''
                  }
                  placeholder="you@example.com"
                />
              </div>

              <Button
                type="submit"
                disabled={isPending || !isValid}
                className="h-11 mt-2 w-full rounded-sm text-[11px] font-bold tracking-[0.12em] uppercase transition-all"
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Send Reset Link →'
                )}
              </Button>
            </form>
          </>
        ) : (
          <div className="text-center py-4">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Check your inbox
            </h2>
            <p className="text-[13px] text-muted-foreground mb-6">
              If an account exists for{' '}
              <strong className="text-foreground">{getValues('email')}</strong>,
              you will receive a password reset link shortly.
            </p>
          </div>
        )}

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
