'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/features/auth/store/auth.store'; 
import api from '@/lib/api/axios';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  // const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data } = await api.get('/user/me'); 
        setUser(data); 
        
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.log("Auth: Guest session", error.message);
      }
    };

    initAuth();
  }, [setUser]);

  return <>{children}</>;
}