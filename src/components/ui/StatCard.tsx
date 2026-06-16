import type { ComponentType, ReactNode } from 'react';
import { formatPercentage } from '@/helpers/formatters';
import { STAT_CARD_ACCENTS } from '@/constants/ui';

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
  const { icon: iconColor, bg } = STAT_CARD_ACCENTS[accent] ?? STAT_CARD_ACCENTS.blue;

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
