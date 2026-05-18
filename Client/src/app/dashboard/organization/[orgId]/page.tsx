'use client';

import { useParams, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Building2,
  Users,
  Edit,
  Layers,
  Briefcase,
  Mail,
  Globe,
  CalendarDays,
} from 'lucide-react';
import Image from 'next/image';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { useOrganization } from '@/features/organizations/hooks/use-organizations';
import { UserRoles } from '@/features/auth/types/user-interface';
import { OrgProfileSkeleton } from '@/components/skeleton/org-profile.skeleton';
import Link from 'next/link';
import { formatDateTime } from '@/lib/utils';

export default function OrganizationProfilePage() {
  const params = useParams();
  const router = useRouter();
  const orgId = params?.orgId as string | undefined;

  const user = useAuthStore((state) => state.user);
  const { data: org, isLoading, error } = useOrganization(orgId);
  const isManager = user?.role === UserRoles.MANAGER;
  const isAdmin = user?.role === UserRoles.ADMIN;

  if (isLoading) {
    return <OrgProfileSkeleton />;
  }

  if (error || !org) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <h2 className="text-2xl font-bold text-foreground">
          Organization Not Found
        </h2>
        <p className="text-muted-foreground">
          The organization you are looking for does not exist or was archived.
        </p>
        <Button variant="outline" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full pb-20  overflow-hidden bg-background selection:bg-primary/20">
      <div className="relative max-w-7xl mx-auto space-y-6 ">
        {/* ---  Header Card --- */}
        <Card className="overflow-hidden bg-card/60 backdrop-blur-xl border-border/50 shadow-xl shadow-black/5 dark:shadow-black/40 py-0">
          {/* Cover Photo Area */}
          <div className="h-65 w-full relative bg-muted">
            {org.cover ? (
              <Image
                src={org.cover}
                alt={`${org.name} cover`}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="absolute inset-0 bg-linear-to-r from-primary/70 via-primary/30 to-secondary/80">
                <div className="absolute inset-0 bg-[radial-gradient(#800020_0.5px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] bg-size-[24px_24px] opacity-30" />
              </div>
            )}

            {/* Edit Button (manager only) */}
            <div className="absolute top-4 right-4 z-10">
              {isManager && (
                <Link href={`/dashboard/organization/${org.id}/edit`}>
                  <Button
                    variant="outline"
                    className="backdrop-blur-md bg-background/50 hover:bg-background transition-colors"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </Link>
              )}
            </div>
          </div>

          <CardContent className="relative px-8 pb-8">
            {/* Logo */}
            <div className="absolute -top-16 left-8 bg-background p-0.5 rounded-2xl shadow-lg border border-border/50 z-10">
              <div className="w-28 h-28 relative rounded-xl overflow-hidden bg-muted flex items-center justify-center">
                {org.logo ? (
                  <Image
                    src={org.logo}
                    alt={`${org.name} logo`}
                    fill
                    sizes="112px"
                    priority
                    className="object-cover"
                  />
                ) : (
                  <Building2 className="w-12 h-12 text-muted-foreground/50" />
                )}
              </div>
            </div>

            {/* Profile Info & Stats */}
            <div className="pt-20 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div>
                  <h1 className="text-3xl font-bold text-foreground tracking-tight">
                    {org.name}
                  </h1>
                </div>

                {/* Slogan */}
                <p className="text-lg text-muted-foreground font-medium">
                  {org.slogan ? org.slogan : 'No Slogan'}
                </p>
              </div>

              {/* Stats Container */}
              <div className="flex flex-wrap items-center gap-4">
                <Link href={`/dashboard/team`}>
                  <div className="flex items-center space-x-3 bg-primary/10 text-primary px-4 py-4 rounded-lg border border-primary/20 hover:scale-[1.02] transition-transform">
                    <Users className="w-5 h-5" />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-semibold uppercase tracking-wider opacity-80">
                        Employees
                      </span>
                      <span className="text-lg font-bold leading-none">
                        {org.employeeCount}
                      </span>
                    </div>
                  </div>
                </Link>

                <Link href={`/dashboard/projects`}>
                  <div className="flex items-center space-x-3 bg-secondary text-foreground px-4 py-4 rounded-lg border border-border hover:scale-[1.02] transition-transform">
                    <Layers className="w-5 h-5 text-muted-foreground" />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Projects
                      </span>
                      <span className="text-lg font-bold leading-none">
                        {org.projectCount}
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* --- details card --- */}
        <div>
          <Card className="bg-card/60 backdrop-blur-xl border-border/50 shadow-md">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold flex items-center">
                Organization Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Industry */}

              <div className="flex items-center space-x-3 text-sm">
                <div className="p-2 bg-muted rounded-md text-muted-foreground">
                  <Briefcase className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                    Industry
                  </p>
                  <p className="font-medium text-foreground">
                    {org?.industry || 'Not Set'}
                  </p>
                </div>
              </div>

              {/* Website */}

              <div className="flex items-center space-x-3 text-sm">
                <div className="p-2 bg-muted rounded-md text-muted-foreground">
                  <Globe className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                    Website
                  </p>
                  {org.websiteUrl ? (
                    <Link
                      href={
                        org.websiteUrl.startsWith('http')
                          ? org.websiteUrl
                          : `https://${org.websiteUrl}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium  hover:underline"
                    >
                      {org.websiteUrl.replace(/^https?:\/\//, '')}
                    </Link>
                  ) : (
                    <p className="font-medium text-foreground">Not Set</p>
                  )}
                </div>
              </div>

              {/* Email */}

              <div className="flex items-center space-x-3 text-sm">
                <div className="p-2 bg-muted rounded-md text-muted-foreground ">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                    Contact Email
                  </p>
                  {org.contactEmail ? (
                    <Link
                      href={`mailto:${org.contactEmail}`}
                      className="font-medium  hover:underline"
                    >
                      {org.contactEmail}
                    </Link>
                  ) : (
                    <p className="font-medium text-foreground">Not Set</p>
                  )}
                </div>
              </div>

              {/* Created At */}

              <div className="flex items-center space-x-3 text-sm">
                <div className="p-2 bg-muted rounded-md text-muted-foreground">
                  <CalendarDays className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                    Joined Schedio
                  </p>
                  <p className="font-medium text-foreground">
                    {formatDateTime(org.createdAt, false, 'Not Set')}
                  </p>
                </div>
              </div>
              {(isAdmin || isManager) && (
                  <p className="px-2 py-0.5 rounded text-xs text-muted-foreground">
                    ID: {org.id}
                  </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
