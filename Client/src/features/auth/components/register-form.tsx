'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authApi } from '@/features/auth/api/auth-api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  registerSchema,
  type RegisterFormValues,
} from '../schemas/auth.schema';
import { AxiosError } from 'axios';

export function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onTouched',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      const response = await authApi.register({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      toast.success(
        response.data.message ||
          'Account created successfully, please verify your email',
      );
      router.push('/login');
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errMessage = axiosError.response?.data?.message;
      toast.error(errMessage || 'Failed to create account, please try again');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-120 flex flex-col relative bg-card/60 backdrop-blur-xl border border-border/50 p-8 rounded-3xl shadow-2xl shadow-black/5 dark:shadow-black/40">
      {' '}
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
          Create an account
        </h1>
        <p className="text-[13px] text-muted-foreground">
          Set up your workspace in seconds.
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="space-y-2">
          <label className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground">
            Full Name *
          </label>
          <Input
            type="text"
            {...register('name')}
            className={
              errors.name
                ? 'border-destructive focus-visible:ring-destructive'
                : 'border-border/60 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary'
            }
            placeholder="Your Name"
          />
          {errors.name && (
            <p className="text-[10px] text-destructive font-medium">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground">
            Email Address *
          </label>
          <Input
            type="email"
            {...register('email')}
            className={
              errors.email
                ? 'border-destructive focus-visible:ring-destructive'
                : 'border-border/60 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary'
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
          <label className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground">
            Password *
          </label>
          <Input
            type="password"
            {...register('password')}
            className={
              errors.password
                ? 'border-destructive focus-visible:ring-destructive'
                : 'border-border/60 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary'
            }
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="text-[10px] text-destructive font-medium leading-tight">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground">
            Confirm Password *
          </label>
          <Input
            type="password"
            {...register('confirmPassword')}
            className={
              errors.confirmPassword
                ? 'border-destructive focus-visible:ring-destructive'
                : 'border-border/60 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary'
            }
            placeholder="••••••••"
          />
          {errors.confirmPassword && (
            <p className="text-[10px] text-destructive font-medium">
              {errors.confirmPassword.message}
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
            'Sign Up →'
          )}
        </Button>
      </form>
      <div className="mt-8 text-center">
        <p className="text-[12px] text-muted-foreground">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-foreground font-medium hover:text-primary transition-colors hover:underline underline-offset-4"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
