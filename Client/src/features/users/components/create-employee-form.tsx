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
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export function CreateEmployeeForm({ onSuccess }: { onSuccess?: () => void }) {
  const { mutateAsync: createEmployee, isPending } = useCreateEmployee();
  const [showPassword, setShowPassword] = useState(false);

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

  const onSubmit = async (values: CreateEmpValues) => {
    try {
      await createEmployee({
        name: values.name,
        gender: values.gender,
        email: values.email,
        password: values.password,
      });

      toast.success(
        'Employee created successfully, Please let them check their email.',
      );
      form.reset();
      onSuccess?.();
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errMessage = axiosError.response?.data?.message;
      toast.error(errMessage || 'Failed to create employee');
    }
  };

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
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="******"
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
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
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="******"
                  {...field}
                />
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
