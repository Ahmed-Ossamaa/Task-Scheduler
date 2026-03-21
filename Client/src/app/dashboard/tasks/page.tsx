'use client';

import { useMyTasks } from '@/features/tasks/hooks/use-tasks';
import { TaskTable } from '@/features/tasks/components/tasks-table';
import { UserRoles } from '@/features/auth/types/user-interface';
import { CreateTaskDialog } from '@/features/tasks/components/create-task-dialog';
import { useAuthStore } from '@/features/auth/store/auth.store';

export default function MyTasksPage() {
  const { data: myTasks, isLoading } = useMyTasks();
  const user = useAuthStore((state) => state.user);

  return (
    <div className="flex flex-col space-y-6 w-full">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Tasks</h1>
        <div className="flex justify-end">
          {user && user.role === UserRoles.MANAGER && <CreateTaskDialog />}
        </div>
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
