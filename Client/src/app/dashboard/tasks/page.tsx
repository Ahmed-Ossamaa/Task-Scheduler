'use client';

import { useMyTasks } from '@/features/tasks/hooks/use-tasks';
import { TaskTable } from '@/features/tasks/components/tasks-table';
import { UserRoles } from '@/features/auth/types/user-interface';
import { CreateTaskDialog } from '@/features/tasks/components/create-task-dialog';
import { useAuthStore } from '@/features/auth/store/auth.store';

export default function MyTasksPage() {
  const { data: myTasks, isLoading } = useMyTasks();
  const user = useAuthStore((state) => state.user);
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
        tasks={myTasks}
        isLoading={isLoading}
        canEdit={false}
        showAssignee={false}
        showProject={true}
      />
    </div>
  );
}
