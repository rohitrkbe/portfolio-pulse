import type { AppDispatch } from '@/store';
import { AUTH_STORAGE_KEY } from '@/constants/domain';
import { MOCK_CREDENTIALS } from '@/lib/mockData';
import { loginSuccess, loginFailure, logout, hydrateFromStorage } from '@/store/slices/authSlice';
import type { User } from '@/types';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResult {
  success: boolean;
}

// Validate credentials, persist session to localStorage, update Redux state
export function loginThunk({ email, password }: LoginCredentials) {
  return (dispatch: AppDispatch): LoginResult => {
    const match = MOCK_CREDENTIALS.find(
      (c) => c.email === email.trim().toLowerCase() && c.password === password
    );
    if (match) {
      const session: User = {
        id: match.id,
        name: match.name,
        email: match.email,
        role: match.role,
        loginAt: new Date().toISOString(),
      };
      try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
      } catch {
        // localStorage unavailable in SSR edge case — session still lives in Redux
      }
      dispatch(loginSuccess(session));
      return { success: true };
    }
    dispatch(loginFailure('Invalid email or password. Please try again.'));
    return { success: false };
  };
}

// Rehydrate Redux auth state from localStorage on app boot
export function hydrateAuthThunk() {
  return (dispatch: AppDispatch): void => {
    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      if (raw) dispatch(hydrateFromStorage(JSON.parse(raw) as User));
    } catch {
      // Malformed or missing data — treat as logged-out
    }
  };
}

// Clear localStorage session and reset Redux auth state
export function logoutThunk() {
  return (dispatch: AppDispatch): void => {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // ignore
    }
    dispatch(logout());
  };
}
