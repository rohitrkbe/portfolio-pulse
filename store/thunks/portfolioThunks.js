import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchPortfolio = createAsyncThunk(
  'portfolio/fetchDetail',
  async (clientId, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/clients/${clientId}/portfolio`);
      if (!res.ok) {
        const err = await res.json();
        return rejectWithValue(err.message || 'Failed to fetch portfolio');
      }
      return res.json();
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  },
  {
    // Skip if a portfolio fetch is already in flight (handles React Strict Mode double-dispatch)
    condition: (_, { getState }) => !getState().portfolio.portfolioLoading,
  }
);

export const fetchPerformance = createAsyncThunk(
  'portfolio/fetchPerformance',
  async (clientId, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/clients/${clientId}/performance`);
      if (!res.ok) {
        const err = await res.json();
        return rejectWithValue(err.message || 'Failed to fetch performance');
      }
      return res.json();
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  },
  {
    // Skip if performance fetch is already in flight
    condition: (_, { getState }) => !getState().portfolio.performanceLoading,
  }
);

export const submitRebalance = createAsyncThunk(
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
        return rejectWithValue(err.message || 'Failed to submit rebalance');
      }
      return res.json();
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);
