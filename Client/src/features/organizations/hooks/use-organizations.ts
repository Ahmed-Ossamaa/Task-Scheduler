import { useMutation } from '@tanstack/react-query';
import { orgApi } from '../api/org-api';
import { useAuthStore } from '@/features/auth/store/auth.store';
import api from '@/lib/api/axios';
import { CreateOrgDto } from '../types/create-orgDto';

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
        console.error("Failed to refresh user after org creation", error);
      }
    },
  });
};