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
import { formatCurrency } from '@/lib/formatters';
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
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={dataPoints} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
            dy={6}
          />
          <YAxis
            tickFormatter={formatYAxis}
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
            width={52}
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
          <ReferenceLine y={0} stroke="rgba(148,163,184,0.4)" strokeDasharray="4 2" />
          <Line
            type="monotone"
            dataKey="portfolioReturn"
            stroke="#3b82f6"
            strokeWidth={2.5}
            dot={{ fill: '#3b82f6', r: 3, strokeWidth: 0 }}
            activeDot={{ r: 5, strokeWidth: 0 }}
          />
          <Line
            type="monotone"
            dataKey="benchmarkReturn"
            stroke="#f59e0b"
            strokeWidth={2}
            strokeDasharray="5 3"
            dot={false}
            activeDot={{ r: 4, fill: '#f59e0b', strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
