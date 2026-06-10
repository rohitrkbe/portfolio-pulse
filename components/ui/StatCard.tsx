import type { ComponentType, ReactNode } from 'react';
import { formatPercentage } from '@/lib/formatters';

interface IconProps {
  className?: string;
}

interface StatCardProps {
  label: string;
  value: ReactNode;
  subValue?: ReactNode;
  subLabel?: string;
  trend?: number;
  icon?: ComponentType<IconProps>;
  accent?: 'blue' | 'green' | 'amber' | 'red' | 'purple';
}

export default function StatCard({ label, value, subValue, subLabel, trend, icon: Icon, accent = 'blue' }: StatCardProps) {
  const accents: Record<string, { icon: string; bg: string }> = {
    blue:   { icon: 'text-blue-600 dark:text-blue-400',    bg: 'bg-blue-50 dark:bg-blue-900/20' },
    green:  { icon: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    amber:  { icon: 'text-amber-600 dark:text-amber-400',  bg: 'bg-amber-50 dark:bg-amber-900/20' },
    red:    { icon: 'text-red-600 dark:text-red-400',      bg: 'bg-red-50 dark:bg-red-900/20' },
    purple: { icon: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/20' },
  };

  const { icon: iconColor, bg } = accents[accent] ?? accents.blue;

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide truncate">
            {label}
          </p>
          <p className="mt-1.5 text-2xl font-bold text-slate-900 dark:text-slate-100 font-numeric truncate">
            {value}
          </p>
          {subValue !== undefined && (
            <div className="mt-1 flex items-center gap-1.5">
              {trend !== undefined && (
                <span
                  className={`text-xs font-medium ${
                    trend > 0
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : trend < 0
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-slate-500'
                  }`}
                >
                  {trend > 0 ? '↑' : trend < 0 ? '↓' : '→'} {formatPercentage(Math.abs(trend))}
                </span>
              )}
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {subValue} {subLabel}
              </span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-lg ${bg} shrink-0 ml-3`}>
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
        )}
      </div>
    </div>
  );
}
