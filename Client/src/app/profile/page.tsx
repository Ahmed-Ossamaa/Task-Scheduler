'use client';

import { useRouter } from 'next/navigation';
import {
  Mail,
  Shield,
  Edit2,
  User as UserIcon,
  Briefcase,
  Calendar,
  Phone,
  MapPinHouse,
  VenusAndMars,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useGetMe } from '@/features/users/hooks/use-users';
import { formatDateTime, getInitials } from '@/lib/utils';
import { Navbar } from '@/components/layout/navbar';
import { ProfileSkeleton } from '@/components/skeleton/profile.skeleton';
import Link from 'next/link';
import { Footer } from '@/components/layout/footer';

export default function ProfilePage() {
  const router = useRouter();

  const { data: user, isPending } = useGetMe();

  if (isPending) {
    return <ProfileSkeleton />;
  }

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto p-4 md:p-8 w-full mt-10 mb-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              My Profile
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              View and manage your public identity.
            </p>
          </div>
          <Button
            onClick={() => router.push('/dashboard/settings')}
            className="gap-2"
          >
            <Edit2 className="w-4 h-4" />
            Edit Settings
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left: Avatar */}
          <Card className="md:col-span-1 border-border/50 shadow-sm">
            <CardHeader className="flex flex-col items-center text-center pb-4 pt-8">
              <Avatar className="w-32 h-32 mb-4 border-2 border-secondary shadow-sm">
                <AvatarImage
                  src={user?.avatar as string}
                  alt={user?.name}
                  className=""
                />
                <AvatarFallback className="text-4xl bg-primary/10 text-primary font-bold">
                  {getInitials(user?.name)}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-semibold text-foreground tracking-tight">
                {user?.name}
              </h2>
              <Badge
                variant="secondary"
                className="mt-2 font-medium tracking-widest uppercase text-[10px]"
              >
                {user?.role}
              </Badge>
              {user?.organizationId && (
                <Link href={`/organizations/${user?.organization?.id}`}>
                  <span className="text-primary pr-1">@</span>
                  <span className="text-sm font-medium text-muted-foreground mt-1 hover:text-foreground hover:underline hover:underline-offset-4 pr-1">
                    {user?.organization?.name}
                  </span>
                </Link>
              )}
            </CardHeader>
          </Card>

          {/* Right: Detailed Info */}
          <Card className="md:col-span-2 border-border/50 shadow-sm ">
            <CardHeader>
              <h3 className="text-lg font-semibold text-foreground border-b pb-2">
                Contact & Details
              </h3>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 pb-4 ">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary shrink-0">
                  <UserIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-muted-foreground mb-1">
                    Full Name
                  </p>
                  <p className="text-sm font-medium text-foreground capitalize">
                    {user?.name.toLocaleLowerCase()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary shrink-0">
                  <VenusAndMars className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-muted-foreground mb-1">
                    Gender
                  </p>
                  <p className="text-sm font-medium text-foreground capitalize">
                    {user?.gender || 'Not set'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary shrink-0">
                  <MapPinHouse className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-muted-foreground mb-1">
                    Address
                  </p>
                  <p className="text-sm font-medium text-foreground capitalize">
                    {user?.address || 'Not set'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-muted-foreground mb-1">
                    Email Address
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    {user?.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-muted-foreground mb-1">
                    Phone
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    {user?.phone || 'Not set'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary shrink-0">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-muted-foreground mb-1">
                    Organization
                  </p>
                  <p className="text-sm font-medium text-foreground capitalize">
                    {user?.organization?.name|| 'Not set'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-muted-foreground mb-1">
                    Member Since
                  </p>
                  <p className="text-sm font-medium text-foreground capitalize">
                    {formatDateTime(user?.createdAt, false)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-muted-foreground mb-1">
                    Security Level
                  </p>
                  <p className="text-sm font-medium text-foreground capitalize">
                    {user?.role.toLowerCase()} Access
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer/>
    </>
  );
}
