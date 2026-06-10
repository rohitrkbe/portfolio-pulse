'use client';

import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectAllClients, selectFilteredSortedClients } from '@/store/slices/clientsSlice';
import { fetchClients } from '@/store/thunks/clientsThunks';
import { selectUser } from '@/store/slices/authSlice';
import SummaryStats from '@/components/dashboard/SummaryStats';
import FilterSortBar from '@/components/dashboard/FilterSortBar';
import ClientsTable from '@/components/dashboard/ClientsTable';
import Card from '@/components/ui/Card';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function DashboardPage() {
  const dispatch = useDispatch();
  const allClients = useSelector(selectAllClients);
  const visibleClients = useSelector(selectFilteredSortedClients);
  const user = useSelector(selectUser);

  // Guard prevents double dispatch in React Strict Mode — ref persists across remount cycles
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    dispatch(fetchClients());
  }, [dispatch]);

  const firstName = user?.name?.split(' ')[0] ?? 'RM';
  const dateLabel = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="relative pb-1">
        {/* Gradient accent line */}
        <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-blue-500/0 via-blue-500/40 to-blue-500/0" />

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 animate-fade-in-up">
              {getGreeting()}, {firstName}
            </h1>
            <p
              className="mt-0.5 text-sm text-slate-500 dark:text-slate-400 animate-fade-in"
              style={{ animationDelay: '60ms' }}
            >
              {dateLabel}
            </p>
          </div>

          {/* Live indicator */}
          <div
            className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 animate-fade-in"
            style={{ animationDelay: '120ms' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live
          </div>
        </div>
      </div>

      {/* Summary KPI cards */}
      <div className="animate-fade-in-up" style={{ animationDelay: '80ms' }}>
        <SummaryStats />
      </div>

      {/* Client table with filter/sort */}
      <div className="animate-fade-in-up" style={{ animationDelay: '140ms' }}>
        <Card padding={false} className="overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
            <FilterSortBar
              totalVisible={visibleClients.length}
              totalAll={allClients.length}
            />
          </div>
          <div className="px-0 py-0">
            <ClientsTable />
          </div>
        </Card>
      </div>
    </div>
  );
}
