import { createSlice } from '@reduxjs/toolkit';
import {
  fetchPortfolio,
  fetchPerformance,
  submitRebalance,
} from '@/store/thunks/portfolioThunks';

// Async thunks live in store/thunks/portfolioThunks.js
// This file owns: state shape, synchronous reducers, selectors, and extraReducers wiring

const initialState = {
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
    setCurrentClient(state, action) {
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
        state.data = action.payload.portfolio;
      })
      .addCase(fetchPortfolio.rejected, (state, action) => {
        state.portfolioLoading = false;
        state.portfolioError = action.payload;
      });

    // Performance
    builder
      .addCase(fetchPerformance.pending, (state) => {
        state.performanceLoading = true;
        state.performanceError = null;
      })
      .addCase(fetchPerformance.fulfilled, (state, action) => {
        state.performanceLoading = false;
        state.performance = action.payload.performance;
      })
      .addCase(fetchPerformance.rejected, (state, action) => {
        state.performanceLoading = false;
        state.performanceError = action.payload;
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
        if (state.data) state.data.rebalancingStatus = action.payload.status;
      })
      .addCase(submitRebalance.rejected, (state, action) => {
        state.rebalanceLoading = false;
        state.rebalanceError = action.payload;
      });
  },
});

export const { setCurrentClient, clearRebalanceStatus } = portfolioSlice.actions;

export const selectPortfolio = (state) => state.portfolio.data;
export const selectPerformance = (state) => state.portfolio.performance;
export const selectPortfolioLoading = (state) => state.portfolio.portfolioLoading;
export const selectPerformanceLoading = (state) => state.portfolio.performanceLoading;
export const selectRebalanceLoading = (state) => state.portfolio.rebalanceLoading;
export const selectPortfolioError = (state) => state.portfolio.portfolioError;
export const selectPerformanceError = (state) => state.portfolio.performanceError;
export const selectRebalanceSuccess = (state) => state.portfolio.rebalanceSuccess;

export default portfolioSlice.reducer;
