import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsApi } from '../api/projects-api';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { CreateProjectDto } from '../types';
import { Project } from '@/features/projects/types';

/**
 * Hook to retrieve all projects for the current user's organization.
 * @returns - The result of the query.
 * It contains the projects and methods to handle the query state.
 * Will only fetch the data when a user is logged in and has an organizationId.
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
 * @returns - The result of the query.
 * It contains the projects and methods to handle the query state.
 */
export const useAllProjects = () => {
  return useQuery({
    queryKey: ['projects', 'all'],
    queryFn: projectsApi.getAllProjects,
  });
};

/**
 * Hook to create a new project (Manager only).
 * @returns - The result of the mutation.
 * It contains the project and methods to handle the mutation state.
 * Will invalidate the 'projects' query when the project is created successfully.
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
 * @returns - The result of the mutation.
 * It contains the updated project and methods to handle the mutation state.
 * Will update the 'projects' cash when the project is edited successfully.
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
 * @returns - The result of the mutation.
 * It contains the deleted project and methods to handle the mutation state.
 * Will update the 'projects' cash when the project is deleted successfully.
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
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};
