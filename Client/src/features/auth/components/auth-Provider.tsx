'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/features/auth/store/auth.store'; 
import api from '@/lib/api/axios';
import Cookies from 'js-cookie';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    const initAuth = async () => {
      if (!Cookies.get('hasSession')) {
      return; 
    }
      try {
        const { data } = await api.get('/user/me'); 
        setUser(data); 
        
      } catch (error) {
        console.log("Auth: Session expired or invalid" , error);
      }
    };

    initAuth();
  }, [setUser]);

  return <>{children}</>;
}