import { TaskResponseDto } from './tasks-response.dto';

export interface PaginatedTasksDto {
  data: TaskResponseDto[];
  total: number;
  page: number;
  lastPage: number;
}
