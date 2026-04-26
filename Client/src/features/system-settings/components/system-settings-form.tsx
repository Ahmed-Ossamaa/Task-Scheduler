'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, Loader2, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  useGetSystemSettings,
  useUpdateSystemSettings,
  useUploadLogo,
  useUploadLandingImage,
  useRestoreSystemSettings,
} from '@/features/system-settings/hooks/use-system-settings';
import {
  systemSettingsSchema,
  SystemSettingsValues,
} from '@/lib/schema/system-settings-schema';
import { ImageUpload } from '@/components/ui/image-upload';
import { AxiosError } from 'axios';

export function SystemSettingsForm() {
  const { data: settings, isLoading } = useGetSystemSettings();
  const { mutateAsync: updateSettings, isPending: isUpdatingText } =
    useUpdateSystemSettings();
  const { mutateAsync: uploadLogo, isPending: isUploadingLogo } =
    useUploadLogo();
  const { mutateAsync: uploadLanding, isPending: isUploadingLanding } =
    useUploadLandingImage();
  const { mutateAsync: restoreDefaults, isPending: isRestoring } =
    useRestoreSystemSettings();

  const isSaving = isUpdatingText || isUploadingLogo || isUploadingLanding;

  const form = useForm<SystemSettingsValues>({
    resolver: zodResolver(systemSettingsSchema),
    mode: 'onTouched',
    defaultValues: {
      appName: '',
      contactEmail: '',
      contactPhone: '',
      contactCityAddress: '',
      contactStreetAddress: '',
      logo: '',
      landingPageImage: '',
      banner: '',
      facebookUrl: '',
      twitterUrl: '',
      instagramUrl: '',
      youtubeUrl: '',
      ticktokUrl: '',
      linkedinUrl: '',
    },
  });

  useEffect(() => {
    if (settings) {
      form.reset({
        ...settings,
      });
    }
  }, [settings, form]);

  const onSubmit = async (data: SystemSettingsValues) => {
    try {
      //if new logo (file)
      if (data.logo instanceof File) {
        await uploadLogo(data.logo);
      }
      // if new landing page (file)
      if (data.landingPageImage instanceof File) {
        await uploadLanding(data.landingPageImage);
      }

      // remove the (files) from the text payload.
      const textPayload: SystemSettingsValues = { ...data };

      if (textPayload.logo instanceof File) delete textPayload.logo;
      if (textPayload.landingPageImage instanceof File)
        delete textPayload.landingPageImage;

      //the normal text fields
      await updateSettings(textPayload);

      toast.success('System settings saved successfully');
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage = axiosError.response?.data?.message;
      toast.error(errorMessage || 'Failed to save settings. Please try again.');
    }
  };

  //restore system-settings defaults
  const handleRestore = async () => {
    try {
      await restoreDefaults();
      toast.success('System settings restored to default values.');
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage = axiosError.response?.data?.message;
      toast.error(
        errorMessage || 'Failed to restore settings. Please try again.',
      );
    }
  };

  if (isLoading) {
    return (
      <Card className="flex h-64 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </Card>
    );
  }

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader className="border-b pb-2! mb-4">
            <CardTitle className="text-2xl ">Global System Settings</CardTitle>
            <CardDescription>
              Update the core application details, contact information, and
              branding assets.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* App name */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">
                General Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="appName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Application Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Task Flow App.." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <hr />

            {/* branding (images & banner) */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">
                Branding & Images
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="logo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Application Logo</FormLabel>
                      <FormControl>
                        <ImageUpload
                          value={field.value}
                          onChange={field.onChange}
                          disabled={isSaving}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="landingPageImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Landing Page Hero Image</FormLabel>
                      <FormControl>
                        <ImageUpload
                          value={field.value}
                          onChange={field.onChange}
                          disabled={isSaving}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="banner"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Banner</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="The advertisement banner text"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <hr />
            {/*  contact info */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">
                Contact Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Support Email</FormLabel>
                      <FormControl>
                        <Input placeholder="support@domain.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Support Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="+1-555-0000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactCityAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City / Region</FormLabel>
                      <FormControl>
                        <Input placeholder="City, Country" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactStreetAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main St., district" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <hr />

            {/* social links */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">
                Social Links
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="linkedinUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LinkedIn URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://linkedin.com/company/..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="facebookUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Facebook URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://facebook.com/..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="twitterUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>X (Twitter) URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://twitter.com/..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="instagramUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instagram URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://instagram.com/..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="youtubeUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>YouTube URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://youtube.com/..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ticktokUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>TikTok URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://tiktok.com/..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-3 mt-4 flex items-center justify-between">
            {' '}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isRestoring || isSaving}
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  {isRestoring ? 'Restoring...' : 'Restore Defaults'}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will wipe all current contact info and branding assets,
                    returning the system to its initial state.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleRestore()}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Yes, restore defaults
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            {/*  Save btn */}
            <Button type="submit" disabled={isSaving} className="gap-2">
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Configuration
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
