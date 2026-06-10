import { createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState, Portfolio, PerformanceData, Recommendation } from '@/types';

interface SubmitRebalanceArgs {
  clientId: string;
  recommendations: Recommendation[];
}

interface RebalanceResponse {
  status: string;
  reviewedAt: string;
  clientId: string;
  actionsCount: number;
  recommendations: Recommendation[];
}

export const fetchPortfolio = createAsyncThunk<
  { portfolio: Portfolio },
  string,
  { state: RootState; rejectValue: string }
>(
  'portfolio/fetchDetail',
  async (clientId, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/clients/${clientId}/portfolio`);
      if (!res.ok) {
        const err = await res.json();
        return rejectWithValue((err.message as string) || 'Failed to fetch portfolio');
      }
      return res.json() as Promise<{ portfolio: Portfolio }>;
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Network error');
    }
  },
  {
    // Skip if a portfolio fetch is already in flight (handles React Strict Mode double-dispatch)
    condition: (_, { getState }) => !getState().portfolio.portfolioLoading,
  }
);

export const fetchPerformance = createAsyncThunk<
  { performance: PerformanceData },
  string,
  { state: RootState; rejectValue: string }
>(
  'portfolio/fetchPerformance',
  async (clientId, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/clients/${clientId}/performance`);
      if (!res.ok) {
        const err = await res.json();
        return rejectWithValue((err.message as string) || 'Failed to fetch performance');
      }
      return res.json() as Promise<{ performance: PerformanceData }>;
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Network error');
    }
  },
  {
    // Skip if performance fetch is already in flight
    condition: (_, { getState }) => !getState().portfolio.performanceLoading,
  }
);

export const submitRebalance = createAsyncThunk<
  RebalanceResponse,
  SubmitRebalanceArgs,
  { state: RootState; rejectValue: string }
>(
  'portfolio/submitRebalance',
  async ({ clientId, recommendations }, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/clients/${clientId}/rebalance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recommendations }),
      });
      if (!res.ok) {
        const err = await res.json();
        return rejectWithValue((err.message as string) || 'Failed to submit rebalance');
      }
      return res.json() as Promise<RebalanceResponse>;
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Network error');
    }
  }
);
