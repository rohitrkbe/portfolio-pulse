export const ROUTES = {
  root:      '/',
  login:     '/login',
  dashboard: '/dashboard',
  client:    (id: string) => `/dashboard/clients/${id}`,
} as const;

export const ROUTE_META: Record<string, { title: string; description?: string }> = {
  [ROUTES.login]:     { title: 'Login — Portfolio Pulse' },
  [ROUTES.dashboard]: { title: 'Dashboard — Portfolio Pulse', description: 'Manage client portfolios' },
};
