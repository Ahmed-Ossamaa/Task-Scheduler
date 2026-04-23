import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import {
  getAccessToken,
  setAccessToken,
  clearAuth,
} from '@/features/auth/store/auth.store';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach access token
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Response interceptor to handle 401 and refresh token
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (error.response?.status === 401 && !originalRequest._retry) {
      const isAuthEndpoint =
        originalRequest.url?.includes('/auth/login') ||
        originalRequest.url?.includes('/auth/register');

      if (isAuthEndpoint) {
        return Promise.reject(error);
      }
      originalRequest._retry = true;
      try {
        const refreshResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/auth/refresh`,
          {},
          { withCredentials: true },
        );

        const newAccessToken = refreshResponse.data.accessToken;
        setAccessToken(newAccessToken);

        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        clearAuth();
        if (typeof window !== 'undefined') {
          const publicPaths = [
            '/',
            '/login',
            '/register',
            '/verify-email',
            '/resend-verification',
            '/forgot-password', 
            '/reset-password',
            '/contact',
            '/about',
            '/privacy',
            '/terms',
            '/blog',
          ];
          const currentPath = window.location.pathname;

          // If the current path is not in the public paths, redirect to the login page
          if (!publicPaths.includes(currentPath)) {
            window.location.href = '/login';
          }
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default api;
