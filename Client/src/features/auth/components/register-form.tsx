'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
import { useRegister } from '@/features/auth/hooks/use-auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { RegisterFormValues, registerSchema } from '@/lib/schema/auth.schema';
import { AxiosError } from 'axios';


interface RegisterFormProps {
  logo: string | undefined;
  appName: string
}
export function RegisterForm({ logo, appName }: RegisterFormProps) {
  const router = useRouter();
  const { mutateAsync: registerMutation, isPending: isLoading } = useRegister();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onTouched', 
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const { isValid } = form.formState;

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      const response = await registerMutation({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      toast.success(
        response.data.message || 'Account created successfully, please verify your email',
      );
      router.push('/login');
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errMessage = axiosError.response?.data?.message;
      toast.error(errMessage || 'Failed to create account, please try again');
    }
  };

  return (
    <div className="w-full max-w-120 flex flex-col relative bg-card/60 backdrop-blur-xl border border-border/50 px-8 py-5 rounded-3xl shadow-2xl shadow-black/5 dark:shadow-black/40">
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-60 h-10 flex items-center justify-center mb-2">
          <Link
            href="/"
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            {logo ? (
              <div className="relative h-15 w-60 shrink-0 ">
                <Image
                  src={logo}
                  alt={`${appName} logo`}
                  fill
                  sizes="160px"
                  priority
                  className="object-contain"
                />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-8 w-8 text-red-500 shrink-0" />
                <span className="text-2xl font-bold text-primary ">
                  {appName}
                </span>
              </div>
            )}
          </Link>
        </div>
        <h1 className="text-2xl font-medium tracking-tight text-foreground mb-2">
          Create an account
        </h1>
        <p className="text-[13px] text-muted-foreground">
          Set up your workspace in seconds.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
          className="flex flex-col gap-3"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground">
                  Full Name *
                </FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Your Name" {...field} />
                </FormControl>
                <FormMessage className="text-[12px] text-destructive font-medium" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground">
                  Email Address *
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-[12px] text-destructive font-medium" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground">
                  Password *
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      {...field}
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
                <FormMessage className="text-[12px] text-destructive font-medium" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground">
                  Confirm Password *
                </FormLabel>
                <FormControl>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-[12px] text-destructive font-medium" />
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
              'Sign Up →'
            )}
          </Button>
        </form>
      </Form>

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