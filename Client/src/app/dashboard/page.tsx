'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { UserRoles } from '@/features/auth/types/user-interface';
import { CreateOrgForm } from '@/features/organizations/components/create-org-form';
import { CreateProjectDialog } from '@/features/projects/components/create-project-dialog';
import { CreateTaskDialog } from '@/features/tasks/components/create-task-dialog';
import { CreateEmployeeDialog } from '@/features/users/components/create-employee-dialog';

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  if (!user) return null;
  if (user.role === UserRoles.MANAGER && !user.organizationId) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Welcome to Task Manager!</CardTitle>
            <CardDescription>
              Before you can start assigning tasks, you need to create your
              Organization workspace.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreateOrgForm />
          </CardContent>
        </Card>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

        {/* if user is a manager with org */}
        {user.role === UserRoles.MANAGER && user.organizationId && (
          <>
            <CreateTaskDialog />
            <CreateProjectDialog />
            <CreateEmployeeDialog />
          </>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from last week</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
