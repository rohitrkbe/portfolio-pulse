'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '@/store/slices/authSlice';
import { AUTH_STORAGE_KEY } from '@/lib/constants';
import Header from '@/components/layout/Header';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    // After hydration check: if neither Redux nor localStorage has a session, redirect
    try {
      const session = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!session && !isAuthenticated) {
        router.replace('/login');
      }
    } catch {
      if (!isAuthenticated) router.replace('/login');
    }
  }, [isAuthenticated, router]);

  // Show spinner while Redux is hydrating from localStorage
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Header />
      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
}
