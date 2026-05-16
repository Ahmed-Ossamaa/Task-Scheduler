'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEditProject } from '@/features/projects/hooks/use-projects';
import { Project } from '@/features/projects/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { editProjectSchema, UpdateProjectValues } from '@/lib/schema/project-creation-schema';
import { AxiosError } from 'axios';


interface EditProjectDialogProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EditProjectDialog({
  project,
  isOpen,
  onClose,
}: EditProjectDialogProps) {
  const { mutateAsync: editProject, isPending } = useEditProject();

  const form = useForm<UpdateProjectValues>({
    resolver: zodResolver(editProjectSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  useEffect(() => {
    if (isOpen && project) {
      form.reset({
        name: project.name,
        description: project.description || '',
      });
    }
  }, [isOpen, project, form]);

  //submit handler
  const onSubmit = async (values: UpdateProjectValues) => {
    if (!project) return;

    try {
      await editProject({
        projectId: project.id,
        data: values,
      });

      toast.success('Project updated successfully');
      onClose();
    } catch(error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errMessage = axiosError.response?.data?.message;
      toast.error(errMessage || 'Failed to update project');
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="w-[95vw] sm:max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="min-w-0" >
          <DialogTitle className="border-b border-border pb-2">Edit Project</DialogTitle>
          <DialogDescription className='truncate'>
            Update {project?.name} 
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-2 min-w-0 overflow-hidden"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className='min-w-0'>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input
                      className="w-full min-w-0 shrink overflow-hidden wrap-anywhere"
                      placeholder="e.g. Website Redesign"
                      disabled={isPending}
                      {...field}
                    />
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                    className="w-full min-w-0 overflow-hidden wrap-anywhere"
                      placeholder="Briefly describe the goals of this project..."
                      rows={3}
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending || !form.formState.isDirty}
              >
                {isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
