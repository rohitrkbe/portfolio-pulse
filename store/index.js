import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import clientsReducer from './slices/clientsSlice';
import portfolioReducer from './slices/portfolioSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    clients: clientsReducer,
    portfolio: portfolioReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // loginAt is an ISO string — safe to ignore
        ignoredActions: ['auth/loginSuccess', 'auth/hydrateFromStorage'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});
