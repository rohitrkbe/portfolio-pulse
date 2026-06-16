import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest, ApiError } from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
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
      return await apiRequest<{ portfolio: Portfolio }>({
        url: ENDPOINTS.clients.portfolio(clientId),
      });
    } catch (err) {
      return rejectWithValue(err instanceof ApiError ? err.message : 'Network error');
    }
  },
  {
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
      return await apiRequest<{ performance: PerformanceData }>({
        url: ENDPOINTS.clients.performance(clientId),
      });
    } catch (err) {
      return rejectWithValue(err instanceof ApiError ? err.message : 'Network error');
    }
  },
  {
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
      return await apiRequest<RebalanceResponse, { recommendations: Recommendation[] }>({
        url: ENDPOINTS.clients.rebalance(clientId),
        method: 'POST',
        body: { recommendations },
      });
    } catch (err) {
      return rejectWithValue(err instanceof ApiError ? err.message : 'Network error');
    }
  }
);
