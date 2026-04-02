import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Trash2, Pencil, Loader2 } from 'lucide-react';
import type { Inscricao } from '@/types';

export default function Inscricoes() {
  const [inscricoes, setInscricoes] = useState<Inscricao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selecionadas, setSelecionadas] = useState<Set<string>>(new Set());
  const [deletando, setDeletando] = useState(false);

  const [editando, setEditando] = useState<Inscricao | null>(null);
  const [salvando, setSalvando] = useState(false);

  async function carregar() {
    setLoading(true);
    setError('');
    const { data, error } = await supabase
      .from('inscricoes')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) setError(error.message);
    else setInscricoes(data ?? []);
    setLoading(false);
  }

  useEffect(() => { carregar(); }, []);

  function toggleSelecionada(id: string) {
    setSelecionadas((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleTodas() {
    if (selecionadas.size === inscricoes.length) {
      setSelecionadas(new Set());
    } else {
      setSelecionadas(new Set(inscricoes.map((i) => i.id!)));
    }
  }

  async function deletarSelecionadas() {
    if (!selecionadas.size) return;
    setDeletando(true);
    const ids = Array.from(selecionadas);
    const { error } = await supabase.from('inscricoes').delete().in('id', ids);
    if (error) setError(error.message);
    else {
      setInscricoes((prev) => prev.filter((i) => !selecionadas.has(i.id!)));
      setSelecionadas(new Set());
    }
    setDeletando(false);
  }

  async function deletarUma(id: string) {
    const { error } = await supabase.from('inscricoes').delete().eq('id', id);
    if (error) setError(error.message);
    else setInscricoes((prev) => prev.filter((i) => i.id !== id));
  }

  async function salvarEdicao() {
    if (!editando?.id) return;
    setSalvando(true);
    const { error } = await supabase
      .from('inscricoes')
      .update({
        prova: editando.prova,
        animal: editando.animal,
        competidor: editando.competidor,
        valor_competidor: editando.valor_competidor,
      })
      .eq('id', editando.id);
    if (error) setError(error.message);
    else {
      setInscricoes((prev) =>
        prev.map((i) => (i.id === editando.id ? editando : i))
      );
      setEditando(null);
    }
    setSalvando(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Inscrições</h1>
          <p className="text-muted-foreground mt-1 text-sm">{inscricoes.length} inscrições no banco</p>
        </div>
        {selecionadas.size > 0 && (
          <Button
            variant="destructive"
            onClick={deletarSelecionadas}
            disabled={deletando}
            className="gap-2"
          >
            {deletando ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            Apagar {selecionadas.size} selecionada{selecionadas.size > 1 ? 's' : ''}
          </Button>
        )}
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : inscricoes.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground text-sm">Nenhuma inscrição encontrada.</div>
      ) : (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="py-3 px-4 w-10">
                    <input
                      type="checkbox"
                      checked={selecionadas.size === inscricoes.length}
                      onChange={toggleTodas}
                      className="rounded"
                    />
                  </th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Prova</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Competidor</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Animal</th>
                  <th className="text-right py-3 px-4 text-muted-foreground font-medium">Valor</th>
                  <th className="py-3 px-4 w-20" />
                </tr>
              </thead>
              <tbody>
                {inscricoes.map((i) => (
                  <tr key={i.id} className={`border-b border-border/50 hover:bg-muted/30 ${selecionadas.has(i.id!) ? 'bg-muted/20' : ''}`}>
                    <td className="py-2.5 px-4">
                      <input
                        type="checkbox"
                        checked={selecionadas.has(i.id!)}
                        onChange={() => toggleSelecionada(i.id!)}
                        className="rounded"
                      />
                    </td>
                    <td className="py-2.5 px-4 text-xs text-muted-foreground">{i.prova}</td>
                    <td className="py-2.5 px-4 font-medium">{i.competidor}</td>
                    <td className="py-2.5 px-4 text-muted-foreground">{i.animal}</td>
                    <td className="py-2.5 px-4 text-right">R$ {i.valor_competidor.toLocaleString('pt-BR')}</td>
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          onClick={() => setEditando({ ...i })}
                          className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => deletarUma(i.id!)}
                          className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Dialog open={!!editando} onOpenChange={(open) => !open && setEditando(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Inscrição</DialogTitle>
          </DialogHeader>
          {editando && (
            <div className="space-y-4 py-2">
              <div>
                <Label>Prova</Label>
                <Input
                  className="mt-1"
                  value={editando.prova}
                  onChange={(e) => setEditando({ ...editando, prova: e.target.value })}
                />
              </div>
              <div>
                <Label>Competidor</Label>
                <Input
                  className="mt-1"
                  value={editando.competidor}
                  onChange={(e) => setEditando({ ...editando, competidor: e.target.value })}
                />
              </div>
              <div>
                <Label>Animal</Label>
                <Input
                  className="mt-1"
                  value={editando.animal}
                  onChange={(e) => setEditando({ ...editando, animal: e.target.value })}
                />
              </div>
              <div>
                <Label>Valor (R$)</Label>
                <Input
                  className="mt-1"
                  type="number"
                  value={editando.valor_competidor}
                  onChange={(e) => setEditando({ ...editando, valor_competidor: Number(e.target.value) })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditando(null)}>Cancelar</Button>
            <Button onClick={salvarEdicao} disabled={salvando}>
              {salvando && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
