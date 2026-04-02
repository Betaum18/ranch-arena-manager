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
import { Pencil, Loader2 } from 'lucide-react';

interface Categoria {
  prova: string;
  valor_competidor: number;
  total: number;
}

export default function Categorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [editando, setEditando] = useState<{ prova: string; novoNome: string; novoValor: number } | null>(null);
  const [salvando, setSalvando] = useState(false);

  async function carregar() {
    setLoading(true);
    setError('');
    const { data, error } = await supabase
      .from('inscricoes')
      .select('prova, valor_competidor');
    if (error) { setError(error.message); setLoading(false); return; }

    const mapa = new Map<string, Categoria>();
    for (const row of data ?? []) {
      const existing = mapa.get(row.prova);
      if (existing) {
        existing.total += 1;
      } else {
        mapa.set(row.prova, { prova: row.prova, valor_competidor: row.valor_competidor, total: 1 });
      }
    }
    setCategorias(Array.from(mapa.values()).sort((a, b) => a.prova.localeCompare(b.prova)));
    setLoading(false);
  }

  useEffect(() => { carregar(); }, []);

  async function salvarEdicao() {
    if (!editando) return;
    setSalvando(true);
    setError('');

    const updates: Promise<{ error: { message: string } | null }>[] = [];

    if (editando.novoNome !== editando.prova) {
      updates.push(
        supabase
          .from('inscricoes')
          .update({ prova: editando.novoNome })
          .eq('prova', editando.prova)
          .then(({ error }) => ({ error }))
      );
    }

    const cat = categorias.find((c) => c.prova === editando.prova);
    if (cat && editando.novoValor !== cat.valor_competidor) {
      const provaAlvo = editando.novoNome !== editando.prova ? editando.novoNome : editando.prova;
      updates.push(
        supabase
          .from('inscricoes')
          .update({ valor_competidor: editando.novoValor })
          .eq('prova', provaAlvo)
          .then(({ error }) => ({ error }))
      );
    }

    const results = await Promise.all(updates);
    const erros = results.filter((r) => r.error);
    if (erros.length) {
      setError(erros[0].error!.message);
    } else {
      setEditando(null);
      await carregar();
    }
    setSalvando(false);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Categorias</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {categorias.length} categorias cadastradas via planilha
        </p>
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
      ) : categorias.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground text-sm">
          Nenhuma categoria encontrada. Faça upload de uma planilha primeiro.
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Categoria</th>
                  <th className="text-right py-3 px-4 text-muted-foreground font-medium">Valor</th>
                  <th className="text-right py-3 px-4 text-muted-foreground font-medium">Inscrições</th>
                  <th className="py-3 px-4 w-16" />
                </tr>
              </thead>
              <tbody>
                {categorias.map((c) => (
                  <tr key={c.prova} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="py-2.5 px-4 font-medium">{c.prova}</td>
                    <td className="py-2.5 px-4 text-right">R$ {c.valor_competidor.toLocaleString('pt-BR')}</td>
                    <td className="py-2.5 px-4 text-right text-muted-foreground">{c.total}</td>
                    <td className="py-2.5 px-4 text-right">
                      <button
                        onClick={() => setEditando({ prova: c.prova, novoNome: c.prova, novoValor: c.valor_competidor })}
                        className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
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
            <DialogTitle>Editar Categoria</DialogTitle>
          </DialogHeader>
          {editando && (
            <div className="space-y-4 py-2">
              <div>
                <Label>Nome da categoria</Label>
                <Input
                  className="mt-1"
                  value={editando.novoNome}
                  onChange={(e) => setEditando({ ...editando, novoNome: e.target.value })}
                />
              </div>
              <div>
                <Label>Valor da inscrição (R$)</Label>
                <Input
                  className="mt-1"
                  type="number"
                  value={editando.novoValor}
                  onChange={(e) => setEditando({ ...editando, novoValor: Number(e.target.value) })}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                As alterações serão aplicadas em todas as inscrições desta categoria.
              </p>
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
