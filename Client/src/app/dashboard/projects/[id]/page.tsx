'use client';

import { useParams } from 'next/navigation';
import { useProjectTasks } from '@/features/tasks/hooks/use-tasks';
import { useOrgEmployees } from '@/features/users/hooks/use-users';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { UserRoles } from '@/features/auth/types/user-interface';
import { TaskTable } from '@/features/tasks/components/tasks-table';
import { CreateTaskDialog } from '@/features/tasks/components/create-task-dialog';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ProjectDetailsPage() {
  const params = useParams();
  const projectId = params.id as string;
  const user = useAuthStore((state) => state.user);

  // Fetching tasks for this project
  const { data: tasks, isLoading: loadingTasks } = useProjectTasks(projectId);
  const { data: employees } = useOrgEmployees();

  const isManager =
    user?.role === UserRoles.MANAGER;

  return (
    <div className="flex flex-col space-y-2 w-full">
      {/* Back to Projects Btn */}
      <div>
        <Button
          variant="link"
          asChild
          className="p-0 mb-4 text-muted-foreground"
        >
          <Link href="/dashboard/projects">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
          </Link>
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground">
            Manage tasks for this project.
          </p>
        </div>

        {isManager && <CreateTaskDialog />}
      </div>

      {/* Table */}
      <TaskTable
        tasks={tasks || []}
        isLoading={loadingTasks}
        showAssignee={true}
        canEdit={isManager}
        employees={employees}
      />
    </div>
  );
}
