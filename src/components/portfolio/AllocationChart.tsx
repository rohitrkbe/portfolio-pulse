'use client';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ASSET_CLASS_COLORS, DRIFT_THRESHOLD } from '@/constants/domain';
import { ALLOCATION_CHART, CHART_DEFAULTS } from '@/constants/charts';
import { formatCurrency } from '@/helpers/formatters';
import type { AssetAllocation } from '@/types';

interface ChartDataItem extends AssetAllocation {
  name: string;
  value: number;
}

interface TooltipPayloadEntry {
  payload: ChartDataItem;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const entry = payload[0].payload;
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg p-3 text-xs">
      <p className="font-semibold text-slate-900 dark:text-slate-100 mb-1">{entry.assetClass}</p>
      <div className="space-y-0.5">
        <p className="text-slate-600 dark:text-slate-300">
          Current: <span className="font-medium">{entry.currentPct}%</span>
        </p>
        <p className="text-slate-600 dark:text-slate-300">
          Target: <span className="font-medium">{entry.targetPct}%</span>
        </p>
        {entry.currentValue !== undefined && (
          <p className="text-slate-600 dark:text-slate-300">
            Value: <span className="font-medium">{formatCurrency(entry.currentValue)}</span>
          </p>
        )}
      </div>
    </div>
  );
}

interface LegendEntry {
  value: string;
  color?: string;
}

interface CustomLegendProps {
  payload?: unknown[];
  allocation: AssetAllocation[];
}

function CustomLegend({ payload, allocation }: CustomLegendProps) {
  if (!payload) return null;
  const entries = payload as LegendEntry[];
  return (
    <div className="flex flex-col gap-2 mt-2">
      {entries.map((entry) => {
        const item = allocation.find((a) => a.assetClass === entry.value);
        const drift = item ? item.currentPct - item.targetPct : 0;
        const absDrift = Math.abs(drift);
        return (
          <div key={entry.value} className="flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-1.5 min-w-0">
              <span
                className="w-2.5 h-2.5 rounded-sm shrink-0"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-slate-700 dark:text-slate-300 truncate">{entry.value}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0 font-numeric">
              <span className="font-medium text-slate-900 dark:text-slate-100">{item?.currentPct}%</span>
              {absDrift > 0 && (
                <span
                  className={`text-[10px] ${
                    absDrift > DRIFT_THRESHOLD
                      ? drift > 0
                        ? 'text-red-500'
                        : 'text-amber-500'
                      : 'text-slate-400'
                  }`}
                >
                  {drift > 0 ? '+' : ''}{drift.toFixed(1)}pp
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

interface AllocationChartProps {
  allocation: AssetAllocation[];
}

export default function AllocationChart({ allocation }: AllocationChartProps) {
  if (!allocation?.length) return null;

  const data: ChartDataItem[] = allocation.map((item) => ({
    ...item,
    name: item.assetClass,
    value: item.currentPct,
  }));

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={ALLOCATION_CHART.HEIGHT}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={ALLOCATION_CHART.INNER_RADIUS}
            outerRadius={ALLOCATION_CHART.OUTER_RADIUS}
            paddingAngle={ALLOCATION_CHART.PADDING_ANGLE}
            dataKey="value"
            nameKey="name"
            strokeWidth={0}
          >
            {data.map((entry) => (
              <Cell
                key={entry.assetClass}
                fill={ASSET_CLASS_COLORS[entry.assetClass] ?? CHART_DEFAULTS.FALLBACK_COLOR}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            content={(props) => <CustomLegend payload={props?.payload as unknown[]} allocation={allocation} />}
            layout="vertical"
            align="right"
            verticalAlign="middle"
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-4 space-y-2">
        {allocation.map((item) => {
          return (
            <div key={item.assetClass} className="group">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-600 dark:text-slate-400">{item.assetClass}</span>
                <span className="text-xs font-numeric text-slate-500 dark:text-slate-400">
                  {item.currentPct}% <span className="text-slate-300 dark:text-slate-600">/ {item.targetPct}%</span>
                </span>
              </div>
              <div className="relative h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 bottom-0 bg-slate-300 dark:bg-slate-600 rounded-full"
                  style={{ width: `${item.targetPct}%` }}
                />
                <div
                  className="absolute top-0 bottom-0 rounded-full"
                  style={{
                    width: `${item.currentPct}%`,
                    backgroundColor: ASSET_CLASS_COLORS[item.assetClass] ?? CHART_DEFAULTS.FALLBACK_COLOR,
                    opacity: ALLOCATION_CHART.BAR_OPACITY,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
