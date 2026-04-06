import api from '@/lib/api/axios';
import { CreateOrgDto, CreateOrgResponse, PaginatedOrg } from '../types';




export const orgApi = {
  createOrganization: async (payload: CreateOrgDto)=> {
    const { data } = await api.post<CreateOrgResponse>('/organizations/create', payload);
    return data;
  },

//Admin APIs
  getAllOrganizations:
  async (page: number = 1, limit: number = 20): Promise<PaginatedOrg> => {
    const { data } = await api.get('/organizations/all', {
      params: { page, limit },
    });
    return data;
  },

  removeOrganization: async(orgId:string):Promise<{message:string}> =>{
    const { data } = await api.patch<{message:string}>(`/organizations/remove/${orgId}`);
    return data;
  }

};

