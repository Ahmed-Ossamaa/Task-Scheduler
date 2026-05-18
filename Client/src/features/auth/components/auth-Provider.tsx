'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/features/auth/store/auth.store';
import axios from 'axios';
import Cookies from 'js-cookie';
import { setAccessToken, clearAuth } from '@/features/auth/store/auth.store';
import { Loader2 } from 'lucide-react';

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const setUser = useAuthStore((state) => state.setUser);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      // if user has no session (skip api calls)
      if (!Cookies.get('hasSession')) {
        setReady(true);
        return;
      }

      try {
        //  Get fresh access token  1st
        const refreshRes = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          {},
          { withCredentials: true },
        );

        const { accessToken, user } = refreshRes.data;
        setAccessToken(accessToken);
        setUser(user);

        // call protected endpoint with  access token
        // const { data } = await api.get('/user/me');
        // setUser(data);
      } catch (error) {
        console.log('Auth: Session expired or invalid', error);
        clearAuth();
      } finally {
        setReady(true);
      }
    };

    initAuth();
  }, [setUser]);

  if (!ready) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}