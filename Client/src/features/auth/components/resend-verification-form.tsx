'use client'; 

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { authApi } from '@/features/auth/api/auth-api';
import { AxiosError } from 'axios';
import { Mail, Loader2, CheckCircle2 } from 'lucide-react';
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
} from '@/lib/schema/auth.schema';

export function ResendVerificationForm() {
  const searchParams = useSearchParams();
  const [isSuccess, setIsSuccess] = useState(false);

  const defaultEmail = searchParams.get('email') || '';

  const form = useForm<verificationFormValues>({
    resolver: zodResolver(resendVerificationSchema),
    mode: 'onTouched',
    defaultValues: {
      email: defaultEmail,
    },
  });

  const isLoading = form.formState.isSubmitting;
  const { isValid } = form.formState;

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

  if (isSuccess) {
    return (
      <div className="text-center py-4">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Check your inbox
        </h2>
        <p className="text-[13px] text-muted-foreground mb-6">
          We have sent a new verification link to{' '}
          <strong className="text-foreground">{form.getValues('email')}</strong>.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="text-center mb-8">
        <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">
          Resend Verification
        </h2>
        <p className="text-muted-foreground mt-2 text-[13px]">
          Enter your email address and we will send you a new link to
          verify your account.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
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
                    disabled={isLoading}
                    {...field}
                    className={
                      fieldState.error
                        ? 'border-destructive focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-destructive'
                        : ''
                    }
                  />
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
            {isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Send Verification Link →'}
          </Button>
        </form>
      </Form>
    </>
  );
}