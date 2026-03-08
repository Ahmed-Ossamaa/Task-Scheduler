import { User } from '@/features/auth/types/user-interface';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
  clearAuth: () => void;
  getAccessToken: () => string | null;
}

export const useAuthStore = create<AuthState>()(
  devtools((set, get) => ({
    user: null,
    accessToken: null,
    setUser: (user) => set({ user }),
    setAccessToken: (token) => set({ accessToken: token }),
    clearAuth: () => set({ user: null, accessToken: null }),
    getAccessToken: () => get().accessToken,
  }))
);

// Helpers
export const getAccessToken = () => useAuthStore.getState().accessToken;
export const setAccessToken = (token: string) => useAuthStore.getState().setAccessToken(token);
export const clearAuth = () => useAuthStore.getState().clearAuth();
export const setUser = (user: User) => useAuthStore.getState().setUser(user);
