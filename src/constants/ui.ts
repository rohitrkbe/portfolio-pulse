// ─── clients table / virtualizer ─────────────────────────────────────────────
export const CLIENTS_TABLE = {
  ROW_HEIGHT: 57,
  OVERSCAN:    5,
  MAX_HEIGHT: 600,
} as const;

export const CLIENT_AVATAR_GRADIENTS = [
  'from-blue-500 to-indigo-600',
  'from-violet-500 to-purple-600',
  'from-emerald-500 to-teal-600',
  'from-rose-500 to-pink-600',
  'from-amber-500 to-orange-600',
  'from-cyan-500 to-sky-600',
] as const;

// ─── interaction timings ──────────────────────────────────────────────────────
export const DEBOUNCE_MS     = 250;
export const TOAST_DURATION_MS = 4000;

// ─── rebalancing trade actions ────────────────────────────────────────────────
export const REBALANCING_ACTIONS = {
  BUY:  'BUY',
  SELL: 'SELL',
} as const;

// ─── stat card accent palette ─────────────────────────────────────────────────
export const STAT_CARD_ACCENTS: Record<string, { icon: string; bg: string }> = {
  blue:   { icon: 'text-blue-600 dark:text-blue-400',       bg: 'bg-blue-50 dark:bg-blue-900/20'       },
  green:  { icon: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
  amber:  { icon: 'text-amber-600 dark:text-amber-400',     bg: 'bg-amber-50 dark:bg-amber-900/20'     },
  red:    { icon: 'text-red-600 dark:text-red-400',         bg: 'bg-red-50 dark:bg-red-900/20'         },
  purple: { icon: 'text-purple-600 dark:text-purple-400',   bg: 'bg-purple-50 dark:bg-purple-900/20'   },
} as const;
