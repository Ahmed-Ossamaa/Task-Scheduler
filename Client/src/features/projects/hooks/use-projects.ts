import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsApi, CreateProjectDto } from '../api/projects-api';
import { useAuthStore } from '@/features/auth/store/auth.store';

export const useOrgProjects = () => {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: ['projects', 'org', user?.organizationId],
    queryFn: projectsApi.getOrgProjects,
    enabled: !!user?.organizationId,
  });
};

export const useAllProjects = () => {
  return useQuery({
    queryKey: ['projects', 'all'],
    queryFn: projectsApi.getAllProjects,
  });
};

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
