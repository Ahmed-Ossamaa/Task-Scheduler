'use client';

import { Task } from '../types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDateTime } from '@/lib/utils';
import { getTaskStatusBadge } from './tasks-table-row';




export function TaskDetailsDialog({ task }: { task: Task }) {
    const projectName= task.project?.name || '-';
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-green-600"
        >
          <Eye className="h-4 w-4" />
          <span className="sr-only">View Details</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-125 bg-secondary">
        <DialogHeader className='border-b border-border'>
          <DialogTitle className="text-xl capitalize">{task.title}</DialogTitle>
        </DialogHeader>
        

        <div className="grid grid-cols-2 gap-4 py-4 pl-3 text-sm">
          <div className="col-span-2 space-y-1 mb-2">
            <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              Description
            </span>
            <p className="text-foreground">
              {task.description || 'No description provided.'}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              Status
            </span>
            <div>
            {getTaskStatusBadge(task.status)}
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              Priority
            </span>
            <div className='capitalize'>
              <Badge variant="default">{task.priority}</Badge>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              Project
            </span>
            <p className="font-medium">{projectName}</p>
          </div>

          <div className="space-y-1">
            <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              Created By
            </span>
            <p className="font-medium">{task.assignedBy?.name || '-'}</p>
          </div>

          <div className="space-y-1">
            <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              Assigned To
            </span>
            <p className="font-medium">
              {task.assignedTo?.name || 'Unassigned'}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              Created At
            </span>
            <p className="font-medium">{formatDateTime(task.createdAt)}</p>
          </div>

          <div className="space-y-1">
            <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              Deadline
            </span>
            <p className="font-medium text-destructive">
              {formatDateTime(task.deadLine)}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              Completed At
            </span>
            <p className="font-medium text-green-600">
              {formatDateTime(task.completedAt)}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
