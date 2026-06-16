'use client';

import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useRef, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { AppDispatch } from '@/store';
import { selectFilteredSortedClients, selectClientsLoading, selectClientsError } from '@/store/slices/clientsSlice';
import { fetchClients } from '@/store/thunks/clientsThunks';
import { SectionLoader } from '@/components/ui/LoadingSpinner';
import { ErrorState } from '@/components/ui/EmptyState';
import { ERROR_STRINGS, TABLE_HEADERS } from '@/constants/strings';
import { ROUTES } from '@/constants/routes';
import { CLIENTS_TABLE } from '@/constants/ui';
import { ClientRow } from './clients/ClientRow';

const HEADERS = [
  TABLE_HEADERS.CLIENT,
  TABLE_HEADERS.AUM,
  TABLE_HEADERS.RETURN_1M,
  TABLE_HEADERS.RETURN_YTD,
  TABLE_HEADERS.RISK,
  TABLE_HEADERS.STATUS,
  '',
];

export default function ClientsTable() {
  const dispatch = useDispatch<AppDispatch>();
  const router   = useRouter();
  const clients  = useSelector(selectFilteredSortedClients);
  const loading  = useSelector(selectClientsLoading);
  const error    = useSelector(selectClientsError);

  const scrollRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count:           clients.length,
    getScrollElement: () => scrollRef.current,
    estimateSize:    () => CLIENTS_TABLE.ROW_HEIGHT,
    overscan:        CLIENTS_TABLE.OVERSCAN,
  });

  const handleNavigate = useCallback(
    (id: string) => router.push(ROUTES.client(id)),
    [router],
  );

  if (loading) return <SectionLoader message="Loading client portfolios…" />;
  if (error)   return <ErrorState message={error} onRetry={() => dispatch(fetchClients())} />;
  if (clients.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">{ERROR_STRINGS.NO_CLIENTS}</p>
      </div>
    );
  }

  const virtualItems  = virtualizer.getVirtualItems();
  const totalSize     = virtualizer.getTotalSize();
  const paddingTop    = virtualItems.length > 0 ? virtualItems[0].start : 0;
  const paddingBottom = virtualItems.length > 0 ? totalSize - virtualItems[virtualItems.length - 1].end : 0;

  return (
    <div ref={scrollRef} className="overflow-auto" style={{ maxHeight: CLIENTS_TABLE.MAX_HEIGHT }}>
      <table className="w-full min-w-[780px]">
        <thead className="sticky top-0 z-10 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
          <tr>
            {HEADERS.map((h, i) => (
              <th
                key={`${h}-${i}`}
                className={`py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide whitespace-nowrap ${
                  i === 0 ? 'pl-6 pr-4' : 'px-4'
                }`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
          {paddingTop > 0 && (
            <tr><td colSpan={HEADERS.length} style={{ height: paddingTop, padding: 0 }} /></tr>
          )}
          {virtualItems.map((vRow) => (
            <ClientRow
              key={clients[vRow.index].id}
              client={clients[vRow.index]}
              index={vRow.index}
              onClick={handleNavigate}
            />
          ))}
          {paddingBottom > 0 && (
            <tr><td colSpan={HEADERS.length} style={{ height: paddingBottom, padding: 0 }} /></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
