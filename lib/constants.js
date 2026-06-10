export const RISK_PROFILES = {
  CONSERVATIVE: 'Conservative',
  MODERATE: 'Moderate',
  AGGRESSIVE: 'Aggressive',
};

export const RISK_PROFILE_LIST = ['All', 'Conservative', 'Moderate', 'Aggressive'];

export const ASSET_CLASSES = {
  EQUITIES: 'Equities',
  DEBT: 'Debt',
  GOLD: 'Gold',
  REAL_ESTATE: 'Real Estate',
  ALTERNATIVES: 'Alternatives',
};

export const ASSET_CLASS_COLORS = {
  Equities: '#3b82f6',
  Debt: '#10b981',
  Gold: '#f59e0b',
  'Real Estate': '#8b5cf6',
  Alternatives: '#ec4899',
};

export const ASSET_CLASS_DARK_COLORS = {
  Equities: '#60a5fa',
  Debt: '#34d399',
  Gold: '#fbbf24',
  'Real Estate': '#a78bfa',
  Alternatives: '#f472b6',
};

export const RISK_PROFILE_COLORS = {
  Conservative: { bg: 'bg-sky-100 dark:bg-sky-900/30', text: 'text-sky-700 dark:text-sky-300' },
  Moderate: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-300' },
  Aggressive: { bg: 'bg-rose-100 dark:bg-rose-900/30', text: 'text-rose-700 dark:text-rose-300' },
};

export const REBALANCING_STATUS = {
  PENDING: 'pending',
  REVIEWED: 'reviewed',
  NOT_REQUIRED: 'not_required',
};

export const DRIFT_THRESHOLD = 5;

export const AUTH_CREDENTIALS = {
  email: 'rm@portfoliopulse.in',
  password: 'Welcome@123',
};

export const MOCK_USER = {
  id: 'rm001',
  name: 'Rahul Verma',
  email: 'rm@portfoliopulse.in',
  role: 'Relationship Manager',
  clientCount: 6,
  firmName: 'Pulse Wealth Management',
};

export const AUTH_STORAGE_KEY = 'pp_auth';
export const THEME_STORAGE_KEY = 'pp_theme';

export const BENCHMARK_NAME = 'Nifty 50';

export const SORT_FIELDS = {
  AUM: 'aum',
  RETURN_1M: 'returnOneMonth',
  RETURN_YTD: 'returnYTD',
  RISK: 'riskProfile',
  NAME: 'name',
};

export const SORT_ORDERS = {
  ASC: 'asc',
  DESC: 'desc',
};

export const RISK_PROFILE_ORDER = {
  Conservative: 1,
  Moderate: 2,
  Aggressive: 3,
};

export const PERFORMANCE_MONTHS = [
  { label: 'Dec \'25', date: '2025-12-01' },
  { label: 'Jan \'26', date: '2026-01-01' },
  { label: 'Feb \'26', date: '2026-02-01' },
  { label: 'Mar \'26', date: '2026-03-01' },
  { label: 'Apr \'26', date: '2026-04-01' },
  { label: 'May \'26', date: '2026-05-01' },
];
