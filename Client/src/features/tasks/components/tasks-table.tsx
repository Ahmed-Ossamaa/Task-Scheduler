import { Task } from '../types';
import { TaskTableRow } from './tasks-table-row';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Loader2 } from 'lucide-react';

interface TaskTableProps {
  tasks: Task[] | undefined;
  isLoading: boolean;
  showAssignee?: boolean;
  showProject?: boolean;
  canEdit: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  employees?: any[];
}

export function TaskTable({
  tasks,
  isLoading,
  showAssignee = false,
  showProject = false,
  canEdit,
  employees = [],
}: TaskTableProps) {
  const colSpan = 5 + (showAssignee ? 1 : 0) + (showProject ? 1 : 0) + 1; 
  return (
    <div className="rounded-md border bg-card w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
            {showProject && <TableHead>Project</TableHead>}
            {showAssignee && <TableHead>Assigned To</TableHead>}
            <TableHead>Deadline</TableHead>
            <TableHead>Completed</TableHead>
            <TableHead className="w-25"></TableHead> {/* Actions Column */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell
                colSpan={colSpan}
                className="h-24 text-center"
              >
                <Loader2 className="h-4 w-4 animate-spin mx-auto" />
              </TableCell>
            </TableRow>
          ) : !tasks || tasks.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={colSpan}
                className="h-24 text-center text-muted-foreground"
              >
                No tasks found.
              </TableCell>
            </TableRow>
          ) : (
            tasks.map((task) => (
              <TaskTableRow
                key={task.id}
                task={task}
                canEdit={canEdit}
                showAssignee={showAssignee}
                showProject= {showProject}
                employees={employees}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
