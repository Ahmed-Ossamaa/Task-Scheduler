'use client';

import { useParams } from 'next/navigation';
import { OrgBrandingUpload } from '@/features/organizations/components/org-images-upload';
import { OrgProfileForm } from '@/features/organizations/components/org-profile-form';
import { useOrganization } from '@/features/organizations/hooks/use-organizations';
import { Loader2 } from 'lucide-react';

export default function EditOrganizationPage() {
  const params = useParams();
  const orgId = params?.orgId as string;

  const { data: org, isLoading } = useOrganization(orgId);

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!org) return null;

  return (
    <div className=" mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>

          <p className="text-muted-foreground">
            Manage your company branding and public details.
          </p>
        </div>
      </div>

      <div className="grid gap-8">
        <OrgBrandingUpload
          logo={org.logo}
          cover={org.cover}
          name={org.name}
        />

        <OrgProfileForm
          initialData={{
            name: org.name,
            industry: org.industry ?? '',
            slogan: org.slogan ?? '',
            websiteUrl: org.websiteUrl ?? '',
            contactEmail: org.contactEmail ?? '',
          }}
        />
      </div>
    </div>
  );
}
