'use client';

import { useAuthStore } from '@/features/auth/store/auth.store';
import { UserRoles } from '@/features/auth/types/user-interface';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function AdminSecurityLayout({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const isAdmin= user?.role === UserRoles.ADMIN

  useEffect(() => {
    // If user is not admin
    if (user && !isAdmin) {
      router.replace('/dashboard'); 
    }
  }, [user, router, isAdmin]);

  // If user is null
  if (!user) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}