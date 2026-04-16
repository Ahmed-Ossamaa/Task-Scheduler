'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { TaskPriority } from '../types';
import { useCreateTask } from '../hooks/use-tasks';
import { useOrgProjects } from '@/features/projects/hooks/use-projects';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useOrgEmployees } from '@/features/users/hooks/use-users';
import { Loader2 } from 'lucide-react';

//Schema
const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  deadline: z.string().min(1, 'Deadline is required'),
  priority: z.enum(TaskPriority),
  assignedToId: z.uuid('Must be a valid user ID'),
  projectId: z.uuid('Please select a project'),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateTaskForm({ onSuccess }: { onSuccess?: () => void }) {
  const { mutate: createTask, isPending } = useCreateTask();
  const { data: employees, isLoading: isLoadingEmployees } = useOrgEmployees();
  const { data: projects, isLoading: isLoadingProjects } = useOrgProjects();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      deadline: '',
      priority: TaskPriority.MED,
      assignedToId: '',
      projectId: '',
    },
  });

  //Handler
  function onSubmit(values: FormValues) {
    const payload = {
      ...values,
      projectId: values.projectId,
      deadLine: new Date(values.deadline).toISOString(),
    };

    createTask(payload, {
      onSuccess: () => {
        form.reset();
        if (onSuccess) onSuccess();
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task Title</FormLabel>
              <FormControl>
                <Input placeholder="E.g., Add XYZ feature" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Add some details..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          {/* Deadline */}
          <FormField
            control={form.control}
            name="deadline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Deadline</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Priority */}
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={TaskPriority.LOW}>Low</SelectItem>
                    <SelectItem value={TaskPriority.MED}>Medium</SelectItem>
                    <SelectItem value={TaskPriority.HIGH} className='text-red-500'>High</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {/* project */}
          <FormField
            control={form.control}
            name="projectId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger disabled={isLoadingProjects}>
                      {isLoadingProjects ? (
                        <span className="flex items-center gap-2 text-muted-foreground">
                          <Loader2 className="h-4 w-4 animate-spin" />{' '}
                          Loading...
                        </span>
                      ) : (
                        <SelectValue placeholder="Select project" />
                      )}
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {projects?.data?.length === 0 ? (
                      <SelectItem value="empty" disabled>
                        No projects found.
                      </SelectItem>
                    ) : (
                      projects?.data?.map((project) => (
                        <SelectItem key={project.id} value={project.id} className='focus:bg-red-100'>
                          {project.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* AssignedTo ID */}
          <FormField
            control={form.control}
            name="assignedToId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assign To</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger disabled={isLoadingEmployees}>
                      {isLoadingEmployees ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Loading team...</span>
                        </div>
                      ) : (
                        <SelectValue placeholder="Select an employee" />
                      )}
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {employees?.data?.length === 0 ? (
                      <SelectItem value="empty" disabled>
                        No employees found in organization.
                      </SelectItem>
                    ) : (
                      employees?.data?.map((employee) => (
                        <SelectItem key={employee.id} value={employee.id} className='focus:bg-red-100'>
                          <div className="flex flex-col items-start truncate text-left w-full">
                            <span className="truncate font-medium">
                              {employee.name}
                            </span>
                            <span className="truncate text-xs text-muted-foreground">
                              {employee.email}
                            </span>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? 'Scheduling...' : 'Create Task'}
        </Button>
      </form>
    </Form>
  );
}
