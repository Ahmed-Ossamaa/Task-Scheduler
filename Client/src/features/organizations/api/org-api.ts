import api from '@/lib/api/axios';
import { CreateOrgDto } from '../types/create-orgDto';



export const orgApi = {
  createOrganization: async (payload: CreateOrgDto) => {
    const { data } = await api.post('/organizations/create', payload);
    return data;
  },
};