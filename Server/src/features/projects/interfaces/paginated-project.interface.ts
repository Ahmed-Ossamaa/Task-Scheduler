import { Project } from '../entities/project.entity';

export interface PaginatedProject {
  data: Project[];
  total: number;
  page: number;
  lastPage: number;
}
