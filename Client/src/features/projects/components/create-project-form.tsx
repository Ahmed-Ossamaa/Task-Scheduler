'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateProject } from '../hooks/use-projects';
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
import {
  createProjectSchema,
  CreateProjectValues,
} from '@/lib/schema/project-creation-schema';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

export function CreateProjectForm({ onSuccess }: { onSuccess?: () => void }) {
  const { mutateAsync: createProject, isPending } = useCreateProject();

  const form = useForm<CreateProjectValues>({
    resolver: zodResolver(createProjectSchema),
    mode: 'onTouched',
    defaultValues: { name: '', description: '' },
  });

  async function onSubmit(values: CreateProjectValues) {
    try{
      await createProject(values);
      form.reset();
      toast.success('Project created successfully');
      if (onSuccess) onSuccess();
    }catch(error){
      const axiosError = error as AxiosError<{ message: string }>;
      const errMessage = axiosError.response?.data?.message;
      toast.error(errMessage || 'Failed to create project');
    }

  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input placeholder="E.g., Q3 Marketing..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="What is this project about?"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? 'Creating...' : 'Create Project'}
        </Button>
      </form>
    </Form>
  );
}
