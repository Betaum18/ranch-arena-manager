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
  name: z.string().min(2, 'Nome obrigatório'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

type FormData = z.infer<typeof schema>;

export default function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      setError('');
      await registerUser(data.name, data.email, data.password);
      navigate('/dashboard');
    } catch {
      setError('Erro ao criar conta. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-darker px-4">
      <div className="w-full max-w-md bg-card rounded-lg border border-border p-8">
        <h1 className="font-heading text-2xl font-bold text-center mb-1">
          <span className="text-primary">Ranch</span> <span className="text-gold">Sorting</span>
        </h1>
        <p className="text-center text-muted-foreground text-sm mb-6">Criar nova conta</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome completo</Label>
            <Input id="name" {...register('name')} className="mt-1" />
            {errors.name && <p className="text-destructive text-xs mt-1">{errors.name.message}</p>}
          </div>
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
          <div>
            <Label htmlFor="confirmPassword">Confirmar senha</Label>
            <Input id="confirmPassword" type="password" {...register('confirmPassword')} className="mt-1" />
            {errors.confirmPassword && <p className="text-destructive text-xs mt-1">{errors.confirmPassword.message}</p>}
          </div>
          {error && <p className="text-destructive text-sm">{error}</p>}
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-heading uppercase tracking-wider" disabled={isSubmitting}>
            {isSubmitting ? 'Criando...' : 'Criar Conta'}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Já tem conta?{' '}
          <Link to="/login" className="text-primary hover:underline">Entrar</Link>
        </p>
      </div>
    </div>
  );
}
