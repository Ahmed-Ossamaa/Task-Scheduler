export interface Project {
  id: string;
  name: string;
  description?: string;
  organizationId: string;
  createdAt: string;
}

export interface PaginatedProject {
  data: Project[] | [];
  total: number;
  page: number;
  lastPage: number;
}

export interface CreateProjectDto {
  name: string;
  description?: string;
}
