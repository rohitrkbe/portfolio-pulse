'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AUTH_STORAGE_KEY } from '@/constants/domain';
import { ROUTES } from '@/constants/routes';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    try {
      const session = localStorage.getItem(AUTH_STORAGE_KEY);
      router.replace(session ? ROUTES.dashboard : ROUTES.login);
    } catch {
      router.replace(ROUTES.login);
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
      <LoadingSpinner size="lg" />
    </div>
  );
}
