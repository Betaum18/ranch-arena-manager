import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User } from '@/types';
import { supabase } from '@/lib/supabase';
import { login as loginService, register as registerService, logout as logoutService } from '@/services/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function sessionToUser(session: { user: { id: string; email?: string; user_metadata?: { name?: string } } }): User {
  return {
    id: session.user.id,
    email: session.user.email ?? '',
    name: session.user.user_metadata?.name ?? '',
    role: 'user',
  };
}

async function enrichWithProfile(base: User): Promise<User> {
  const { data } = await supabase
    .from('profiles')
    .select('id, name, role')
    .eq('id', base.id)
    .single();
  if (!data) return base;
  return { ...base, name: data.name ?? base.name, role: data.role ?? base.role };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const base = sessionToUser(session);
        setUser(base);
        enrichWithProfile(base).then(setUser);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        const base = sessionToUser(session);
        setUser(base);
        setLoading(false);
        enrichWithProfile(base).then(setUser);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    await loginService(email, password);
  };

  const register = async (name: string, email: string, password: string) => {
    const u = await registerService(name, email, password);
    setUser(u);
  };

  const logout = async () => {
    await logoutService();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
