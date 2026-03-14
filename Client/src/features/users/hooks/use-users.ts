import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../api/users-api';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { CreateEmployeeDto } from '../types';

export const useOrgEmployees = () => {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: ['users', 'org-employees', user?.organizationId],
    queryFn: usersApi.getOrgEmployees,
    enabled: !!user?.organizationId,
  });
};

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEmployeeDto) => usersApi.createEmployee(data),
    onSuccess: () => {
      // refresh list
      queryClient.invalidateQueries({ queryKey: ['users', 'org-employees'] });
    },
  });
};
