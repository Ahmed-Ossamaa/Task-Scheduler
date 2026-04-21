'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateEmployee } from '../hooks/use-users';
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
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Select,
} from '@/components/ui/select';
import { createEmpSchema, CreateEmpValues } from '@/lib/schema/auth.schema';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

export function CreateEmployeeForm({ onSuccess }: { onSuccess?: () => void }) {
  const { mutate: createEmployee, isPending } = useCreateEmployee();

  const form = useForm<CreateEmpValues>({
    resolver: zodResolver(createEmpSchema),
    mode: 'onTouched',
    defaultValues: {
      name: '',
      gender: 'male',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  function onSubmit(values: CreateEmpValues) {
    createEmployee(
      {
        name: values.name,
        gender: values.gender,
        email: values.email,
        password: values.password,
      },
      {
        onSuccess: () => {
          toast.success('Employee created successfully');
          form.reset();
          if (onSuccess) onSuccess();
        },
        onError: (error) => {
          const axiosError = error as AxiosError<{ message: string }>;
          const errMessage = axiosError.response?.data?.message;
          toast.error(errMessage || 'Failed to create employee');
        },
      },
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Employee name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Employee Name" {...field} />
              </FormControl>
              <FormMessage className="text-[10px] text-destructive font-medium" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage className="text-[10px] text-destructive font-medium" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input type="email" placeholder="name@company.com" {...field} />
              </FormControl>
              <FormMessage className="text-[10px] text-destructive font-medium" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Initial Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="******" {...field} />
              </FormControl>
              <FormMessage className="text-[10px] text-destructive font-medium" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="******" {...field} />
              </FormControl>
              <FormMessage className="text-[10px] text-destructive font-medium" />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? 'Adding...' : 'Add Employee'}
        </Button>
      </form>
    </Form>
  );
}
