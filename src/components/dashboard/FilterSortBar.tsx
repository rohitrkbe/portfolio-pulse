'use client';

import { useState, useTransition, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '@/store';
import {
  setRiskFilter,
  setRebalancingFilter,
  setSearchQuery,
  setSort,
  toggleSortOrder,
  selectFilters,
  selectSort,
} from '@/store/slices/clientsSlice';
import { RISK_PROFILE_LIST, SORT_FIELDS, SORT_ORDERS } from '@/constants/domain';
import { DEBOUNCE_MS } from '@/constants/ui';
import { DASHBOARD_STRINGS } from '@/constants/strings';
import { SearchIcon, ArrowUpDownIcon } from '@/components/ui/Icons';

interface SortOption {
  label: string;
  field: string;
}

const SORT_OPTIONS: SortOption[] = [
  { label: 'AUM',        field: SORT_FIELDS.AUM },
  { label: 'Return 1M', field: SORT_FIELDS.RETURN_1M },
  { label: 'YTD',       field: SORT_FIELDS.RETURN_YTD },
  { label: 'Risk',      field: SORT_FIELDS.RISK },
  { label: 'Name',      field: SORT_FIELDS.NAME },
];

interface FilterSortBarProps {
  totalVisible: number;
  totalAll: number;
}

export default function FilterSortBar({ totalVisible, totalAll }: FilterSortBarProps) {
  const dispatch = useDispatch<AppDispatch>();
  const filters = useSelector(selectFilters);
  const sort = useSelector(selectSort);

  // Local input state keeps the field responsive on every keystroke.
  // Redux dispatch (which triggers the expensive filter + re-render) is:
  //   1. Debounced — waits for the user to stop typing for 250ms
  //   2. Wrapped in startTransition — marked as non-urgent so React can
  //      interrupt it if a higher-priority update (e.g. next keystroke) arrives
  const [inputValue, setInputValue] = useState(filters.searchQuery);
  const [isPending, startTransition] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = useCallback(
    (value: string) => {
      setInputValue(value);

      if (debounceRef.current) clearTimeout(debounceRef.current);

      debounceRef.current = setTimeout(() => {
        startTransition(() => {
          dispatch(setSearchQuery(value));
        });
      }, DEBOUNCE_MS);
    },
    [dispatch]
  );

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
      <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
        <div className="relative">
          <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder={DASHBOARD_STRINGS.SEARCH_PLACEHOLDER}
            value={inputValue}
            onChange={(e) => handleSearch(e.target.value)}
            className={`pl-8 pr-3 py-1.5 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 transition-opacity ${
              isPending ? 'opacity-70' : 'opacity-100'
            }`}
          />
          {isPending && (
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          )}
        </div>

        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
          {RISK_PROFILE_LIST.map((profile) => (
            <button
              key={profile}
              onClick={() => dispatch(setRiskFilter(profile))}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                filters.riskProfile === profile
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {profile}
            </button>
          ))}
        </div>

        <button
          onClick={() => dispatch(setRebalancingFilter(!filters.requiresRebalancing))}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
            filters.requiresRebalancing
              ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700 text-amber-700 dark:text-amber-300'
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${filters.requiresRebalancing ? 'bg-amber-500' : 'bg-slate-300'}`} />
          {DASHBOARD_STRINGS.ALERTS_ONLY}
        </button>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {totalVisible === totalAll ? `${totalAll} clients` : `${totalVisible} of ${totalAll}`}
        </span>

        <div className="flex items-center gap-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.field}
              onClick={() =>
                sort.field === opt.field
                  ? dispatch(toggleSortOrder())
                  : dispatch(setSort({ field: opt.field, order: SORT_ORDERS.DESC as 'desc' }))
              }
              className={`flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md transition-colors ${
                sort.field === opt.field
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {opt.label}
              {sort.field === opt.field && (
                <ArrowUpDownIcon className="w-3 h-3" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
