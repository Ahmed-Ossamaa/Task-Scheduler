import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsApi } from '../api/projects-api';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { CreateProjectDto } from '../types';
import { Project } from '@/features/projects/types';

/**
 * Hook to retrieve all projects for the current user's organization.
 */
export const useOrgProjects = () => {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: ['projects', 'org', user?.organizationId],
    queryFn: projectsApi.getOrgProjects,
    enabled: !!user?.organizationId,
  });
};

/**
 * Hook to retrieve all projects system-wide (Admin only).
 */
export const useAllProjects = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: ['projects', 'all', page, limit],
    queryFn: () => projectsApi.getAllProjects(page, limit),
  });
};

/**
 * Hook to create a new project (Manager only).
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
 * Hook to edit a project (Manager only).
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
 * Hook to delete (soft delete) a project and its associated tasks (Manager only).
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
      queryClient.invalidateQueries({ queryKey: ['tasks','project', projectId] });
    },
  });
};

export const useRestoreProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) => projectsApi.restoreProject(projectId),
    onSuccess: (_, projectId) => {
      queryClient.invalidateQueries({ queryKey: ['projects', 'org'] });

      //invalidate  tasks list (after restoring a project)
      queryClient.invalidateQueries({ queryKey: ['tasks', 'project', projectId] });
    },
  });
};
