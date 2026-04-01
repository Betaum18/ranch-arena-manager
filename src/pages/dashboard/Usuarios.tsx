import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  created_at: string;
}

export default function Usuarios() {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState<{ profile: UserProfile; newRole: 'admin' | 'user' } | null>(null);
  const [updating, setUpdating] = useState(false);

  if (user?.role !== 'admin') return <Navigate to="/dashboard" replace />;

  useEffect(() => {
    loadProfiles();
  }, []);

  async function loadProfiles() {
    setLoading(true);
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id, name, email, role, created_at')
      .order('created_at', { ascending: true });

    if (!error && data) setProfiles(data as UserProfile[]);
    setLoading(false);
  }

  async function changeRole() {
    if (!confirm) return;
    setUpdating(true);

    const { error } = await supabase
      .from('profiles')
      .update({ role: confirm.newRole })
      .eq('id', confirm.profile.id);

    if (!error) {
      setProfiles((prev) =>
        prev.map((p) => (p.id === confirm.profile.id ? { ...p, role: confirm.newRole } : p))
      );
    }

    setUpdating(false);
    setConfirm(null);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Usuários</h1>
        <p className="text-muted-foreground text-sm mt-1">Gerencie os acessos e permissões dos usuários.</p>
      </div>

      <div className="rounded-lg border border-border bg-card">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">Carregando...</div>
        ) : profiles.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">Nenhum usuário encontrado.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Perfil</TableHead>
                <TableHead>Cadastrado em</TableHead>
                <TableHead className="text-right">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profiles.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>{p.email}</TableCell>
                  <TableCell>
                    <Badge variant={p.role === 'admin' ? 'default' : 'secondary'}>
                      {p.role === 'admin' ? 'Admin' : 'Usuário'}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(p.created_at).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell className="text-right">
                    {p.id !== user?.id && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setConfirm({ profile: p, newRole: p.role === 'admin' ? 'user' : 'admin' })
                        }
                      >
                        {p.role === 'admin' ? 'Rebaixar' : 'Promover a Admin'}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Dialog open={!!confirm} onOpenChange={() => setConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar alteração</DialogTitle>
            <DialogDescription>
              {confirm && (
                <>
                  Deseja {confirm.newRole === 'admin' ? 'promover' : 'rebaixar'}{' '}
                  <strong>{confirm.profile.name}</strong> para{' '}
                  <strong>{confirm.newRole === 'admin' ? 'Admin' : 'Usuário'}</strong>?
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirm(null)}>
              Cancelar
            </Button>
            <Button onClick={changeRole} disabled={updating}>
              {updating ? 'Salvando...' : 'Confirmar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
