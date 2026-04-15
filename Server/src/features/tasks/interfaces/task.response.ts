import { Task } from '../entities/task.entity';

export interface PaginatedTaks {
  data: Task[];
  total: number;
  page: number;
  lastPage: number;
}
