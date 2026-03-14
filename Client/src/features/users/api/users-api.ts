import api from '@/lib/api/axios';
import { User } from '@/features/auth/types/user-interface';
import { CreateEmployeeDto } from '../types';



export const usersApi = {
  getOrgEmployees: async () => {
    const { data } = await api.get<User[]>('/user/org-employees');
    return data;
  },

  createEmployee: async (payload: CreateEmployeeDto) => {
    const { data } = await api.post<User>('auth/register/employee', payload);
    return data;
  },
};
