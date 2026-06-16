'use client';

import { useEffect, Suspense } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/store';
import { fetchClients } from '@/store/thunks/clientsThunks';
import { useSelector } from 'react-redux';
import { selectFilteredSortedClients } from '@/store/slices/clientsSlice';
import SummaryStats from '@/components/dashboard/SummaryStats';
import FilterSortBar from '@/components/dashboard/FilterSortBar';
import ClientsTable from '@/components/dashboard/ClientsTable';
import { SectionLoader } from '@/components/ui/LoadingSpinner';

export default function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>();
  const clients = useSelector(selectFilteredSortedClients);

  useEffect(() => {
    dispatch(fetchClients());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Client Portfolios</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Monitor and manage all client wealth portfolios
        </p>
      </div>

      <SummaryStats />

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700">
          <Suspense fallback={<SectionLoader />}>
            <FilterSortBar totalVisible={clients.length} totalAll={clients.length} />
          </Suspense>
        </div>
        <ClientsTable />
      </div>
    </div>
  );
}
