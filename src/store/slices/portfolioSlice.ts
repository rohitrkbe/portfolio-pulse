import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { PortfolioState, Portfolio, PerformanceData, RebalancingStatus, RootState } from '@/types';
import {
  fetchPortfolio,
  fetchPerformance,
  submitRebalance,
} from '@/store/thunks/portfolioThunks';

// Async thunks live in store/thunks/portfolioThunks.ts
// This file owns: state shape, synchronous reducers, selectors, and extraReducers wiring

const initialState: PortfolioState = {
  currentClientId: null,
  data: null,
  performance: null,
  portfolioLoading: false,
  performanceLoading: false,
  rebalanceLoading: false,
  portfolioError: null,
  performanceError: null,
  rebalanceError: null,
  rebalanceSuccess: false,
};

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    setCurrentClient(state, action: PayloadAction<string>) {
      if (state.currentClientId !== action.payload) {
        state.currentClientId = action.payload;
        state.data = null;
        state.performance = null;
        state.portfolioError = null;
        state.performanceError = null;
        state.rebalanceSuccess = false;
      }
    },
    clearRebalanceStatus(state) {
      state.rebalanceSuccess = false;
      state.rebalanceError = null;
    },
  },
  extraReducers: (builder) => {
    // Portfolio detail
    builder
      .addCase(fetchPortfolio.pending, (state) => {
        state.portfolioLoading = true;
        state.portfolioError = null;
      })
      .addCase(fetchPortfolio.fulfilled, (state, action) => {
        state.portfolioLoading = false;
        state.data = action.payload.portfolio as Portfolio;
      })
      .addCase(fetchPortfolio.rejected, (state, action) => {
        state.portfolioLoading = false;
        state.portfolioError = (action.payload as string) ?? 'Failed to fetch portfolio';
      });

    // Performance
    builder
      .addCase(fetchPerformance.pending, (state) => {
        state.performanceLoading = true;
        state.performanceError = null;
      })
      .addCase(fetchPerformance.fulfilled, (state, action) => {
        state.performanceLoading = false;
        state.performance = action.payload.performance as PerformanceData;
      })
      .addCase(fetchPerformance.rejected, (state, action) => {
        state.performanceLoading = false;
        state.performanceError = (action.payload as string) ?? 'Failed to fetch performance';
      });

    // Rebalance submission
    builder
      .addCase(submitRebalance.pending, (state) => {
        state.rebalanceLoading = true;
        state.rebalanceError = null;
        state.rebalanceSuccess = false;
      })
      .addCase(submitRebalance.fulfilled, (state, action) => {
        state.rebalanceLoading = false;
        state.rebalanceSuccess = true;
        if (state.data) {
          state.data.rebalancingStatus = action.payload.status as RebalancingStatus;
        }
      })
      .addCase(submitRebalance.rejected, (state, action) => {
        state.rebalanceLoading = false;
        state.rebalanceError = (action.payload as string) ?? 'Failed to submit rebalance';
      });
  },
});

export const { setCurrentClient, clearRebalanceStatus } = portfolioSlice.actions;

export const selectPortfolio = (state: RootState): Portfolio | null => state.portfolio.data;
export const selectCurrentPortfolio = selectPortfolio;
export const selectPerformance = (state: RootState): PerformanceData | null => state.portfolio.performance;
export const selectPortfolioLoading = (state: RootState): boolean => state.portfolio.portfolioLoading;
export const selectPerformanceLoading = (state: RootState): boolean => state.portfolio.performanceLoading;
export const selectRebalanceLoading = (state: RootState): boolean => state.portfolio.rebalanceLoading;
export const selectPortfolioError = (state: RootState): string | null => state.portfolio.portfolioError;
export const selectPerformanceError = (state: RootState): string | null => state.portfolio.performanceError;
export const selectRebalanceSuccess = (state: RootState): boolean => state.portfolio.rebalanceSuccess;

export default portfolioSlice.reducer;
