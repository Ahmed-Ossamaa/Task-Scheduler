import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authApi } from '../api/auth-api';
import { useAuthStore } from '../store/auth.store';
import { LoginDto } from '../types/auth-dto';
import { AxiosError } from 'axios';


export const useLogin = () => {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  return useMutation({
    mutationFn: (data: LoginDto) => authApi.login(data),
    onSuccess: (data) => {
      // Updating  Store
      setUser(data.user);
      setAccessToken(data.accessToken);
      
      //Redirect to Dashboard
      router.push('/dashboard');
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.error('Login Failed:', error.response?.data?.message || error.message);
      // will add a toast notification here later
    },
  });
};