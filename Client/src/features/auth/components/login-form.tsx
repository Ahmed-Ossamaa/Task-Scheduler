'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { CheckCircle2, Loader2, Eye, EyeOff } from 'lucide-react';
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
import { useLogin } from '@/features/auth/hooks/use-auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { LoginFormValues, loginSchema } from '@/lib/schema/auth.schema';
import { AxiosError } from 'axios';

export function LoginForm() {
  const [needsVerification, setNeedsVerification] = useState(false);
  const [failedEmail, setFailedEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const { mutateAsync: loginMutation, isPending: isLoading } = useLogin();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
    defaultValues: { email: '', password: '' },
  });

  const { isValid } = form.formState;

  const onSubmit = async (data: LoginFormValues) => {
    setNeedsVerification(false);
    try {
      await loginMutation(data);
      toast.success('Welcome back!');
      router.push('/dashboard');
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage = axiosError.response?.data?.message;

      if (errorMessage?.includes('Please verify your email')) {
        setNeedsVerification(true);
        setFailedEmail(data.email);
        toast.error('You need to verify your email first.');
      } else {
        toast.error(errorMessage || 'Invalid email or password');
      }
    }
  };

  return (
    <div className="w-full max-w-110 flex flex-col relative bg-card/60 backdrop-blur-xl border border-border/50 p-8 rounded-3xl shadow-2xl shadow-black/5 dark:shadow-black/40">
      <div className="flex flex-col items-center text-center mb-10">
        <div className="w-12 h-12 flex items-center justify-center mb-6">
          <Link
            href="/"
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            <CheckCircle2 className="h-6 w-6 text-red-500" />
            <span className="text-xl font-bold tracking-tight">Task</span>
            <span className="text-xl font-bold tracking-tight text-primary">
              Flow
            </span>
          </Link>
        </div>
        <h1 className="text-2xl font-medium tracking-tight text-foreground mb-2">
          Welcome back
        </h1>
        <p className="text-[13px] text-muted-foreground">
          Enter your Email and Password to access your workspace.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
          className="flex flex-col gap-5"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-[11px] font-bold tracking-[0.15em] uppercase text-muted-foreground">
                  Email Address
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    {...field}
                    className={`pr-10 h-10 ${
                      fieldState.error
                        ? 'border-destructive focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-destructive'
                        : ''
                    }`}
                  />
                </FormControl>
                <FormMessage className="text-[10px] text-destructive font-medium" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <FormItem className="space-y-2">
                <div className="flex items-center justify-between">
                  <FormLabel className="text-[11px] font-bold tracking-[0.15em] uppercase text-muted-foreground">
                    Password
                  </FormLabel>
                  <Link
                    tabIndex={-1}
                    href="/forgot-password"
                    className="text-[10px] font-bold tracking-[0.05em] text-primary hover:underline"
                  >
                    Forgot?
                  </Link>
                </div>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      {...field}
                      className={`pr-10 h-10 ${
                        fieldState.error
                          ? 'border-destructive focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-destructive'
                          : ''
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      tabIndex={-1}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className="text-[10px] text-destructive font-medium" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isLoading || !isValid}
            className="h-11 mt-2 w-full rounded-sm text-[11px] font-bold tracking-[0.12em] uppercase transition-all"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              'Log In →'
            )}
          </Button>

          {needsVerification && (
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-md text-sm text-center">
              <p className="text-amber-800 mb-2">
                We can&apos;t log you in until you verify your email address.
              </p>
              <button
                type="button"
                onClick={() =>
                  router.push(
                    `/resend-verification?email=${encodeURIComponent(failedEmail)}`,
                  )
                }
                className="text-amber-950 font-semibold underline hover:text-blue-600"
              >
                Click here to resend the verification email
              </button>
            </div>
          )}
        </form>
      </Form>

      <div className="mt-8 text-center">
        <p className="text-[12px] text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link
            href="/register"
            className="text-foreground font-medium hover:text-primary transition-colors hover:underline underline-offset-4"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
