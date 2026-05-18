'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
} from '@/components/ui/card';
import { Save, Loader2 } from 'lucide-react';
import { useUpdateOrgProfile } from '../hooks/use-organizations';
import {
  OrgProfileFormValues,
  orgProfileSchema,
} from '@/lib/schema/org-profile-schema';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { INDUSTRIES } from '@/constants/org-industries-constant';

interface OrgProfileFormProps {
  initialData: OrgProfileFormValues;
}

export function OrgProfileForm({ initialData }: OrgProfileFormProps) {
  const { mutateAsync: updateProfile, isPending } = useUpdateOrgProfile();

  const form = useForm<OrgProfileFormValues>({
    resolver: zodResolver(orgProfileSchema),
    mode: 'onTouched',
    defaultValues: {
      name: initialData.name || '',
      industry: initialData.industry || '',
      slogan: initialData.slogan || '',
      websiteUrl: initialData.websiteUrl || '',
      contactEmail: initialData.contactEmail || '',
    },
  });

  async function onSubmit(data: OrgProfileFormValues) {
    try {
      updateProfile(data);
      toast.success('Profile updated successfully!');
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage = axiosError.response?.data.message;
      toast.error(errorMessage || 'Failed to update profile.');
    }
  }

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader>
        <CardTitle>General Information</CardTitle>
        <CardDescription>
          Update your organization&apos;s basic details.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Organization Name{' '}
                      <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Schedio" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Industry</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {INDUSTRIES.map((industry) => (
                            <SelectItem key={industry} value={industry}>
                              {industry}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="slogan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Slogan / Tagline</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Building the future of work."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="websiteUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Email</FormLabel>
                    <FormControl>
                      <Input placeholder="sup@company.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end pt-4 border-t border-border">
              <Button
                type="submit"
                disabled={isPending || !form.formState.isDirty}
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" /> Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
