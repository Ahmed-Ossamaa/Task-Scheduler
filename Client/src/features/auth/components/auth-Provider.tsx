'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/features/auth/store/auth.store'; 
import api from '@/lib/api/axios';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data } = await api.get('/auth/refresh'); 
        setUser(data); 

      } catch (error) {
        console.log("Auth:", error || "No active session found");
      }
    };

    initAuth();
  }, [setAccessToken, setUser]);

  return <>{children}</>;
}