'use client';

import { useEffect, use } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '@/store';
import {
  setCurrentClient,
  selectPortfolio,
  selectPerformance,
  selectPortfolioLoading,
  selectPerformanceLoading,
  selectPortfolioError,
  selectPerformanceError,
} from '@/store/slices/portfolioSlice';
import { fetchPortfolio, fetchPerformance } from '@/store/thunks/portfolioThunks';
import Card, { CardHeader } from '@/components/ui/Card';
import { PageLoader, SectionLoader } from '@/components/ui/LoadingSpinner';
import { ErrorState } from '@/components/ui/EmptyState';
import Badge from '@/components/ui/Badge';
import AllocationChart from '@/components/portfolio/AllocationChart';
import HoldingsTable from '@/components/portfolio/HoldingsTable';
import PerformanceChart from '@/components/portfolio/PerformanceChart';
import RebalancingPanel from '@/components/portfolio/RebalancingPanel';
import { formatCurrency, formatDate, formatPercentage, getReturnColorClass } from '@/helpers/formatters';
import { ArrowLeftIcon } from '@/components/ui/Icons';
import { PORTFOLIO_STRINGS } from '@/constants/strings';
import { ROUTES } from '@/constants/routes';
import type { RiskProfile } from '@/types';

interface PageParams {
  id: string;
}

type BadgeVariant = 'default' | 'conservative' | 'moderate' | 'aggressive';

function RiskBadge({ profile }: { profile: RiskProfile | undefined }) {
  const map: Record<RiskProfile, BadgeVariant> = {
    Conservative: 'conservative',
    Moderate: 'moderate',
    Aggressive: 'aggressive',
  };
  return <Badge variant={profile ? map[profile] : 'default'} size="md">{profile}</Badge>;
}

function StatPill({ label, value, positive }: { label: string; value: string; positive?: number }) {
  return (
    <div className="flex flex-col items-center px-4 py-3 bg-slate-50 dark:bg-slate-700/40 rounded-xl">
      <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
      <span className={`text-base font-bold font-numeric mt-0.5 ${positive != null ? getReturnColorClass(positive) : 'text-slate-900 dark:text-slate-100'}`}>
        {value}
      </span>
    </div>
  );
}

export default function ClientDetailPage({ params }: { params: Promise<PageParams> }) {
  const { id } = use(params);
  const dispatch = useDispatch<AppDispatch>();

  const portfolio = useSelector(selectPortfolio);
  const performance = useSelector(selectPerformance);
  const portfolioLoading = useSelector(selectPortfolioLoading);
  const performanceLoading = useSelector(selectPerformanceLoading);
  const portfolioError = useSelector(selectPortfolioError);
  const performanceError = useSelector(selectPerformanceError);

  useEffect(() => {
    if (!id) return;
    dispatch(setCurrentClient(id));
    dispatch(fetchPortfolio(id));
    dispatch(fetchPerformance(id));
  }, [id, dispatch]);

  if (portfolioLoading) return <PageLoader />;
  if (portfolioError) {
    return (
      <ErrorState
        message={portfolioError}
        onRetry={() => {
          dispatch(fetchPortfolio(id));
          dispatch(fetchPerformance(id));
        }}
      />
    );
  }
  if (!portfolio) return null;

  const { client, assetAllocation, holdings, rebalancingStatus, totalValue, lastRebalancedAt } = portfolio;
  const needsRebalancing = rebalancingStatus === 'pending';

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3">
        <Link
          href={ROUTES.dashboard}
          className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          {PORTFOLIO_STRINGS.BREADCRUMB}
        </Link>
        <span className="text-slate-300 dark:text-slate-600">/</span>
        <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{client?.name}</span>
      </div>

      {/* Client header */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0">
            <span className="text-lg font-bold text-white">
              {client?.name.split(' ').map((n) => n[0]).join('')}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">{client?.name}</h1>
              <RiskBadge profile={client?.riskProfile} />
              {needsRebalancing && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  Rebalance Required
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {client?.clientId} · {client?.city} · Client since {formatDate(client?.joinedAt)}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <StatPill label="Total AUM" value={formatCurrency(totalValue)} />
            <StatPill label="Last Review" value={formatDate(lastRebalancedAt)} />
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader
              title={PORTFOLIO_STRINGS.PERFORMANCE_TITLE}
              subtitle={PORTFOLIO_STRINGS.PERFORMANCE_SUBTITLE}
            />
            {performanceLoading ? (
              <SectionLoader message="Loading performance data…" />
            ) : performanceError ? (
              <ErrorState message={performanceError} onRetry={() => dispatch(fetchPerformance(id))} />
            ) : (
              <PerformanceChart performance={performance} />
            )}
          </Card>

          <Card>
            <CardHeader
              title={PORTFOLIO_STRINGS.HOLDINGS_TITLE}
              subtitle={PORTFOLIO_STRINGS.HOLDINGS_SUBTITLE(holdings?.length ?? 0)}
            />
            <HoldingsTable holdings={holdings} clientName={client?.name} />
          </Card>
        </div>

        {/* Right column (1/3) */}
        <div className="space-y-6">
          <Card>
            <CardHeader
              title={PORTFOLIO_STRINGS.ALLOCATION_TITLE}
              subtitle={PORTFOLIO_STRINGS.ALLOCATION_SUBTITLE}
            />
            <AllocationChart allocation={assetAllocation} />
          </Card>

          <Card>
            <CardHeader
              title={PORTFOLIO_STRINGS.REBALANCING_TITLE}
              subtitle={needsRebalancing ? PORTFOLIO_STRINGS.REBALANCING_PENDING : PORTFOLIO_STRINGS.REBALANCING_OK}
            />
            <RebalancingPanel portfolio={portfolio} clientId={id} />
          </Card>
        </div>
      </div>
    </div>
  );
}
