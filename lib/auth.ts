import { AUTH_STORAGE_KEY } from '@/lib/constants';
import type { User } from '@/types';

export function setUserSession(user: Omit<User, 'loginAt'>): void {
  const session: User = { ...user, loginAt: new Date().toISOString() };
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  } catch {
    // localStorage unavailable
  }
}

export function getUserSession(): User | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function clearUserSession(): void {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch {
    // ignore
  }
}
