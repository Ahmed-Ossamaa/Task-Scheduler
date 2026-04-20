import api from '@/lib/api/axios';
import { User } from '../types/user-interface';
import { LoginDto, RegisterDto } from '../types/auth-dto';
import { ChangePasswordValues } from '@/lib/schema/password.schema';

export const authApi = {
  register: async (data: RegisterDto) => {
    const response = await api.post<{ message: string,user: User }>(
      '/auth/register',
      data,
    );
    return response;
  },

  login: async (data: LoginDto) => {
    const response = await api.post<{ user: User; accessToken: string }>(
      '/auth/login',
      data,
    );
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get<User>('/user/me');
    return response.data;
  },

  logout: async () => {
    await api.post('/auth/logout');
  },


  verifyEmail: async (token: string) => {
    const response = await api.post<{ message: string }>('/auth/verify-email', { token });
    return response;
  },

  resendVerification: async (email: string) => {
    const response = await api.post<{ message: string }>('/auth/resend-verification', { email });
    return response;
  },

  changePassword: async ( data:ChangePasswordValues ) => {
    const response = await api.patch<{ message: string }>('/auth/change-password', data);
    return response;
  },

  forgotPassword: async (email: string) => {
    const response = await api.post<{ message: string }>('/auth/forgot-password', { email });
    return response;
  },

  resetPassword: async (token: string, newPassword: string ) => {
    const response = await api.post<{ message: string }>('/auth/reset-password', {
      token,
      newPassword
    });
    return response;
  }


};
