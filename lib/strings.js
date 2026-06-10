// Centralized UI string constants — import from here, never hardcode in components

export const APP = {
  NAME: 'Portfolio Pulse',
  TAGLINE: 'Wealth Management',
  COPYRIGHT: '© 2026 Pulse Wealth Management. Internal use only.',
};

export const LOGIN_STRINGS = {
  HEADING: 'Welcome back',
  SUB_HEADING: 'Sign in to your RM dashboard',
  EMAIL_LABEL: 'Email address',
  EMAIL_PLACEHOLDER: 'rm@portfoliopulse.in',
  PASSWORD_LABEL: 'Password',
  PASSWORD_PLACEHOLDER: 'Enter your password',
  SUBMIT_IDLE: 'Sign in',
  SUBMIT_LOADING: 'Signing in…',
  DEMO_SECTION_LABEL: 'Demo credentials',
  LEFT_HEADLINE: "Your clients'\nportfolios,\nat a glance.",
  LEFT_SUB: 'Real-time portfolio oversight, rebalancing alerts, and performance analytics — designed for Relationship Managers.',
};

export const FEATURE_BULLETS = [
  'Live drift detection across all asset classes',
  'One-click rebalancing review workflow',
  'Performance vs Nifty 50 benchmark',
];

export const DEMO_STATS = [
  { value: '₹859 Cr', label: 'Total AUM' },
  { value: '6', label: 'HNI Clients' },
  { value: '+12.1%', label: 'Avg. YTD' },
];

export const DASHBOARD_STRINGS = {
  PAGE_TITLE: 'Client Portfolios',
  SEARCH_PLACEHOLDER: 'Search client, ID, city…',
  ALERTS_ONLY: 'Alerts only',
  LOADING: 'Loading client portfolios…',
};

export const PORTFOLIO_STRINGS = {
  BREADCRUMB: 'All Clients',
  ALLOCATION_TITLE: 'Asset Allocation',
  ALLOCATION_SUBTITLE: 'Current vs target allocation',
  PERFORMANCE_TITLE: 'Portfolio Performance',
  PERFORMANCE_SUBTITLE: '6-month cumulative return vs Nifty 50 benchmark',
  HOLDINGS_TITLE: 'Holdings',
  HOLDINGS_SUBTITLE: (n) => `${n} instruments across all asset classes`,
  REBALANCING_TITLE: 'Rebalancing',
  REBALANCING_PENDING: 'Action required',
  REBALANCING_OK: 'Portfolio balanced',
  MARK_REVIEWED: 'Mark as Reviewed',
  MARK_REVIEWED_SUB: 'This will flag the portfolio for execution by the operations team.',
  REVIEWED_LABEL: 'Rebalancing Reviewed',
  REVIEWED_SUB: 'This portfolio has been reviewed and flagged for execution.',
  NO_REBALANCE: 'All asset classes are within tolerance. No rebalancing required.',
  SUGGESTED_ACTIONS: 'Suggested Actions',
  DRIFT_HEADER: (n) => `Drift Analysis — ${n} class${n > 1 ? 'es' : ''} out of tolerance`,
  EXPORT_CSV: 'Export CSV',
};

export const STAT_LABELS = {
  TOTAL_CLIENTS: 'Total Clients',
  TOTAL_AUM: 'Total AUM',
  REBALANCING_ALERTS: 'Rebalancing Alerts',
  ALERTS_NONE: 'All portfolios balanced',
  ALERTS_SOME: 'clients need attention',
  AVG_YTD: 'Avg. YTD Return',
};

export const TABLE_HEADERS = {
  CLIENT: 'Client',
  AUM: 'AUM',
  RETURN_1M: '1M Return',
  RETURN_YTD: 'YTD Return',
  RISK: 'Risk Profile',
  STATUS: 'Status',
};

export const ERROR_STRINGS = {
  DEFAULT: 'Something went wrong',
  RETRY: 'Try again',
  NO_CLIENTS: 'No clients match the current filters.',
};
