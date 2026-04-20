'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useChangePassword } from '@/features/auth/hooks/use-auth';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  changePasswordFormSchema,
  ChangePasswordFormValues,
} from '@/features/auth/schemas/auth.schema';

export function ChangePasswordForm() {
  const { mutate: changePassword, isPending } = useChangePassword();

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordFormSchema),
    mode: 'onChange',
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });
  // console.log('Current Form Errors:', form.formState.errors); // it works fine
  const onSubmit = (data: ChangePasswordFormValues) => {
    changePassword({
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
    });
  };
//error message doesnt work
  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Change Password </CardTitle>
            <CardDescription className="mb-4">
              You will be logged out after changing it.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 max-w-md mb-5">
            <FormField
              control={form.control}
              name="oldPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                  {/* {form.formState.errors && (
                    <p className="text-red-500 text-sm  my-2">
                      My error message: {form.formState.errors.newPassword?.message}
                    </p>
                  )} */}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button type="submit" variant="destructive" disabled={isPending}>
              {isPending ? 'Updating...' : 'Update Password'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
