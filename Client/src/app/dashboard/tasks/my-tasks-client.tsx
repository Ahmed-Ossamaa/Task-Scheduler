'use client';

import { useMyTasks } from '@/features/tasks/hooks/use-tasks';
import { TaskTable } from '@/features/tasks/components/tasks-table';
import { UserRoles } from '@/features/auth/types/user-interface';
import { CreateTaskDialog } from '@/features/tasks/components/create-task-dialog';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function MyTasksClient() {
  const [page, setPage] = useState(1);
  const user = useAuthStore((state) => state.user);
  const hasOrg= !!user?.organizationId
  const { data: myTasks, isLoading } = useMyTasks({ enabled: hasOrg }, page, 20);
  const isManager = user?.role === UserRoles.MANAGER;

  return (
    <div className="flex flex-col space-y-6 w-full">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground"> Manage Your Tasks</p>
        </div>
        {isManager && <CreateTaskDialog />}
      </div>

      <TaskTable
        tasks={myTasks?.data}
        isLoading={isLoading}
        canEdit={false}
        showAssignee={false}
        showProject={true}
      />

      {/* Pagination  */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="default"
          size="sm"
          onClick={() => setPage((old) => Math.max(old - 1, 1))}
          disabled={page === 1 || isLoading}
        >
          Previous
        </Button>
        <div className="text-sm text-muted-foreground font-medium px-2">
          Page {page} of {myTasks?.lastPage || 1}
        </div>
        <Button
          variant="default"
          size="sm"
          onClick={() => setPage((old) => old + 1)}
          disabled={!myTasks || page >= myTasks.lastPage || isLoading}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
