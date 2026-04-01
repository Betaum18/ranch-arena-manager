import type { User } from '@/types';

const STORAGE_KEY = 'ranch_sorting_user';

export async function login(email: string, password: string): Promise<User> {
  // TODO: replace with Supabase Auth
  const mockUsers: Record<string, User> = {
    'admin@abqm.com': { id: '1', name: 'Admin ABQM', email: 'admin@abqm.com', role: 'admin' },
  };

  await new Promise((r) => setTimeout(r, 500));

  const user = mockUsers[email] || {
    id: crypto.randomUUID(),
    name: email.split('@')[0],
    email,
    role: 'user' as const,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  return user;
}

export async function register(name: string, email: string, _password: string): Promise<User> {
  // TODO: replace with Supabase Auth
  await new Promise((r) => setTimeout(r, 500));

  const user: User = { id: crypto.randomUUID(), name, email, role: 'user' };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  return user;
}

export function logout(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function getCurrentUser(): User | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
}
