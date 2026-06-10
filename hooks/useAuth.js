'use client';

import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { selectIsAuthenticated, selectUser, selectLoginError, clearLoginError } from '@/store/slices/authSlice';
import { loginThunk, logoutThunk } from '@/store/thunks/authThunks';

export function useAuth() {
  const dispatch = useDispatch();
  const router = useRouter();

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const loginError = useSelector(selectLoginError);

  const login = useCallback(
    async (credentials) => {
      const result = dispatch(loginThunk(credentials));
      if (result.success) {
        router.push('/dashboard');
      }
      return result;
    },
    [dispatch, router]
  );

  const logout = useCallback(() => {
    dispatch(logoutThunk());
    router.push('/login');
  }, [dispatch, router]);

  const clearError = useCallback(() => {
    dispatch(clearLoginError());
  }, [dispatch]);

  return { isAuthenticated, user, loginError, login, logout, clearError };
}
