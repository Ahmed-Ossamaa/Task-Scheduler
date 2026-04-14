'use client';

import { useParams } from 'next/navigation';
import { useProjectTasks } from '@/features/tasks/hooks/use-tasks';
import { useOrgEmployees } from '@/features/users/hooks/use-users';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { UserRoles } from '@/features/auth/types/user-interface';
import { TaskTable } from '@/features/tasks/components/tasks-table';
import { CreateTaskDialog } from '@/features/tasks/components/create-task-dialog';

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
    <div className="flex flex-col space-y-6 w-full">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground">
            Manage tasks for {!!tasks?.length  && tasks[0]?.project?.name || 'this project'}
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
