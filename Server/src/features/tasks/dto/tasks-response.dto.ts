import { TaskPriority } from '../enums/tasks-priority.enums';
import { TaskStatus } from '../enums/tasks-status.enums';

export class TaskResponseDto {
  id!: string;
  title!: string;
  description!: string | null;
  status!: TaskStatus;
  priority!: TaskPriority;
  deadLine!: Date;
  completedAt!: Date | null;
  createdAt!: Date;
  updatedAt!: Date;
  assignedToId!: string;
  assignedById!: string;
  projectId!: string | null;
  organizationId!: string;

  project!: {
    id: string;
    name: string;
  } | null;

  assignedTo!: {
    id: string;
    name: string;
  } | null;

  assignedBy!: {
    id: string;
    name: string;
  } | null;
}
