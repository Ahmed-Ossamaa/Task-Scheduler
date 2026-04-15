'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AdminOverview } from '@/features/admin-overview/components/AdminOverview';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { UserRoles } from '@/features/auth/types/user-interface';
import { CreateOrgForm } from '@/features/organizations/components/create-org-form';
import { TaskCard } from '@/features/tasks/components/task-card';
import { useMyTasks } from '@/features/tasks/hooks/use-tasks';
import { TaskStatus } from '@/features/tasks/types';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const isManagerWithoutOrg =
    user?.role === UserRoles.MANAGER && !user?.organizationId;
  const isAdmin = user?.role === UserRoles.ADMIN;
  const needsTasks = !!user && !isAdmin && !isManagerWithoutOrg;
  const { data: tasks, isLoading } = useMyTasks({ enabled: needsTasks }, 1, 20);

  if (!user) return null;
  if (isAdmin) {
    return <AdminOverview />;
  }

  if (isManagerWithoutOrg) {
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

  if (isLoading && needsTasks) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const inProgressTasks =
    tasks?.data.filter(
      (t) => t.status !== TaskStatus.DONE && t.status !== TaskStatus.CANCELED,
    ) || [];
  const completedAndCanceledTasks =
    tasks?.data.filter(
      (t) => t.status === TaskStatus.DONE || t.status === TaskStatus.CANCELED,
    ) || [];
  return (
    <>
      <p className="mb-6 ml-2 font-bold">Recent tasks overview:</p>
      <div className="max-w-200 mx-10 py-4">
        {/*IN PROGRESS SECTION */}
        <div className="mb-12">
          <h2 className="text-[11px] font-bold tracking-[0.2em] uppercase text-muted-foreground border-b border-border/60 pb-4 mb-4">
            In Progress — {inProgressTasks.length} Task
            {inProgressTasks.length !== 1 && 's'}
          </h2>

          <div className="flex flex-col gap-3">
            {inProgressTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">
                You are all caught up!
              </p>
            ) : (
              inProgressTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))
            )}
          </div>
        </div>

        {/* COMPLETED SECTION  */}
        <div>
          <h2 className="text-[11px] font-bold tracking-[0.2em] uppercase text-muted-foreground border-b border-border/60 pb-4 mb-4">
            Completed This Week — {completedAndCanceledTasks.length} Task
            {completedAndCanceledTasks.length !== 1 && 's'}
          </h2>

          <div className="flex flex-col gap-3 opacity-70">
            {completedAndCanceledTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">
                No tasks completed yet.
              </p>
            ) : (
              completedAndCanceledTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
