import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from '@tanstack/react-query';
import { orgApi } from '../api/org-api';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { CreateOrgDto, PaginatedOrg } from '../types';
import { UserRoles } from '@/features/auth/types/user-interface';
import { OrgProfileFormValues } from '@/lib/schema/org-profile-schema';

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
 * Manager/Admin: Hook to
 * - get the current Manager's organization.
 * - or
 * - get a specific organization profile by id.
 */
export const useOrganization = (orgId?: string) => {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === UserRoles.ADMIN;

  return useQuery({
    queryKey: ['organization', isAdmin ? orgId : 'me'],
    queryFn: () =>
      isAdmin ? orgApi.getOrgProfile(orgId!) : orgApi.getMyOrganization(),
    enabled: isAdmin ? !!orgId : true,
  });
};

/**
 * Manager: Hook to upload the logo of the current user's organization.
 */
export const useUploadOrgImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file, type }: { file: File; type: 'logo' | 'cover' }) =>
      orgApi.uploadOrgImage(file, type),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['organization', 'me'],
      });
    },
  });
};

/**
 * Manager: Hook to update the name of the current user's organization
 */
export const useUpdateOrgProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data:OrgProfileFormValues) => orgApi.updateOrgProfile(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['organization', 'me'],
      });
    },
  });
};

//.................Admin APIs.................

/**
 * Admin: Hook to retrieve all organizations with optional search (Paginated).
 */

export const useAllOrganizations = (
  page: number = 1,
  limit: number = 20,
  search?: string,
): UseQueryResult<PaginatedOrg> => {
  return useQuery({
    queryKey: ['organizations', 'admin-all', page, limit, search],
    queryFn: () => orgApi.getAllOrganizations(page, limit, search),
  });
};

/**
 * Admin: Hook to retrieve all organizations names (for dropdown filter).
 */
export const useOrgsNames = (search?: string, limit: number = 20) => {
  return useQuery({
    queryKey: ['organizations', 'names', search],
    queryFn: () => orgApi.getAllOrgsNames(search, limit),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    placeholderData: (previousData) => previousData,
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
      queryClient.invalidateQueries({
        queryKey: ['organizations', 'admin-all'],
      });
      //invalidate archived orgs
      queryClient.invalidateQueries({
        queryKey: ['organizations', 'admin-archived'],
      });

      //invalidate  archived users
      queryClient.invalidateQueries({ queryKey: ['users', 'archived'] });

      //invalidate active users
      queryClient.invalidateQueries({ queryKey: ['users', 'admin-all'] });

      queryClient.invalidateQueries({ queryKey: ['admin', 'analytics'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'activity'] });
    },
  });
};
