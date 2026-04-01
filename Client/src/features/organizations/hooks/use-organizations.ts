import { useMutation, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { orgApi } from '../api/org-api';
import { useAuthStore } from '@/features/auth/store/auth.store';
import api from '@/lib/api/axios';
import { CreateOrgDto, PaginatedOrg } from '../types';

export const useCreateOrganization = () => {
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: (data: CreateOrgDto) => orgApi.createOrganization(data),
    onSuccess: async () => {
      // refetch user after org creation  -- to get the orgId in the user and save it in the store
      try {
        const { data: updatedUser } = await api.get('/user/me');
        setUser(updatedUser);
      } catch (error) {
        console.error('Failed to refresh user after org creation', error);
      }
    },
  });
};
//later: 

//export const getMyOrg = () => {}

// export const useUploadOrgLogo = () => {}

// export const updateOrgName = () => {}



//.................Admin APIs.................


/**
 * Admin: Hook to retrieve all organizations (Paginated).
 */

export const useAllOrganizations = (page: number = 1, limit: number = 20): UseQueryResult<PaginatedOrg> => {
  return useQuery({
    queryKey: ['organizations', 'admin-all', page, limit],
    queryFn: () => orgApi.getAllOrganizations(page, limit),
  });
};


/**
 * Admin: Hook to remove an organization(soft delete) with all its associated data.
 * 
 * Will invalidate the 'organizations-admin-all' query when the org is removed successfully.
 */
export const useRemoveOrg = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orgId: string) => orgApi.removeOrganization(orgId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['organizations', 'admin-all'],
      });
    },
  });
};
