import { TaskResponseDto } from '../dto/tasks-response.dto';

export interface PaginatedTasks {
  data: TaskResponseDto[];
  total: number;
  page: number;
  lastPage: number;
}
