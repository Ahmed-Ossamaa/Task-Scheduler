import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../api/users-api';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { CreateEmployeeDto } from '../types';
import { User } from '@/features/auth/types/user-interface';

export const useOrgEmployees = () => {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: ['users', 'org-employees', user?.organizationId],
    queryFn: usersApi.getOrgEmployees,
    enabled: !!user?.organizationId,
  });
};

//later: need to test the cash refresh (set cash manually instead of  invalidate and refetch)
export const useCreateEmployee = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: (data: CreateEmployeeDto) => usersApi.createEmployee(data),

    // onSuccess: () => {
    //   // refresh list
    //   queryClient.invalidateQueries({ queryKey: ['users', 'org-employees'] });
    // },

    onSuccess: (newUser) => {
      queryClient.setQueryData<User[]>(
        ['users', 'org-employees', user?.organizationId],
        (old) => (old ? [...old, newUser] : [newUser]),
      );
    },
  });
};
