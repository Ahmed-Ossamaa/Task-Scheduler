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


/**
 * Hook to delete (soft delete) an employee and their tasks (Manager only).
 * @returns The result of the mutation.
 *
 * Will invalidate the 'org-employees' query when the employee is deleted successfully.
 * Will remove the employee from the cached list.
 */
export const  useDeleteEmployee = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: usersApi.deleteEmployee,
    onSuccess: (_, employeeId) => {
      //remove employee from the cashed list
      queryClient.setQueryData<User[]>(
        ['users', 'org-employees', user?.organizationId],
        (old) => old?.filter((emp) => emp.id !== employeeId)||[],
      );

      //invalidate  tasks list (after deleting an employee)
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  })
}

  export const useEditMyProfile = () => {
    const queryClient = useQueryClient();
    const setUser = useAuthStore((state) => state.setUser);
  
    return useMutation({
      mutationFn: usersApi.editMyProfile,
      onSuccess: (updatedUser) => {
        // Update user in the store
        setUser(updatedUser);
        // refresh list (Later:(not sure if needed here))
        queryClient.invalidateQueries({ queryKey: ['users', 'me'] });
      },
    })
  }