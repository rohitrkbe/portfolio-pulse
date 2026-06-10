'use client';

import { useEffect, use } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '@/store';
import { fetchPortfolio } from '@/store/thunks/portfolioThunks';
import {
  selectCurrentPortfolio,
  selectPortfolioLoading,
  selectPortfolioError,
  selectPerformance,
} from '@/store/slices/portfolioSlice';
import { selectClientById } from '@/store/slices/clientsSlice';
import AllocationChart from '@/components/portfolio/AllocationChart';
import PerformanceChart from '@/components/portfolio/PerformanceChart';
import HoldingsTable from '@/components/portfolio/HoldingsTable';
import RebalancingPanel from '@/components/portfolio/RebalancingPanel';
import { SectionLoader } from '@/components/ui/LoadingSpinner';
import { ErrorState } from '@/components/ui/EmptyState';
import Badge from '@/components/ui/Badge';
import { formatCurrency, formatPercentage, getReturnColorClass } from '@/lib/formatters';
import { ChevronRightIcon } from '@/components/ui/Icons';
import type { RootState } from '@/store';

function Card({ title, children, className = '' }: { title?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm ${className}`}>
      {title && (
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}

interface PageParams {
  id: string;
}

export default function ClientPortfolioPage({ params }: { params: Promise<PageParams> }) {
  const { id } = use(params);
  const dispatch = useDispatch<AppDispatch>();

  const portfolio = useSelector(selectCurrentPortfolio);
  const performance = useSelector(selectPerformance);
  const loading = useSelector(selectPortfolioLoading);
  const error = useSelector(selectPortfolioError);
  const client = useSelector((state: RootState) => selectClientById(state, id));

  useEffect(() => {
    dispatch(fetchPortfolio(id));
  }, [dispatch, id]);

  if (loading) return <SectionLoader message="Loading portfolio details…" />;
  if (error || !portfolio) {
    return (
      <ErrorState
        message={error ?? 'Portfolio not found.'}
        onRetry={() => dispatch(fetchPortfolio(id))}
      />
    );
  }

  const requiresRebalancing = portfolio.rebalancingStatus === 'pending';

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
        <Link href="/dashboard" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          Dashboard
        </Link>
        <ChevronRightIcon className="w-3.5 h-3.5" />
        <span className="text-slate-900 dark:text-slate-100 font-medium">
          {client?.name ?? portfolio.clientId}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {client?.name ?? portfolio.clientId}
            </h1>
            {requiresRebalancing && (
              <Badge variant="warning" size="sm">Needs Rebalancing</Badge>
            )}
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {client?.clientId} · {client?.riskProfile ?? '—'} Profile
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="text-right">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Total AUM</p>
            <p className="text-lg font-bold text-slate-900 dark:text-slate-100 font-numeric">
              {formatCurrency(portfolio.totalValue)}
            </p>
          </div>
          {client && (
            <>
              <div className="text-right">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">1M Return</p>
                <p className={`text-lg font-bold font-numeric ${getReturnColorClass(client.returnOneMonth)}`}>
                  {formatPercentage(client.returnOneMonth)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">YTD Return</p>
                <p className={`text-lg font-bold font-numeric ${getReturnColorClass(client.returnYTD)}`}>
                  {formatPercentage(client.returnYTD)}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {requiresRebalancing && (
        <Card title="Rebalancing Required">
          <RebalancingPanel portfolio={portfolio} clientId={id} />
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card title="Asset Allocation">
          <AllocationChart allocation={portfolio.assetAllocation} />
        </Card>
        <Card title="Performance vs Benchmark">
          <PerformanceChart performance={performance} />
        </Card>
      </div>

      <Card title="Holdings">
        <HoldingsTable holdings={portfolio.holdings} clientName={client?.name} />
      </Card>
    </div>
  );
}
