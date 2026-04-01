import { supabase } from '@/lib/supabase';
import type { User } from '@/types';

export async function login(email: string, password: string): Promise<User> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, name, role')
    .eq('id', data.user.id)
    .single();

  if (profileError) throw new Error(profileError.message);

  return { id: profile.id, name: profile.name, email: data.user.email!, role: profile.role };
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
