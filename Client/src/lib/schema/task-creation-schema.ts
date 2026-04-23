import { TaskPriority } from '@/features/tasks/types';
import * as z from 'zod';


export const creatTaskSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(50, 'Title must be at most 50 characters'),
  description: z.string().max(500, 'Description must be at most 500 characters').optional(),
  deadline: z.string().min(1, 'Deadline is required'),
  priority: z.enum(TaskPriority),
  assignedToId: z.uuid('Must be a valid user ID'),
  projectId: z.uuid('Please select a project'),
});

export type CreatTaskValues = z.infer<typeof creatTaskSchema>;