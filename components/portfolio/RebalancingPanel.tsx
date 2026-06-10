'use client';

import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import type { AppDispatch } from '@/store';
import type { Portfolio, AssetAllocation, DriftResult } from '@/types';
import Button from '@/components/ui/Button';
import { selectRebalanceLoading, selectRebalanceSuccess, clearRebalanceStatus } from '@/store/slices/portfolioSlice';
import { submitRebalance } from '@/store/thunks/portfolioThunks';
import { markRebalancingReviewed } from '@/store/slices/clientsSlice';
import { computeDrifts } from '@/lib/rebalancingEngine';
import { formatCurrency } from '@/lib/formatters';
import { ASSET_CLASS_COLORS } from '@/lib/constants';

function ActionBadge({ action }: { action: string }) {
  if (action === 'BUY') {
    return (
      <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 uppercase tracking-wide">
        Buy
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-bold rounded bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 uppercase tracking-wide">
      Sell
    </span>
  );
}

interface DriftIndicatorProps {
  assetClass: string;
  drift: number;
  currentPct: number;
  targetPct: number;
}

function DriftIndicator({ assetClass, drift, currentPct, targetPct }: DriftIndicatorProps) {
  const absDrift = Math.abs(drift);
  const isCritical = absDrift > 5;
  const color = ASSET_CLASS_COLORS[assetClass] ?? '#94a3b8';

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="font-medium text-slate-700 dark:text-slate-300">{assetClass}</span>
          <span className={isCritical ? 'text-red-600 dark:text-red-400 font-semibold' : 'text-amber-600 dark:text-amber-400'}>
            {drift > 0 ? '+' : ''}{drift.toFixed(1)}pp drift
          </span>
        </div>
        <div className="relative h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full rounded-full"
            style={{ width: `${targetPct}%`, backgroundColor: color, opacity: 0.3 }}
          />
          <div
            className="absolute top-0 left-0 h-full rounded-full"
            style={{ width: `${currentPct}%`, backgroundColor: color }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
          <span>0%</span>
          <span>Target: {targetPct}% | Current: {currentPct}%</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
}

interface RebalancingPanelProps {
  portfolio: Portfolio;
  clientId: string;
}

export default function RebalancingPanel({ portfolio, clientId }: RebalancingPanelProps) {
  const dispatch = useDispatch<AppDispatch>();
  const isLoading = useSelector(selectRebalanceLoading);
  const isSuccess = useSelector(selectRebalanceSuccess);

  const { assetAllocation, recommendations, rebalancingStatus } = portfolio;
  const drifts: DriftResult[] = computeDrifts(assetAllocation as AssetAllocation[]);
  const flaggedDrifts = drifts.filter((d) => d.requiresAction);

  useEffect(() => {
    if (isSuccess) {
      toast.success('Rebalancing marked as reviewed. Portfolio flagged for execution.', {
        duration: 4000,
        icon: '✅',
      });
      dispatch(markRebalancingReviewed(clientId));
      dispatch(clearRebalanceStatus());
    }
  }, [isSuccess, dispatch, clientId]);

  if (rebalancingStatus === 'reviewed') {
    return (
      <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
        <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
          <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">Rebalancing Reviewed</p>
          <p className="text-xs text-emerald-700 dark:text-emerald-300">This portfolio has been reviewed and flagged for execution.</p>
        </div>
      </div>
    );
  }

  if (!flaggedDrifts.length) {
    return (
      <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl border border-slate-200 dark:border-slate-700">
        <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        <p className="text-sm text-slate-600 dark:text-slate-400">All asset classes are within tolerance. No rebalancing required.</p>
      </div>
    );
  }

  const handleMarkReviewed = () => {
    dispatch(submitRebalance({ clientId, recommendations: recommendations ?? [] }));
  };

  return (
    <div className="space-y-5">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
            Drift Analysis — {flaggedDrifts.length} class{flaggedDrifts.length > 1 ? 'es' : ''} out of tolerance
          </h4>
        </div>
        <div className="space-y-4">
          {flaggedDrifts.map((item) => (
            <DriftIndicator
              key={item.assetClass}
              assetClass={item.assetClass}
              drift={item.drift}
              currentPct={item.currentPct}
              targetPct={item.targetPct}
            />
          ))}
        </div>
      </div>

      {recommendations?.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
            Suggested Actions
          </h4>
          <div className="space-y-2">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="flex items-center justify-between gap-3 p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg border border-slate-100 dark:border-slate-700"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <ActionBadge action={rec.action} />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-900 dark:text-slate-100 truncate">{rec.instrumentName}</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">{rec.reason}</p>
                  </div>
                </div>
                <span className="text-xs font-semibold font-numeric text-slate-700 dark:text-slate-300 shrink-0">
                  {formatCurrency(rec.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="pt-2 border-t border-slate-100 dark:border-slate-700">
        <Button
          variant="primary"
          onClick={handleMarkReviewed}
          loading={isLoading}
          className="w-full sm:w-auto"
        >
          Mark as Reviewed
        </Button>
        <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">
          This will flag the portfolio for execution by the operations team.
        </p>
      </div>
    </div>
  );
}
