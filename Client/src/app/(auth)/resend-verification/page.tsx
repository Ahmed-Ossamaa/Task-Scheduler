'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { authApi } from '@/features/auth/api/auth-api';
import { AxiosError } from 'axios';
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import * as z from 'zod';
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

//form Schema (email field)
const formSchema = z.object({
  email: z
    .email('Please enter a valid email address')
    .nonempty('Email is required'),
});

type FormValues = z.infer<typeof formSchema>;

export default function ResendVerificationPage() {
  const router = useRouter();
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const isLoading = form.formState.isSubmitting;

  // Submit Handler
  const onSubmit = async (values: FormValues) => {
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
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 border border-gray-100">
        {!isSuccess ? (
          <>
            <div className="text-center mb-6">
              <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Resend Verification
              </h2>
              <p className="text-gray-500 mt-2 text-sm">
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
                      {/* Automatically displays the Zod error message */}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isLoading|| !form.formState.isValid}>
                  {isLoading && (
                    <Loader2 className="animate-spin h-4 w-4" />
                  )}
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
          <button
            onClick={() => router.push('/login')}
            className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 transition"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to login
          </button>
        </div>
      </div>
    </div>
  );
}
