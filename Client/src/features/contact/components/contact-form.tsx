'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2, Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { ContactFormValues, contactSchema } from '@/lib/schema/contact-form-schema';



export function ContactForm() {
  const [isPending, setIsPending] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    mode: 'onTouched',
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const { isValid } = form.formState;

  const onSubmit = async (data: ContactFormValues) => {
    setIsPending(true);
    try {
      // till i develop the messaging module in the backend
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success('Message sent successfully! We will get back to you soon.');
      form.reset();
    } catch {
      toast.error('Failed to send message. Please try again later.');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-5"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-[11px] font-bold tracking-[0.15em] uppercase text-muted-foreground">
                  Your Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your Name"
                    disabled={isPending}
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
                    disabled={isPending}
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
        </div>

        <FormField
          control={form.control}
          name="subject"
          render={({ field, fieldState }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-[11px] font-bold tracking-[0.15em] uppercase text-muted-foreground">
                Subject
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="How can we help you?"
                  disabled={isPending}
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

        <FormField
          control={form.control}
          name="message"
          render={({ field, fieldState }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-[11px] font-bold tracking-[0.15em] uppercase text-muted-foreground">
                Message
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Type your message here..."
                  disabled={isPending}
                  className={`min-h-30 resize-none ${fieldState.error ? 'border-destructive focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-destructive' : ''}`}
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-[10px] text-destructive font-medium" />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isPending || !isValid}
          className="h-11 mt-2 w-full md:w-auto md:ml-auto rounded-sm text-[11px] font-bold tracking-[0.12em] uppercase transition-all"
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Send className="w-4 h-4 mr-2" />
          )}
          {isPending ? 'Sending...' : 'Send Message'}
        </Button>
      </form>
    </Form>
  );
}
