import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import AuthGuard from '@/components/layout/AuthGuard';

export const metadata: Metadata = {
  title: 'Dashboard — Portfolio Pulse',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <Header />
        <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
