'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Lock, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  resetPasswordSchema,
  ResetPasswordValues,
} from '@/lib/schema/password.schema';
import { useResetPassword } from '@/features/auth/hooks/use-auth';
import { AxiosError } from 'axios';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const { mutateAsync: resetPasswordMutation, isPending } = useResetPassword();

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onTouched',
    defaultValues: { newPassword: '' },
  });

  const { isValid} = form.formState;

  if (!token) {
    return (
      <div className="text-center py-6">
        <h2 className="text-xl font-bold text-destructive mb-2">
          Invalid Link
        </h2>
        <p className="text-[13px] text-foreground mb-6">
          This password reset link is missing its security token. Please request
          a new one.
        </p>
        <Button
          onClick={() => router.push('/forgot-password')}
          className="h-9 text-[11px] font-bold tracking-[0.12em] mt-5"
        >
          Request New Link
        </Button>
      </div>
    );
  }

  const onSubmit = async (data: ResetPasswordValues) => {
    try {
      const response = await resetPasswordMutation({
        token,
        newPassword: data.newPassword,
      });

      toast.success(response.data.message || 'Password reset successfully!');
      router.push('/login');
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errMessage = axiosError.response?.data?.message;
      toast.error(errMessage || 'Failed to reset password.');
    }
  };

  return (
    <>
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
          <Lock className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-medium tracking-tight text-foreground mb-2">
          Set New Password
        </h1>
        <p className="text-[13px] text-muted-foreground">
          Please enter your new password below.
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
            name="newPassword"
            render={({ field, fieldState }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-[11px] font-bold tracking-[0.15em] uppercase text-muted-foreground">
                  New Password
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    disabled={isPending}
                    placeholder="••••••••"
                    {...field}
                    className={
                      fieldState.error
                        ? 'border-destructive focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-destructive'
                        : ''
                    }
                  />
                </FormControl>
                <FormMessage className="text-[10px] font-medium text-destructive" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isPending || !isValid}
            className="h-11 mt-2 w-full rounded-sm text-[11px] font-bold tracking-[0.12em] uppercase transition-all"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              'Update Password'
            )}
          </Button>
        </form>
      </Form>
    </>
  );
}

export default function ResetPasswordPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md relative bg-card/60 backdrop-blur-xl border border-border/50 rounded-3xl shadow-2xl shadow-black/5 dark:shadow-black/40 overflow-hidden">
        <CardContent className="pt-8 px-8 pb-4">
          <Suspense
            fallback={
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            }
          >
            <ResetPasswordForm />
          </Suspense>
        </CardContent>

        <CardFooter className="flex justify-center pb-2 pt-2">
          <Button
            variant={'link'}
            onClick={() => router.push('/login')}
            className="inline-flex items-center text-[12px] text-muted-foreground hover:text-primary transition-colors hover:underline underline-offset-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
