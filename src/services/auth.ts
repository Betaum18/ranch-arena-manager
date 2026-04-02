import { supabase } from '@/lib/supabase';
import type { User } from '@/types';

export async function login(email: string, password: string): Promise<User> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Tempo esgotado. Verifique sua conexão e tente novamente.')), 20000)
  );

  const { data, error } = await Promise.race([
    supabase.auth.signInWithPassword({ email, password }),
    timeout,
  ]);
  if (error) throw new Error(error.message);

  return {
    id: data.user.id,
    name: data.user.user_metadata?.name ?? '',
    email: data.user.email!,
    role: 'user',
  };
}

export async function register(name: string, email: string, password: string): Promise<User> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  });
  if (error) throw new Error(error.message);
  if (!data.user) throw new Error('Falha ao criar usuário.');

  return { id: data.user.id, name, email, role: 'user' };
}

export async function logout(): Promise<void> {
  await supabase.auth.signOut();
}
