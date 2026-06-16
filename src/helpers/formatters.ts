export function formatCurrency(value: number | null | undefined, currency = 'INR'): string {
  if (value === null || value === undefined || isNaN(value)) return '—';

  if (currency === 'INR') {
    if (value >= 10_000_000) return `₹${(value / 10_000_000).toFixed(2)} Cr`;
    if (value >= 100_000)    return `₹${(value / 100_000).toFixed(2)} L`;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercentage(
  value: number | null | undefined,
  decimals = 2,
  showSign = true,
): string {
  if (value === null || value === undefined || isNaN(value)) return '—';
  const sign = showSign && value > 0 ? '+' : '';
  return `${sign}${Number(value).toFixed(decimals)}%`;
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '—';
  try {
    return new Intl.DateTimeFormat('en-IN', {
      day:   '2-digit',
      month: 'short',
      year:  'numeric',
    }).format(new Date(dateString));
  } catch {
    return dateString;
  }
}

export function formatCompactNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—';
  if (value >= 10_000_000) return `₹${(value / 10_000_000).toFixed(1)}Cr`;
  if (value >= 100_000)    return `₹${(value / 100_000).toFixed(1)}L`;
  if (value >= 1_000)      return `${(value / 1_000).toFixed(1)}K`;
  return String(value);
}

export function getReturnColorClass(value: number): string {
  if (value > 0) return 'text-emerald-600 dark:text-emerald-400';
  if (value < 0) return 'text-red-600 dark:text-red-400';
  return 'text-slate-500 dark:text-slate-400';
}

export function getDriftColorClass(drift: number): string {
  const abs = Math.abs(drift);
  if (abs > 5) return drift > 0 ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400';
  if (abs > 2) return 'text-amber-600 dark:text-amber-400';
  return 'text-emerald-600 dark:text-emerald-400';
}
