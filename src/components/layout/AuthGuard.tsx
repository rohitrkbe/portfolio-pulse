'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserSession } from '@/helpers/session';
import { ROUTES } from '@/constants/routes';
import AuthLoader from './AuthLoader';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const session = getUserSession();
    if (!session) {
      router.replace(ROUTES.login);
    } else {
      setAllowed(true);
    }
  }, [router]);

  if (!allowed) return <AuthLoader />;
  return <>{children}</>;
}
