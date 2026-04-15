import api from '@/lib/api/axios';
import { CreateProjectDto, PaginatedProject, Project } from '../types';

export const projectsApi = {
  /**
   * - Manager/Emp : Get all projects by organization
   * @returns An array of projects
   */
  getOrgProjects: async (page:number=1 , limit:number=20) => {
    const { data } = await api.get<PaginatedProject>('/projects/org', {
      params: { page, limit },
    });
    return data;
  },

  /**
   * - Manager : Create a new project.
   * @returns The newly created project
   */
  createProject: async (payload: CreateProjectDto) => {
    const { data } = await api.post<Project>('/projects', payload);
    return data;
  },

  /**
   * - Admin : Get all projects (Paginated)
   * @returns promise resolving with an object containing projects data and pagination metadata.
   */
  getAllProjects: async (page: number = 1, limit: number = 20) => {
    const { data } = await api.get<PaginatedProject>('/projects', {
      params: { page, limit },
    });
    return data;
  },

  /**
   * - Manager : Edit a project .
   * @returns  The Updated project
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
   * - Manager: Delete a project and its associated tasks (Soft Delete).
   * @returns Success Deletion message on Success.
   */
  deleteProject: async (projectId: string): Promise<{ message: string }> => {
    const { data } = await api.delete<{ message: string }>(
      `/projects/${projectId}`,
    );
    return data;
  },

  /**
   * - Manager : Get archived projects (Paginated)
   * @returns An object containing projects data[ ] and pagination metadata.
   */
  getArchivedProjects: async (page: number = 1, limit: number = 20) => {
    const { data } = await api.get<PaginatedProject>('/projects/archived', {
      params: { page, limit },
    });
    return data;
  },

  /**
   * - Manager : Restore a project and its associated tasks (Soft Delete).
   * @returns  Success Restoration message on Success.
   */
  restoreProject: async (projectId: string): Promise<{ message: string }> => {
    const { data } = await api.patch<{ message: string }>(
      `/projects/${projectId}/restore`,
    );
    return data;
  },
};
