'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCreateOrganization } from '../hooks/use-organizations';
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
import { toast } from 'sonner';

const formSchema = z.object({
  name: z.string().min(3, 'Organization name must be at least 3 characters'),
  logo: z.string().optional(),
});

export function CreateOrgForm({ onSuccess }: { onSuccess?: () => void }) {
  const { mutate: createOrg, isPending } = useCreateOrganization();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '' },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createOrg(values, {
      onSuccess: () => {
        form.reset();
        if (onSuccess) onSuccess();
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to create org');
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organization Name</FormLabel>
              <FormControl>
                <Input placeholder="ISFP.co" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* will use cloudinary upload later but needs to be added in backend 1st */}
        <FormField
          control={form.control}
          name="logo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Logo URL (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="https://something.com/logo.png" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? 'Creating...' : 'Create Organization'}
        </Button>
      </form>
    </Form>
  );
}
