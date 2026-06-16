const BASE = '/api';

export const ENDPOINTS = {
  clients: {
    list:        `${BASE}/clients`,
    portfolio:   (id: string) => `${BASE}/clients/${id}/portfolio`,
    performance: (id: string) => `${BASE}/clients/${id}/performance`,
    rebalance:   (id: string) => `${BASE}/clients/${id}/rebalance`,
  },
} as const satisfies Record<string, Record<string, string | ((...args: string[]) => string)>>;
