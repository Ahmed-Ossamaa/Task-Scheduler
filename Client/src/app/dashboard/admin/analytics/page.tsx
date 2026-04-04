'use client';

import { usePlatformAnalytics } from '@/features/analytics/hooks/use-analytics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Users,
  Building2,
  FolderKanban,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import {
  ROLE_COLORS,
  DEFAULT_COLOR,
} from '@/constants/analytics-charts-constants';
import { RoleDistributionChart } from '@/features/analytics/components/role-distribution-chart';
import { RoleCount } from '@/features/analytics/types';


export default function AdminAnalyticsPage() {
  const { data, isLoading } = usePlatformAnalytics();

  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const overview = data?.overview;
  const roleChartData =
    data?.roles?.map((r: RoleCount) => ({  
      name: r.role,
      value: r.count,
      fill: ROLE_COLORS[r.role] || DEFAULT_COLOR,
    }
  )) || [];
  
  return (
    <div className="flex flex-col space-y-6 w-full">
      <div>
        <p className="text-muted-foreground">
          High-level overview of system usage.
        </p>
      </div>

      {/* Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Organizations</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview?.totalOrgs || 0}</div>
            <p className="text-xs text-muted-foreground">Active Organizations on platform</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Global Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">Registered accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview?.totalProjects || 0}</div>
            <p className="text-xs text-muted-foreground">Across all organizations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks Created</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview?.totalTasks || 0}</div>
            <p className="text-xs text-muted-foreground">System-wide task volume</p>
          </CardContent>
        </Card>

      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <RoleDistributionChart data={roleChartData} />
        {/* Later: will add other charts (2 per row , or maybe 1) */}
      </div>

    </div>
  );
}
