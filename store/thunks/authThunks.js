import { AUTH_CREDENTIALS, AUTH_STORAGE_KEY, MOCK_USER } from '@/lib/constants';
import { loginSuccess, loginFailure, logout, hydrateFromStorage } from '@/store/slices/authSlice';

// Validate credentials, persist session to localStorage, update Redux state
export function loginThunk({ email, password }) {
  return (dispatch) => {
    if (
      email.trim().toLowerCase() === AUTH_CREDENTIALS.email.toLowerCase() &&
      password === AUTH_CREDENTIALS.password
    ) {
      const session = { ...MOCK_USER, loginAt: new Date().toISOString() };
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
  return (dispatch) => {
    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      if (raw) dispatch(hydrateFromStorage(JSON.parse(raw)));
    } catch {
      // Malformed or missing data — treat as logged-out
    }
  };
}

// Clear localStorage session and reset Redux auth state
export function logoutThunk() {
  return (dispatch) => {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // ignore
    }
    dispatch(logout());
  };
}
