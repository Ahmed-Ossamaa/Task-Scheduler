'use client';

import { useState } from 'react';
import { useForgotPassword } from '@/features/auth/hooks/use-auth';
import { toast } from 'sonner';
import { KeyRound, Loader2, CheckCircle2 } from 'lucide-react';
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
import { forgotPasswordSchema, ForgotPasswordValues } from '@/lib/schema/password.schema';
import { AxiosError } from 'axios';


export function ForgotPasswordForm() {
  const [isSuccess, setIsSuccess] = useState(false);
  const { mutateAsync: forgotPasswordMutation, isPending } = useForgotPassword();

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onTouched',
    defaultValues: { email: '' },
  });

  const { isValid } = form.formState;

  //Submit Handler
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

  if (isSuccess) {
    return (
      <div className="text-center py-4">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Check your inbox
        </h2>
        <p className="text-[13px] text-muted-foreground mb-6">
          If an account exists for{' '}
          <strong className="text-foreground">{form.getValues('email')}</strong>,
          you will receive a password reset link shortly.
        </p>
      </div>
    );
  }

  return (
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
                    disabled={isPending}
                    placeholder="you@example.com"
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
      </Form>
    </>
  );
}