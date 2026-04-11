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
   * @returnsA promise resolving with an object containing projects data and pagination metadata.
   */
  getAllProjects: async (page: number = 1, limit: number = 20) => {
    const { data } = await api.get<PaginatedProject>('/projects',{
       params: { page, limit },
    });
    return data;
  },

  /**
   * Edit a project (Manager only).
   * @returns {Promise<Project>} - Updated project
   */
  editProject: async (
    projectId: string,
    payload: Partial<Project>,
  ): Promise<Project> => {
    const { data } = await api.patch<Project>(
      `/projects/${projectId}`,
      payload,
    );
    return data;
  },

  /**
   * Manager: Delete a project and its associated tasks (Soft Delete).
   * @returns {Promise<{ message: string }>} - Success Deletion message on Success.
   */
  deleteProject: async (projectId: string): Promise<{ message: string }> => {
    const { data } = await api.delete<{ message: string }>(
      `/projects/${projectId}/delete`,
    );
    return data;
  },

  /**
   * Manager: Restore a project and its associated tasks (Soft Delete).
   * @returns {Promise<{ message: string }>} - Success Restoration message on Success.
   */
  restoreProject: async (projectId: string): Promise<{ message: string }> => {
    const { data } = await api.patch<{ message: string }>(
      `/projects/${projectId}/restore`,
    );
    return data;
  },
};
