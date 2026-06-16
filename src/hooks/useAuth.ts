'use client';

import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import type { AppDispatch } from '@/store';
import type { User } from '@/types';
import { selectIsAuthenticated, selectUser, selectLoginError, clearLoginError } from '@/store/slices/authSlice';
import { loginThunk, logoutThunk } from '@/store/thunks/authThunks';
import { ROUTES } from '@/constants/routes';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResult {
  success: boolean;
}

interface UseAuthReturn {
  isAuthenticated: boolean;
  user: User | null;
  loginError: string | null;
  login: (credentials: LoginCredentials) => LoginResult;
  logout: () => void;
  clearError: () => void;
}

export function useAuth(): UseAuthReturn {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const loginError = useSelector(selectLoginError);

  const login = useCallback(
    (credentials: LoginCredentials): LoginResult => {
      const result = dispatch(loginThunk(credentials));
      if (result.success) {
        router.push(ROUTES.dashboard);
      }
      return result;
    },
    [dispatch, router]
  );

  const logout = useCallback(() => {
    dispatch(logoutThunk());
    router.push(ROUTES.login);
  }, [dispatch, router]);

  const clearError = useCallback(() => {
    dispatch(clearLoginError());
  }, [dispatch]);

  return { isAuthenticated, user, loginError, login, logout, clearError };
}
