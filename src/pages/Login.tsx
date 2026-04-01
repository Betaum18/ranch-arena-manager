import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

const schema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

type FormData = z.infer<typeof schema>;

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      setError('');
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch {
      setError('Erro ao entrar. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-darker px-4">
      <div className="w-full max-w-md bg-card rounded-lg border border-border p-8">
        <h1 className="font-heading text-2xl font-bold text-center mb-1">
          <span className="text-primary">Ranch</span> <span className="text-gold">Sorting</span>
        </h1>
        <p className="text-center text-muted-foreground text-sm mb-6">Acesse sua conta</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" {...register('email')} className="mt-1" />
            {errors.email && <p className="text-destructive text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" {...register('password')} className="mt-1" />
            {errors.password && <p className="text-destructive text-xs mt-1">{errors.password.message}</p>}
          </div>
          {error && <p className="text-destructive text-sm">{error}</p>}
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-heading uppercase tracking-wider" disabled={isSubmitting}>
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Não tem conta?{' '}
          <Link to="/register" className="text-primary hover:underline">Criar conta</Link>
        </p>
      </div>
    </div>
  );
}
