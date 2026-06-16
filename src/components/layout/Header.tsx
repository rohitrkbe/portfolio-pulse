'use client';

import Link from 'next/link';
import { useTheme } from '@/providers/ThemeProvider';
import { useAuth } from '@/hooks/useAuth';
import { SunIcon, MoonIcon, LogoutIcon, BriefcaseIcon } from '@/components/ui/Icons';
import { ROUTES } from '@/constants/routes';

export default function Header() {
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link href={ROUTES.dashboard} className="flex items-center gap-2 group">
            <div className="p-1.5 bg-blue-600 rounded-lg group-hover:bg-blue-700 transition-colors">
              <BriefcaseIcon className="w-4 h-4 text-white" />
            </div>
            <div className="leading-tight">
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                Portfolio Pulse
              </span>
              <span className="hidden sm:block text-[10px] text-slate-500 dark:text-slate-400 -mt-0.5">
                Wealth Management
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              {isDark ? <SunIcon className="w-4 h-4" /> : <MoonIcon className="w-4 h-4" />}
            </button>

            {user && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-white">
                    {user.name.split(' ').map((n) => n[0]).join('')}
                  </span>
                </div>
                <div className="leading-tight">
                  <p className="text-xs font-medium text-slate-900 dark:text-slate-100">{user.name}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">{user.role}</p>
                </div>
              </div>
            )}

            <button
              onClick={logout}
              aria-label="Logout"
              className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 dark:text-slate-400 dark:hover:text-red-400 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogoutIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
