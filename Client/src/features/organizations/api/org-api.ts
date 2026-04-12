import api from '@/lib/api/axios';
import {
  CreateOrgDto,
  CreateOrgResponse,
  Organization,
  PaginatedOrg,
} from '../types';

export const orgApi = {
  /**
   * - Manager : Create a new organization.
   * @returns The newly created organization data.
   */
  createOrganization: async (payload: CreateOrgDto) => {
    const { data } = await api.post<CreateOrgResponse>(
      '/organizations',
      payload,
    );
    return data;
  },

  /**
   * - Manager : Get the current user's organization.
   * @returns The current user's organization data.
   */
  getMyOrganization: async () => {
    const { data } = await api.get<Organization>('/organizations/my-org');
    return data;
  },

  /**
   * - Manager : Upload or update Organization Logo
   * @returns The updated Organization data
   */
  uploadOrgLogo: async (file: File) => {
    const formData = new FormData();
    formData.append('logo', file);
    const { data } = await api.patch<Organization>(
      '/organizations/logo',
      formData,
    );
    return data;
  },

  /**
   * - Manager : Update Organization Name
   * @returns The updated Organization data
   */
  updateOrgName: async (name: string) => {
    const { data } = await api.patch<Organization>('/organizations/name', {
      name,
    });
    return data;
  },

  //--------Admin APIs--------

  /**
   * - Admin : Get all organizations (Paginated).
   * @returns An object containing organizations data[ ] and pagination metadata.
   */
  getAllOrganizations: async (
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginatedOrg> => {
    const { data } = await api.get('/organizations', {
      params: { page, limit },
    });
    return data;
  },

  /**
   * - Admin : Soft Delete an Organization.
   * @returns deletion success message
   */
  removeOrganization: async (orgId: string): Promise<{ message: string }> => {
    const { data } = await api.delete<{ message: string }>(
      `/organizations/${orgId}`,
    );
    return data;
  },

  /**
   * - Admin : Get All Soft deleted Organizations (paginated).
   * @returns An object containing organizations data[ ] and pagination metadata.
   */
  getArchivedOrgs: async (
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginatedOrg> => {
    const { data } = await api.get('/organizations/archived', {
      params: { page, limit },
    });
    return data;
  },

  /**
   * - Admin : Restore a soft deleted organization.
   * @returns restoration success message
   */
  restoreOrganization: async (orgId: string): Promise<{ message: string }> => {
    const { data } = await api.patch<{ message: string }>(
      `/organizations/${orgId}/restore`,
    );
    return data;
  },
};
