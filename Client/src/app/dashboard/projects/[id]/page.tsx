'use client';

import { useParams } from 'next/navigation';
import { useProjectTasks } from '@/features/tasks/hooks/use-tasks';
import { useOrgEmployees } from '@/features/users/hooks/use-users';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { UserRoles } from '@/features/auth/types/user-interface';
import { TaskTable } from '@/features/tasks/components/tasks-table';
import { CreateTaskDialog } from '@/features/tasks/components/create-task-dialog';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function ProjectDetailsPage() {
  const params = useParams();
  const projectId = params.id as string;
  const user = useAuthStore((state) => state.user);
  const [page, setPage] = useState<number>(1);

  // Fetching tasks for this project
  const { data: tasks, isLoading: loadingTasks } = useProjectTasks(
    projectId,
    page,
    20,
  );
  const { data: employees } = useOrgEmployees();

  const isManager = user?.role === UserRoles.MANAGER;

  return (
    <div className="flex flex-col space-y-6 w-full">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground">
            Manage tasks for{' '}
            {(!!tasks?.data.length && tasks.data[0]?.project?.name) ||
              'this project'}
          </p>
        </div>

        {isManager && <CreateTaskDialog />}
      </div>

      {/* Table */}
      <TaskTable
        tasks={tasks?.data || []}
        isLoading={loadingTasks}
        showAssignee={true}
        canEdit={isManager}
        employees={employees?.data}
      />
      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="default"
          size="sm"
          onClick={() => setPage((old) => Math.max(old - 1, 1))}
          disabled={page === 1 || loadingTasks}
        >
          Previous
        </Button>
        <div className="text-sm text-muted-foreground font-medium px-2">
          Page {page} of {tasks?.lastPage || 1}
        </div>
        <Button
          variant="default"
          size="sm"
          onClick={() => setPage((old) => old + 1)}
          disabled={
            !tasks || page >= tasks.lastPage || loadingTasks
          }
        >
          Next
        </Button>
      </div>
    </div>
  );
}
