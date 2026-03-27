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

  /**
   * Admin: Get all projects (Paginated)
   * @returns {Promise<PaginatedProject>} - A promise resolving with an object containing projects data and pagination metadata.
   */
  getAllProjects: async () => {
    const { data } = await api.get<PaginatedProject>('/projects');
    return data;
  },

  /**
   * Edit a project (Manager only).
   * @returns {Promise<Project>} - Updated project
   */
  editProject: async (projectId: string,payload: Partial<Project>): Promise<Project> => {
    const { data } = await api.patch<Project>(`/projects/${projectId}`, payload);
    return data;
  },

  /**
   * Manager: Delete a project and its associated tasks (Soft Delete).
   * @returns {Promise<{ message: string }>} - Success Deletion message on Success.
   */
  deleteProject: async (projectId: string):Promise<{ message: string }> => {
    const { data } = await api.delete<{ message: string }>(`/projects/${projectId}`);
    return data;
  },

};
