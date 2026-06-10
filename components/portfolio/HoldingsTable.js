'use client';

import { useState, useMemo } from 'react';
import Badge from '@/components/ui/Badge';
import { formatCurrency, formatPercentage, getReturnColorClass } from '@/lib/formatters';
import { ASSET_CLASS_COLORS } from '@/lib/constants';

function DownloadIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
  );
}

function SortIcon({ direction }) {
  if (!direction) return <span className="w-3 h-3 text-slate-300 inline-block">↕</span>;
  return <span className="text-blue-500">{direction === 'asc' ? '↑' : '↓'}</span>;
}

const ASSET_CLASS_VARIANTS = {
  Equities: 'primary',
  Debt: 'success',
  Gold: 'warning',
  'Real Estate': 'default',
  Alternatives: 'danger',
};

function exportToCSV(holdings, clientName) {
  const headers = ['Instrument', 'Ticker', 'Asset Class', 'Current Value (₹)', 'Gain/Loss (₹)', 'Gain/Loss (%)', 'Weight (%)'];
  const rows = holdings.map((h) => [
    h.instrumentName,
    h.ticker,
    h.assetClass,
    h.currentValue,
    h.gainLossAbs,
    h.gainLossPct.toFixed(2),
    h.weightPct.toFixed(1),
  ]);
  const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${clientName?.replace(/\s+/g, '_') ?? 'portfolio'}_holdings.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

const COLUMNS = [
  { key: 'instrumentName', label: 'Instrument', sortable: true },
  { key: 'assetClass', label: 'Asset Class', sortable: true },
  { key: 'currentValue', label: 'Current Value', sortable: true, numeric: true },
  { key: 'gainLossAbs', label: 'Gain / Loss', sortable: true, numeric: true },
  { key: 'gainLossPct', label: 'G/L %', sortable: true, numeric: true },
  { key: 'weightPct', label: 'Weight', sortable: true, numeric: true },
];

export default function HoldingsTable({ holdings, clientName }) {
  const [sort, setSort] = useState({ key: 'currentValue', dir: 'desc' });

  const sorted = useMemo(() => {
    if (!holdings) return [];
    return [...holdings].sort((a, b) => {
      const aVal = a[sort.key];
      const bVal = b[sort.key];
      if (typeof aVal === 'string') {
        return sort.dir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sort.dir === 'asc' ? aVal - bVal : bVal - aVal;
    });
  }, [holdings, sort]);

  const handleSort = (key) => {
    setSort((prev) =>
      prev.key === key ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'desc' }
    );
  };

  if (!holdings?.length) return <p className="text-sm text-slate-500 py-6 text-center">No holdings data.</p>;

  return (
    <div>
      {/* Header row with CSV export */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-slate-500 dark:text-slate-400">{holdings.length} instruments</span>
        <button
          onClick={() => exportToCSV(holdings, clientName)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
        >
          <DownloadIcon className="w-3.5 h-3.5" />
          Export CSV
        </button>
      </div>

      <div className="overflow-x-auto -mx-5">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key)}
                  className={`px-5 py-2.5 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide whitespace-nowrap ${
                    col.sortable ? 'cursor-pointer select-none hover:text-slate-700 dark:hover:text-slate-200' : ''
                  } ${col.numeric ? 'text-right' : ''}`}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    {col.sortable && <SortIcon direction={sort.key === col.key ? sort.dir : null} />}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {sorted.map((holding) => (
              <tr key={holding.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors">
                {/* Instrument */}
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-2 h-8 rounded-full shrink-0"
                      style={{ backgroundColor: ASSET_CLASS_COLORS[holding.assetClass] ?? '#94a3b8' }}
                    />
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{holding.instrumentName}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">{holding.ticker}</p>
                    </div>
                  </div>
                </td>

                {/* Asset Class */}
                <td className="px-5 py-3">
                  <Badge variant={ASSET_CLASS_VARIANTS[holding.assetClass] ?? 'default'} size="xs">
                    {holding.assetClass}
                  </Badge>
                </td>

                {/* Current Value */}
                <td className="px-5 py-3 text-right">
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 font-numeric">
                    {formatCurrency(holding.currentValue)}
                  </span>
                </td>

                {/* Gain/Loss absolute */}
                <td className="px-5 py-3 text-right">
                  <span className={`text-sm font-medium font-numeric ${getReturnColorClass(holding.gainLossAbs)}`}>
                    {holding.gainLossAbs >= 0 ? '+' : ''}{formatCurrency(holding.gainLossAbs)}
                  </span>
                </td>

                {/* Gain/Loss % */}
                <td className="px-5 py-3 text-right">
                  <span className={`text-sm font-medium font-numeric ${getReturnColorClass(holding.gainLossPct)}`}>
                    {formatPercentage(holding.gainLossPct)}
                  </span>
                </td>

                {/* Weight */}
                <td className="px-5 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.min(holding.weightPct, 100)}%`,
                          backgroundColor: ASSET_CLASS_COLORS[holding.assetClass] ?? '#94a3b8',
                        }}
                      />
                    </div>
                    <span className="text-sm font-numeric text-slate-700 dark:text-slate-300 w-10 text-right">
                      {holding.weightPct.toFixed(1)}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
