import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AvatarUpload } from '@/features/users/components/setting/avatar-upload';
import { ChangePasswordForm } from '@/features/users/components/setting/user-chage-password-form';
import { BasicDataForm } from '@/features/users/components/setting/user-data-update-form';

export default function SettingsPage() {
  return (
    <div className="flex flex-col space-y-6 w-full h-full">
      {/* Page Header */}
      <p className="text-muted-foreground mt-2">
        Manage your account settings and update your profile information.
      </p>

      {/* Tabs Layout */}
      <Tabs defaultValue="basic" className="flex flex-col w-full">
        <div className="flex items-center w-full mb-4">
          <TabsList className="relative grid w-full max-w-100 grid-cols-2 rounded-lg shadow-[0_4px_10px_rgba(120,90,60,0.2),inset_0_1px_2px_rgba(255,255,255,0.4)]">
            <TabsTrigger
              value="basic"
              className="border-2 border-transparent data-[state=active]:border-2 data-[state=active]:border-primary data-[state=active]:text-foreground"
            >
              Basic Information
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="border-2 border-transparent data-[state=active]:border-2 data-[state=active]:border-primary data-[state=active]:text-foreground"
            >
              Security
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Basic Info Tab */}
        <TabsContent value="basic" className="space-y-6 ">
          <AvatarUpload />
          <BasicDataForm />
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <ChangePasswordForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
