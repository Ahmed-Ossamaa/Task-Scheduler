import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authApi } from '../api/auth-api';
import { useAuthStore } from '../store/auth.store';
import { LoginDto, RegisterDto } from '../types/auth-dto';
import { ChangePasswordValues } from '@/lib/schema/password.schema';


export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterDto) => authApi.register(data),
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  return useMutation({
    mutationFn: (data: LoginDto) => authApi.login(data),
    onSuccess: (data) => {
      queryClient.clear();
      // Updating  Store
      setUser(data.user);
      setAccessToken(data.accessToken);
    },
  });
};

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      // Clear the query cache
      queryClient.clear();
      // Clear the auth store (remove refresh token)
      clearAuth();
      // Redirect to the login page
      router.push('/login');
    },
  });
};

export const useChangePassword = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useMutation({
    mutationFn: (data: ChangePasswordValues) => authApi.changePassword(data),
    onSuccess: () => {
      queryClient.clear();
      clearAuth();
      router.push('/login');
    },
  });
};


export const useResetPassword = () => {
  return useMutation({
    mutationFn: ({ token, newPassword }: { token: string; newPassword: string }) =>
      authApi.resetPassword(token, newPassword),
  });
}


export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (email: string) => authApi.forgotPassword(email),
  });
};
