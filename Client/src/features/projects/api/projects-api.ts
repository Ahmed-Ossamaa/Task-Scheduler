import api from '@/lib/api/axios';

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

export const projectsApi = {
  getOrgProjects: async () => {
    const { data } = await api.get<Project[]>('/projects/org');
    return data;
  },

  createProject: async (payload: CreateProjectDto) => {
    const { data } = await api.post<Project>('/projects', payload);
    return data;
  },

  getAllProjects: async () => {
    const { data } = await api.get<PaginatedProject>('/projects');
    return data;
  }
};
