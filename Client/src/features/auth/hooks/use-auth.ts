import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authApi } from '../api/auth-api';
import { useAuthStore } from '../store/auth.store';
import { LoginDto } from '../types/auth-dto';
import { AxiosError } from 'axios';

export const useLogin = () => {
  const router = useRouter();
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

      //Redirect to Dashboard
      router.push('/dashboard');
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.error(
        'Login Failed:',
        error.response?.data?.message || error.message,
      );
      // will add a toast notification here later
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
