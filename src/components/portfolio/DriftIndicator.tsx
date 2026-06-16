import { ASSET_CLASS_COLORS, DRIFT_THRESHOLD } from '@/constants/domain';
import { CHART_DEFAULTS } from '@/constants/charts';

interface DriftIndicatorProps {
  assetClass: string;
  drift:      number;
  currentPct: number;
  targetPct:  number;
}

export function DriftIndicator({ assetClass, drift, currentPct, targetPct }: DriftIndicatorProps) {
  const absDrift   = Math.abs(drift);
  const isCritical = absDrift > DRIFT_THRESHOLD;
  const color      = ASSET_CLASS_COLORS[assetClass] ?? CHART_DEFAULTS.FALLBACK_COLOR;

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
