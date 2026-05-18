import api from '@/lib/api/axios';
import {
  CreateOrgDto,
  CreateOrgResponse,
  Organization,
  OrgProfile,
  PaginatedOrg,
} from '../types';
import { OrgProfileFormValues } from '@/lib/schema/org-profile-schema';

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
    const { data } = await api.get<OrgProfile>('/organizations/my-org');
    return data;
  },

  /**
   * - Manager : Upload or update Organization Logo
   * @returns The updated Organization data
   */
  uploadOrgImage: async (file: File, type: 'logo' | 'cover') => {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await api.patch<Organization>(
      `/organizations/media?type=${type}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return data;
  },

  /**
   * - Manager : Update Organization Name
   * @returns The updated Organization data
   */
  updateOrgProfile: async (values: OrgProfileFormValues) => {
    const { data } = await api.patch<OrgProfileFormValues>(
      '/organizations/profile',
      values,
    );
    return data;
  },

  //--------Admin APIs--------

  getOrgProfile: async (orgId: string): Promise<OrgProfile> => {
    const { data } = await api.get<OrgProfile>(`/organizations/${orgId}`);
    return data;
  },

  /**
   * - Admin : Get all organizations (Paginated).
   * @returns An object containing organizations data[ ] and pagination metadata.
   */
  getAllOrganizations: async (
    page: number = 1,
    limit: number = 20,
    search?: string,
  ): Promise<PaginatedOrg> => {
    const { data } = await api.get('/organizations', {
      params: { page, limit, search },
    });
    return data;
  },

  /**
   * - Admin : Get organizations names according to search (limited to 20 results) .
   * - if {search} is not provided, returns max 20 of organizations names "ASC".
   * @returns An array of organizations names & ids.
   */
  getAllOrgsNames: async (
    search?: string,
    limit: number = 20,
  ): Promise<{ id: string; name: string }[]> => {
    const { data } = await api.get('/organizations/names', {
      params: { search, limit },
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
