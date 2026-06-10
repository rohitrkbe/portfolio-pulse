import { createSlice } from '@reduxjs/toolkit';

// Async / side-effectful thunks live in store/thunks/authThunks.js
// This file owns only: state shape, synchronous reducers, and selectors

const initialState = {
  user: null,
  isAuthenticated: false,
  loginError: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loginError = null;
    },
    loginFailure(state, action) {
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
    hydrateFromStorage(state, action) {
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

export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectLoginError = (state) => state.auth.loginError;

export default authSlice.reducer;
