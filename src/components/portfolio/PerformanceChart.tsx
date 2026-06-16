'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '@/helpers/formatters';
import { PERFORMANCE_CHART, CHART_DEFAULTS } from '@/constants/charts';
import type { PerformanceData, PerformanceDataPoint } from '@/types';

interface TooltipPayloadEntry {
  dataKey: string;
  value: number;
  payload: PerformanceDataPoint & { portfolioValue?: number };
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  const entries = payload;
  const portfolio = entries.find((p) => p.dataKey === 'portfolioReturn');
  const benchmark = entries.find((p) => p.dataKey === 'benchmarkReturn');

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg p-3 text-xs">
      <p className="font-semibold text-slate-700 dark:text-slate-300 mb-2">{label}</p>
      {portfolio && (
        <div className="flex items-center justify-between gap-4 mb-1">
          <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
            <span className="w-2.5 h-0.5 bg-blue-500 inline-block rounded" />
            Portfolio
          </span>
          <span className={`font-medium font-numeric ${portfolio.value >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
            {portfolio.value >= 0 ? '+' : ''}{portfolio.value.toFixed(2)}%
          </span>
        </div>
      )}
      {benchmark && (
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
            <span className="w-2.5 h-0.5 bg-amber-500 inline-block rounded border-dashed" />
            Nifty 50
          </span>
          <span className={`font-medium font-numeric ${benchmark.value >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
            {benchmark.value >= 0 ? '+' : ''}{benchmark.value.toFixed(2)}%
          </span>
        </div>
      )}
      {portfolio?.payload?.portfolioValue && (
        <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700">
          <span className="text-slate-500 dark:text-slate-400">
            Portfolio value: <span className="font-medium text-slate-900 dark:text-slate-100">{formatCurrency(portfolio.payload.portfolioValue)}</span>
          </span>
        </div>
      )}
    </div>
  );
}

function formatYAxis(value: number): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
}

interface PerformanceChartProps {
  performance: PerformanceData | null;
}

export default function PerformanceChart({ performance }: PerformanceChartProps) {
  if (!performance?.dataPoints?.length) return null;

  const { dataPoints, benchmark } = performance;

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={PERFORMANCE_CHART.HEIGHT}>
        <LineChart data={dataPoints} margin={PERFORMANCE_CHART.MARGIN}>
          <CartesianGrid strokeDasharray={PERFORMANCE_CHART.GRID_DASH} stroke={PERFORMANCE_CHART.GRID_COLOR} vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: CHART_DEFAULTS.TICK_FONT_SIZE, fill: CHART_DEFAULTS.TICK_FILL }}
            axisLine={false}
            tickLine={false}
            dy={PERFORMANCE_CHART.X_AXIS_DY}
          />
          <YAxis
            tickFormatter={formatYAxis}
            tick={{ fontSize: CHART_DEFAULTS.TICK_FONT_SIZE, fill: CHART_DEFAULTS.TICK_FILL }}
            axisLine={false}
            tickLine={false}
            width={PERFORMANCE_CHART.Y_AXIS_WIDTH}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => (
              <span className="text-xs text-slate-600 dark:text-slate-400">
                {value === 'portfolioReturn' ? 'Portfolio' : benchmark ?? 'Benchmark'}
              </span>
            )}
            iconType="plainline"
            iconSize={20}
          />
          <ReferenceLine y={0} stroke={PERFORMANCE_CHART.REFERENCE_COLOR} strokeDasharray={PERFORMANCE_CHART.REFERENCE_DASH} />
          <Line
            type="monotone"
            dataKey="portfolioReturn"
            stroke={PERFORMANCE_CHART.PORTFOLIO_COLOR}
            strokeWidth={PERFORMANCE_CHART.PORTFOLIO_STROKE_WIDTH}
            dot={{ fill: PERFORMANCE_CHART.PORTFOLIO_COLOR, r: PERFORMANCE_CHART.PORTFOLIO_DOT_RADIUS, strokeWidth: 0 }}
            activeDot={{ r: PERFORMANCE_CHART.PORTFOLIO_ACTIVE_DOT_RADIUS, strokeWidth: 0 }}
          />
          <Line
            type="monotone"
            dataKey="benchmarkReturn"
            stroke={PERFORMANCE_CHART.BENCHMARK_COLOR}
            strokeWidth={PERFORMANCE_CHART.BENCHMARK_STROKE_WIDTH}
            strokeDasharray={PERFORMANCE_CHART.BENCHMARK_DASH}
            dot={false}
            activeDot={{ r: PERFORMANCE_CHART.BENCHMARK_DOT_RADIUS, fill: PERFORMANCE_CHART.BENCHMARK_COLOR, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
