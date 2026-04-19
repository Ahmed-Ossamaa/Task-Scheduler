import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../api/users-api';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { CreateEmployeeDto } from '../types';
import { User, UserRoles } from '@/features/auth/types/user-interface';

export const useGetMe = () => {
  return useQuery({
    queryKey: ['users', 'me'],
    queryFn: usersApi.getMyProfile,
  });
};

/**
 * - Manager/Emp : Hook to get all employees in the current organization.
 */
export const useOrgEmployees = (page: number = 1, limit: number = 20) => {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: ['users', 'org-employees', user?.organizationId, page, limit],
    queryFn: () => usersApi.getOrgEmployees(page, limit),
    enabled: !!user?.organizationId,
  });
};

/**
 * - Manager : Hook to create a new employee.
 */
export const useCreateEmployee = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: (data: CreateEmployeeDto) => usersApi.createEmployee(data),
    onSuccess: (newUser) => {
      queryClient.setQueryData<User[]>(
        ['users', 'org-employees', user?.organizationId],
        (old) => (old ? [...old, newUser] : [newUser]),
      );
    },
  });
};

/**
 * - Manager : Hook to delete (soft delete) an employee and their tasks.
 */
export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: usersApi.removeEmployee,
    onSuccess: () => {
      //invalidate active list
      queryClient.invalidateQueries({
        queryKey: ['users', 'org-employees', user?.organizationId],
      });

      //invalidate archived list
      queryClient.invalidateQueries({
        queryKey: ['users', 'archived', 'org-employees', user?.organizationId],
      });

      //invalidate  tasks list (after deleting an employee)
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

/**
 * - Manager : Hook to get all archived (soft Deleted) employees in the current organization.
 */
export const useArchivedEmployees = (page: number = 1, limit: number = 20) => {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: [
      'users',
      'archived',
      'org-employees',
      user?.organizationId,
      pageXOffset,
      limit,
    ],
    queryFn: () => usersApi.getArchivedEmployees(page, limit),
    enabled: !!user?.organizationId,
  });
};

/**
 * - Manager : Hook to restore an employee and his tasks (Soft Deleted).
 */
export const useRestoreEmployee = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: (userId: string) => usersApi.restoreEmployee(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['users', 'archived', 'org-employees', user?.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ['users', 'org-employees', user?.organizationId],
      });
    },
  });
};
/**
 * - Manager : Hook to update an employee's role.
 */
export const useUpdateEmployeeRole = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: ({
      employeeId,
      role,
    }: {
      employeeId: string;
      role: UserRoles | string;
    }) => usersApi.updateEmpRole(employeeId, role),

    onSuccess: (updatedEmp) => {
      queryClient.setQueryData<User[]>(
        ['users', 'org-employees', user?.organizationId],
        (old) =>
          old?.map((emp) => (emp.id === updatedEmp.id ? updatedEmp : emp)) ||
          [],
      );
    },
  });
};

/**
 * - Hook to update the current user's profile data (excluding email, pass, avatar).
 */
export const useEditMyProfile = () => {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: usersApi.editMyProfile,
    onSuccess: (updatedUser) => {
      // Update user in the store
      setUser(updatedUser);
      // refresh list
      queryClient.invalidateQueries({ queryKey: ['users', 'me'] });
    },
  });
};

//.......Admin Hooks .............

/**
 * - Admin : Hook to retrieve all users (Paginated).
 */
export const useAllUsers = (page: number = 1, limit: number = 20) => {
  return useQuery({
    queryKey: ['users', 'admin-all', page, limit],
    queryFn: () => usersApi.getAllUsers(page, limit),
  });
};

/**
 * - Admin : Hook to soft delete any user and his tasks.
 */
export const useAdminDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => usersApi.removeUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'admin-all'] });
      queryClient.invalidateQueries({ queryKey: ['users', 'archived'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'analytics'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'activity'] });
    },
  });
};

/**
 * - Admin : Hook to Get All Archived Users Paginated.
 */

export const useArchivedUsers = (page: number = 1, limit: number = 20) => {
  return useQuery({
    queryKey: ['users', 'archived', page, limit],
    queryFn: () => usersApi.getArchivedUsers(page, limit),
  });
};
/**
 * - Admin : Hook to restore any soft deleted user and his tasks.
 */
export const useAdminRestoreUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => usersApi.restoreUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'admin-all'] });
      queryClient.invalidateQueries({ queryKey: ['users', 'archived'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'analytics'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'activity'] });
    },
  });
};
