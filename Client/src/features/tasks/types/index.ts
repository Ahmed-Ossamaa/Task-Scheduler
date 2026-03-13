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

// Matches your CreateTaskDTO
export interface CreateTaskDto {
  title: string;
  description?: string;
  deadline: string;
  priority: TaskPriority;
  assignedToId: string;
}

// Matches your UpdateTaskDto
export interface UpdateTaskDto {
  title?: string;
  description?: string;
  deadline?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
}

export type Task = {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    deadline: string;
    completedAt?: string;
    createdAt: string;
    updatedAt?: string;
    deletedAt?: string;
    assignedToId: string;
    assignedTo?: User;
    assignedById?: string;
    assignedBy?: User;
    organizationId: string;
    
}
export interface Tasks {
  data: Task[];
  total: number;
  page: number;
  lastPage: number;
}
