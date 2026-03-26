import api from '@/lib/api/axios';
import { CreateProjectDto, PaginatedProject, Project } from '../types';


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
  },

  editProject: async (projectId: string,payload: Partial<Project>) => {
    const { data } = await api.patch<Project>(`/projects/${projectId}`, payload);
    return data;
  },

  deleteProject: async (projectId: string) => {
    const { data } = await api.delete<Project>(`/projects/${projectId}`);
    return data;
  },

};
