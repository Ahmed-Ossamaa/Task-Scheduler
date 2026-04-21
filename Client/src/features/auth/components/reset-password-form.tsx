'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Lock, Loader2 } from 'lucide-react';
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
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  resetPasswordSchema,
  ResetPasswordValues,
} from '@/lib/schema/password.schema';
import { useResetPassword } from '@/features/auth/hooks/use-auth';
import { AxiosError } from 'axios';

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const { mutateAsync: resetPasswordMutation, isPending } = useResetPassword();

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onTouched',
    defaultValues: { newPassword: '' },
  });

  const { isValid } = form.formState;

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
