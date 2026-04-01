import { useAuth } from '@/context/AuthContext';

export default function Perfil() {
  const { user } = useAuth();

  return (
    <div className="space-y-4 max-w-md">
      <h1 className="font-heading text-2xl font-bold">Meu Perfil</h1>
      <div className="bg-card border border-border rounded-lg p-6 space-y-3">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Nome</p>
          <p className="font-medium">{user?.name}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">E-mail</p>
          <p className="font-medium">{user?.email}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Função</p>
          <p className="font-medium capitalize">{user?.role}</p>
        </div>
      </div>
    </div>
  );
}
