import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsApi } from '../api/projects-api';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { CreateProjectDto } from '../types';
import { Project } from '@/features/projects/types';

/**
 * - Manager : Hook to retrieve all projects for the current user's organization.
 */
export const useOrgProjects = (page: number = 1, limit: number = 20) => {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: ['projects', 'org', user?.organizationId, page, limit],
    queryFn: () => projectsApi.getOrgProjects(page, limit),
    enabled: !!user?.organizationId,
  });
};

/**
 * @deprecated - 'not used rn, to be used or removed later'
 * - Admin : Hook to retrieve all projects system-wide.
 */
export const useAllProjects = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: ['projects', 'all', page, limit],
    queryFn: () => projectsApi.getAllProjects(page, limit),
  });
};

/**
 * - Manager : Hook to create a new project.
 */
export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProjectDto) => projectsApi.createProject(data),
    onSuccess: () => {
      // refresh list
      queryClient.invalidateQueries({ queryKey: ['projects', 'org'] });
    },
  });
};

/**
 * - Manager : Hook to edit a project.
 */
export const useEditProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      data,
    }: {
      projectId: string;
      data: Partial<Project>;
    }) => projectsApi.editProject(projectId, data),

    onSuccess: (updatedProject) => {
      queryClient.setQueriesData<Project[]>(
        { queryKey: ['projects', 'org'] },
        (old) =>
          old?.map((p) => (p.id === updatedProject.id ? updatedProject : p)) ||
          [],
      );
    },
  });
};

/**
 * - Manager : Hook to delete (soft delete) a project and its associated tasks.
 */
export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: projectsApi.deleteProject,

    onSuccess: (_, projectId) => {
      queryClient.setQueriesData<Project[]>(
        { queryKey: ['projects', 'org'] },
        (old) => old?.filter((p) => p.id !== projectId) || [],
      );
      //invalidate  tasks list (after deleting a project)
      queryClient.invalidateQueries({
        queryKey: ['tasks', 'project', projectId],
      });
      queryClient.invalidateQueries({ queryKey: ['projects', 'archived'] });
    },
  });
};

/**
 * - Manager : Hook to retrieve archived projects.
 */
export const useArchiveProject = (page: number = 1, limit: number = 20) => {
  return useQuery({
    queryKey: ['projects', 'archived', page, limit],
    queryFn: () => projectsApi.getArchivedProjects(page, limit),
  });
};

/**
 * - Manager : Hook to restore a soft deleted project and its associated tasks.
 */
export const useRestoreProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) => projectsApi.restoreProject(projectId),
    onSuccess: (_, projectId) => {
      //invalidate active org projects
      queryClient.invalidateQueries({ queryKey: ['projects', 'org'] });
      //invalidate archived projects
      queryClient.invalidateQueries({ queryKey: ['projects', 'archived'] });

      //invalidate  tasks list (after restoring a project)
      queryClient.invalidateQueries({
        queryKey: ['tasks', 'project', projectId],
      });
    },
  });
};
