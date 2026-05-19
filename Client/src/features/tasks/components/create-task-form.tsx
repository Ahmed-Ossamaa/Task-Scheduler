'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TaskPriority } from '../types';
import { useCreateTask } from '../hooks/use-tasks';
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
import {
  creatTaskSchema,
  CreatTaskValues,
} from '@/lib/schema/task-creation-schema';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { useDebounce } from '@/hooks/use-debounce';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { SearchableCombobox } from '@/components/common/searchable-combobox';

interface CreateTaskFormProps {
  onSuccess?: () => void;
  projectName: string;
}
export function CreateTaskForm({
  onSuccess,
  projectName,
}: CreateTaskFormProps) {
  const params = useParams();
  const currentProjectId = params.id as string;
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const { mutateAsync: createTask, isPending } = useCreateTask();
  const { data: employees, isLoading: isLoadingEmployees } = useOrgEmployees(
    1,
    10,
    debouncedSearch,
  );

  const form = useForm<CreatTaskValues>({
    resolver: zodResolver(creatTaskSchema),
    mode: 'onTouched',
    defaultValues: {
      title: '',
      description: '',
      deadline: '',
      priority: TaskPriority.MED,
      assignedToId: '',
      projectId: currentProjectId || '',
    },
  });

  useEffect(() => {
    if (currentProjectId) {
      form.setValue('projectId', currentProjectId);
    }
  }, [currentProjectId, form]);

  const employeeData = employees?.data;

  const employeeItems = useMemo(() => {
    if (!employeeData) return [];
    return employeeData.map((emp) => ({
      value: emp.id,
      label: `${emp.name} (${emp.email})`,
    }));
  }, [employeeData]);

  //Handler
  async function onSubmit(values: CreatTaskValues) {
    const payload = {
      ...values,
      // projectId: values.projectId,
      deadLine: new Date(values.deadline).toISOString(),
    };
    try {
      await createTask(payload);
      form.reset();
      setSearch('');
      toast.success('Task created successfully');
      if (onSuccess) onSuccess();
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errMessage = axiosError.response?.data?.message;
      toast.error(errMessage || 'Failed to create task');
    }
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
                    <SelectTrigger className="bg-secondary">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={TaskPriority.LOW}>Low</SelectItem>
                    <SelectItem value={TaskPriority.MED}>Medium</SelectItem>
                    <SelectItem
                      value={TaskPriority.HIGH}
                      className="text-red-500"
                    >
                      High
                    </SelectItem>
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
            render={() => (
              <FormItem>
                <FormLabel>Project</FormLabel>
                <FormControl>
                  <Input
                    value={projectName}
                    disabled
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* AssignedTo */}
          <FormField
            control={form.control}
            name="assignedToId"
            render={({ field }) => (
              <FormItem className="flex flex-col justify-end">
                <FormLabel className="mb-2">Assign To</FormLabel>
                <FormControl>
                  <SearchableCombobox
                    items={employeeItems}
                    value={field.value}
                    onChange={field.onChange}
                    onSearchChange={setSearch}
                    placeholder="Select team member..."
                    searchPlaceholder="Type name or email..."
                    emptyText="No teammates found."
                    isLoading={isLoadingEmployees}
                    className="w-full bg-secondary"
                  />
                </FormControl>
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
