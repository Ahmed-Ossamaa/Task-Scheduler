import api from '@/lib/api/axios';
import { User } from '../types/user-interface';
import { LoginDto } from '../types/auth-dto';

export const authApi = {
  login: async (data: LoginDto) => {
    const response = await api.post<{ user: User; accessToken: string }>(
      '/auth/login',
      data,
    );
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get<User>('/users/me');
    return response.data;
  },

  logout: async () => {
    await api.post('/auth/logout');
  },
};
