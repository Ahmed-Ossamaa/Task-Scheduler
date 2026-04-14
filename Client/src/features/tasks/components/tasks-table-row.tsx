/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Task, TaskStatus, TaskPriority } from '../types';
import {
  useUpdateTask,
  useDeleteTask,
  useCompleteTask,
} from '../hooks/use-tasks';
import { TaskDetailsDialog } from './task-details-dialog';
import { TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2, CheckCircle2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { formatDateTime } from '@/lib/utils';

export const getTaskStatusBadge = (status: TaskStatus) => {
  switch (status) {
    case TaskStatus.DONE:
      return <Badge className="bg-green-500">Done</Badge>;
    case TaskStatus.OVERDUE:
      return <Badge variant="destructive">Overdue</Badge>;
    case TaskStatus.PENDING:
      return <Badge variant="secondary">Pending</Badge>;
    case TaskStatus.CANCELED:
      return <Badge variant="outline">Canceled</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

interface RowProps {
  task: Task;
  canEdit: boolean;
  showAssignee: boolean;
  showProject: boolean;
  employees: any[];
}

export function TaskTableRow({
  task,
  canEdit,
  showAssignee,
  showProject,
  employees,
}: RowProps) {
  // Dialog States
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [statusConfirm, setStatusConfirm] = useState<{
    open: boolean;
    newStatus: TaskStatus | null;
  }>({ open: false, newStatus: null });

  // Mutations
  const { mutate: updateTask, isPending: isUpdating } = useUpdateTask();
  const { mutate: deleteTask, isPending: isDeleting } = useDeleteTask();
  const { mutate: completeTask, isPending: isCompleting } = useCompleteTask();

  const isBusy = isUpdating || isDeleting || isCompleting;

  const handleUpdate = (field: string, value: any) => {
    updateTask(
      { taskId: task.id, data: { [field]: value } },
      {
        onSuccess: () => toast.success('Task updated successfully'),
        onError: (err: any) =>
          toast.error(err.response?.data?.message || 'Failed to update task'),
      },
    );
  };

  //ChangeStatus Handler
  const confirmStatusChange = () => {
    if (!statusConfirm.newStatus) return;
    updateTask(
      { taskId: task.id, data: { status: statusConfirm.newStatus } },
      {
        onSuccess: () => {
          toast.success(`Status changed to ${statusConfirm.newStatus}`);
          setStatusConfirm({ open: false, newStatus: null });
        },
        onError: (err: any) => {
          toast.error(err.response?.data?.message || 'Failed to change status');
          setStatusConfirm({ open: false, newStatus: null });
        },
      },
    );
  };

  // Employee "Mark as Done" Handler
  const handleEmployeeComplete = () => {
    completeTask(task.id, {
      onSuccess: () => toast.success('Great job! Task marked as done.'),
      onError: (err: any) =>
        toast.error(
          err.response?.data?.message ||
            'Failed to complete task, please try again',
        ),
    });
  };

  // Date Formatting
  const deadlineDate = formatDateTime(task.deadLine);
  const completedAtDate = formatDateTime(task.completedAt) || '-';
  const inputDateTime = new Date(task.deadLine).toISOString().slice(0, 16);
  const now = new Date().toISOString().slice(0, 16);
  return (
    <>
      <TableRow className={isBusy ? 'opacity-50 pointer-events-none' : ''}>
        <TableCell className="font-medium">{task.title}</TableCell>
        <TableCell>
          {canEdit ? (
            <Select
              defaultValue={task.priority}
              onValueChange={(v) => handleUpdate('priority', v)}
            >
              <SelectTrigger className="h-8 w-27.5 bg-transparent">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TaskPriority.LOW}>Low</SelectItem>
                <SelectItem value={TaskPriority.MED}>Medium</SelectItem>
                <SelectItem value={TaskPriority.HIGH}>High</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <span className="capitalize">{task.priority.toLowerCase()}</span>
          )}
        </TableCell>

        {/* Status */}
        <TableCell>
          {canEdit ? (
            <Select
              value={task.status} // reset value
              onValueChange={(val) =>
                setStatusConfirm({ open: true, newStatus: val as TaskStatus })
              }
            >
              <SelectTrigger className="h-8 w-32.5 bg-transparent">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TaskStatus.PENDING}>Pending</SelectItem>
                <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
                <SelectItem value={TaskStatus.OVERDUE}>Overdue</SelectItem>
                <SelectItem value={TaskStatus.CANCELED}>Canceled</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            getTaskStatusBadge(task.status)
          )}
        </TableCell>
        {showProject && (
          <TableCell className="text-muted-foreground">
            {task?.project?.name || '-'}
          </TableCell>
        )}

        {/* AssignedTo */}
        {showAssignee && (
          <TableCell>
            {canEdit ? (
              <Select
                defaultValue={task.assignedToId}
                onValueChange={(v) => handleUpdate('assignedToId', v)}
              >
                <SelectTrigger className="h-8 w-35 bg-transparent">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {employees?.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              task.assignedTo?.name || 'Unknown'
            )}
          </TableCell>
        )}

        {/* Deadline */}
        <TableCell>
          {canEdit ? (
            <Input
              type="datetime-local"
              defaultValue={inputDateTime}
              min={now}
              className="h-8 w-45 bg-transparent"
              onBlur={(e) =>
                handleUpdate('deadLine', new Date(e.target.value).toISOString())
              }
            />
          ) : (
            deadlineDate
          )}
        </TableCell>
        <TableCell className="text-muted-foreground whitespace-nowrap">
          {task.status === TaskStatus.DONE ? (
            <span className="text-green-600">
              {completedAtDate}
            </span>
          ) : (
            '-'
          )}
        </TableCell>

        {/* Action Btns */}
        <TableCell>
          {canEdit ? (
            <Button
              variant="ghost"
              size="icon"
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          ) : (
            //Mark as Done Btn if its pending
            task.status === TaskStatus.PENDING && (
              <Button
                variant="outline"
                size="sm"
                className="gap-2 text-green-600 border-green-200 hover:bg-green-50"
                onClick={handleEmployeeComplete}
              >
                <CheckCircle2 className="h-4 w-4" /> Done
              </Button>
            )
          )}
        </TableCell>
        <TableCell className="text-right">
        <div className="flex items-center  gap-2">
          <TaskDetailsDialog task={task} />
        </div>
      </TableCell>
      </TableRow>

      {/* dialogs*/}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete &quot;{task.title}&quot;.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={() => deleteTask(task.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={statusConfirm.open}
        onOpenChange={(open) => setStatusConfirm({ open, newStatus: null })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Status Change</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to change the status of &quot;{task.title}
              &quot; to <strong>{statusConfirm.newStatus}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmStatusChange}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
