import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, User, RootState } from '@/types';

// Async / side-effectful thunks live in store/thunks/authThunks.ts
// This file owns only: state shape, synchronous reducers, and selectors

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loginError: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loginError = null;
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.loginError = action.payload;
      state.isAuthenticated = false;
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.loginError = null;
    },
    clearLoginError(state) {
      state.loginError = null;
    },
    hydrateFromStorage(state, action: PayloadAction<User>) {
      if (action.payload) {
        state.user = action.payload;
        state.isAuthenticated = true;
      }
    },
  },
});

export const {
  loginSuccess,
  loginFailure,
  logout,
  clearLoginError,
  hydrateFromStorage,
} = authSlice.actions;

export const selectAuth = (state: RootState) => state.auth;
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectLoginError = (state: RootState) => state.auth.loginError;

export default authSlice.reducer;
