'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authApi } from '@/features/auth/api/auth-api';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { loginSchema, type LoginFormValues } from '../schemas/auth.schema';


export function LoginForm() {
  const router = useRouter();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setUser = useAuthStore((state) => state.setUser);

  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const response = await authApi.login(data);
      setAccessToken(response.accessToken);
      setUser(response.user);

      toast.success('Welcome back!');
      router.push('/dashboard');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-110 flex flex-col relative bg-card/60 backdrop-blur-xl border border-border/50 p-8 rounded-3xl shadow-2xl shadow-black/5 dark:shadow-black/40">
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-10">
        <div className="w-12 h-12 flex items-center justify-center  mb-6">
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

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="space-y-2">
          <label className="text-[11px] font-bold tracking-[0.15em] uppercase text-muted-foreground">
            Email Address
          </label>
          <Input
            type="email"
            {...register('email')}
            className={
                errors.email
                  ? 'border-destructive focus-visible:ring-destructive'
                  : ''
              }
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="text-[10px] text-destructive font-medium">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold tracking-[0.15em] uppercase text-muted-foreground">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-[10px] font-bold tracking-[0.05em] text-primary hover:underline"
            >
              Forgot?
            </Link>
          </div>
          <Input
            type="password"
            {...register('password')}
            className={
                errors.password
                  ? 'border-destructive focus-visible:ring-destructive'
                  : ''
              }
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="text-[10px] text-destructive font-medium">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="h-11 mt-2 w-full rounded-sm text-[11px] font-bold tracking-[0.12em] uppercase transition-all"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            'Log In →'
          )}
        </Button>
      </form>

      {/* Footer */}
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
