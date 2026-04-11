import api from '@/lib/api/axios';
import { CreateOrgDto, CreateOrgResponse, Organization, PaginatedOrg } from '../types';

export const orgApi = {
  createOrganization: async (payload: CreateOrgDto) => {
    const { data } = await api.post<CreateOrgResponse>(
      '/organizations',
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
    const { data } = await api.patch<Organization>('/organizations/logo', formData);
    return data;
  },
  updateOrgName: async (name: string) => {
    const { data } = await api.patch<Organization>('/organizations/name', { name });
    return data;
  },

  //Admin APIs
  getAllOrganizations: async (
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginatedOrg> => {
    const { data } = await api.get('/organizations', {
      params: { page, limit },
    });
    return data;
  },

  removeOrganization: async (orgId: string): Promise<{ message: string }> => {
    const { data } = await api.delete<{ message: string }>(
      `/organizations/${orgId}`,
    );
    return data;
  },

  /**
   * Admin: Restore a soft deleted organization.
   * @param orgId The ID of the organization to restore.
   * @returns restoration success message.
   */
  restoreOrganization: async (orgId: string): Promise<{ message: string }> => {
    const { data } = await api.patch<{ message: string }>(
      `/organizations/${orgId}/restore`,
    );
    return data;
  },
};
