import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from '@tanstack/react-query';
import { orgApi } from '../api/org-api';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { CreateOrgDto, PaginatedOrg } from '../types';

/**
 * Manager: Hook to create a new organization.
 */
export const useCreateOrganization = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrgDto) => orgApi.createOrganization(data),

    onSuccess: async (response) => {
      setUser(response.user);
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
    },
  });
};

/**
 * Hook to get the current user's organization.
 */
export const useMyOrganization = () => {
  return useQuery({
    queryKey: ['organizations', 'my-org'],
    queryFn: () => orgApi.getMyOrganization(),
  });
};

/**
 * Manager: Hook to upload the logo of the current user's organization.
 */
export const useUploadOrgLogo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => orgApi.uploadOrgLogo(file),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['organizations', 'my-org'],
      });
    },
  });
};

/**
 * Manager: Hook to update the name of the current user's organization.
 */
export const useUpdateOrgName = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => orgApi.updateOrgName(name),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['organizations', 'my-org'],
      });
    },
  });
};

//.................Admin APIs.................

/**
 * Admin: Hook to retrieve all organizations (Paginated).
 */

export const useAllOrganizations = (
  page: number = 1,
  limit: number = 20,
): UseQueryResult<PaginatedOrg> => {
  return useQuery({
    queryKey: ['organizations', 'admin-all', page, limit],
    queryFn: () => orgApi.getAllOrganizations(page, limit),
  });
};

/**
 * Admin: Hook to remove an organization(soft delete) with all its associated data.
 */
export const useRemoveOrg = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orgId: string) => orgApi.removeOrganization(orgId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['organizations', 'admin-all'],
      });
      queryClient.invalidateQueries({
        queryKey: ['organizations', 'admin-archived'],
      });
      queryClient.invalidateQueries({ queryKey: ['users', 'admin-all'] });

      queryClient.invalidateQueries({ queryKey: ['admin', 'analytics'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'activity'] });
    },
  });
};

/**
 * Admin: Hook to retrieve all archived organizations (Paginated).
 */
export const useArchivedOrgs = (page: number = 1, limit: number = 20) => {
  return useQuery({
    queryKey: ['organizations', 'admin-archived', page, limit],
    queryFn: () => orgApi.getArchivedOrgs(page, limit),
  });
};

/**
 * Admin: Hook to restore a soft deleted organization and all its associated data.
 */
export const useRestoreOrg = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orgId: string) => orgApi.restoreOrganization(orgId),
    onSuccess: () => {
      //invalidate active orgs
      queryClient.invalidateQueries({ queryKey: ['organizations', 'admin-all'] });
      //invalidate archived orgs
      queryClient.invalidateQueries({ queryKey: ['organizations', 'admin-archived'] });

      //invalidate  archived users
      queryClient.invalidateQueries({ queryKey: ['users', 'archived'] });

      //invalidate active users
      queryClient.invalidateQueries({ queryKey: ['users', 'admin-all'] });

      queryClient.invalidateQueries({ queryKey: ['admin', 'analytics'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'activity'] });
    },
  });
};
