import { User } from '@/features/auth/types/user-interface';

export enum TaskStatus {
  PENDING = 'pending',
  DONE = 'done',
  CANCELED = 'canceled',
  OVERDUE = 'overdue',
}
export enum TaskPriority {
  LOW = 'low',
  MED = 'medium',
  HIGH = 'high',
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  deadLine: string;
  priority: TaskPriority;
  assignedToId: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  deadLine?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
}

export type Task = {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    deadLine: string;
    completedAt?: string;
    createdAt: string;
    updatedAt?: string;
    deletedAt?: string;
    assignedToId: string;
    assignedTo?: User;
    assignedById?: string;
    assignedBy?: User;
    organizationId: string;
    projectId: string;
    project:Project
    
}
export type Project = {
    id: string;
    name: string;
    description?: string;
    createdAt: string;
}
export interface Tasks {
  data: Task[];
  total: number;
  page: number;
  lastPage: number;
}
