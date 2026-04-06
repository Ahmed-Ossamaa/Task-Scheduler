import api from '@/lib/api/axios';
import { CreateOrgDto, CreateOrgResponse, Organization, PaginatedOrg } from '../types';

export const orgApi = {
  createOrganization: async (payload: CreateOrgDto) => {
    const { data } = await api.post<CreateOrgResponse>(
      '/organizations/create',
      payload,
    );
    return data;
  },

  getMyOrganization: async () => {
    const { data } = await api.get<Organization>('/organizations/my-org');
    return data;
  },

  uploadOrgLogo: async (file: File) => {
    const formData = new FormData();
    formData.append('logo', file);
    const { data } = await api.patch<Organization>('/organizations/update-logo', formData);
    return data;
  },
  updateOrgName: async (name: string) => {
    const { data } = await api.patch<Organization>('/organizations/update-name', { name });
    return data;
  },

  //Admin APIs
  getAllOrganizations: async (
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginatedOrg> => {
    const { data } = await api.get('/organizations/all', {
      params: { page, limit },
    });
    return data;
  },

  removeOrganization: async (orgId: string): Promise<{ message: string }> => {
    const { data } = await api.patch<{ message: string }>(
      `/organizations/remove/${orgId}`,
    );
    return data;
  },
};
