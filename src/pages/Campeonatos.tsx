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
import { Trash2, Pencil, Loader2, Plus, MapPin, Calendar } from 'lucide-react';
import type { Campeonato } from '@/types';

const vazio: Omit<Campeonato, 'id' | 'created_at'> = {
  nome: '',
  data_inicio: '',
  data_fim: '',
  local: '',
};

function formatarPeriodo(inicio: string, fim: string) {
  const fmt = (d: string) =>
    new Date(d + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  return inicio === fim ? fmt(inicio) : `${fmt(inicio)} – ${fmt(fim)}`;
}

export default function Campeonatos() {
  const [campeonatos, setCampeonatos] = useState<Campeonato[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [modal, setModal] = useState<'criar' | 'editar' | null>(null);
  const [form, setForm] = useState<Omit<Campeonato, 'id' | 'created_at'>>(vazio);
  const [editId, setEditId] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  async function carregar() {
    setLoading(true);
    const { data, error } = await supabase
      .from('campeonatos')
      .select('*')
      .order('data_inicio', { ascending: false });
    if (error) setError(error.message);
    else setCampeonatos(data ?? []);
    setLoading(false);
  }

  useEffect(() => { carregar(); }, []);

  function abrirCriar() {
    setForm(vazio);
    setModal('criar');
  }

  function abrirEditar(c: Campeonato) {
    setForm({ nome: c.nome, data_inicio: c.data_inicio, data_fim: c.data_fim, local: c.local });
    setEditId(c.id!);
    setModal('editar');
  }

  async function salvar() {
    if (!form.nome || !form.data_inicio || !form.data_fim || !form.local) {
      setError('Preencha todos os campos.');
      return;
    }
    setSalvando(true);
    setError('');

    if (modal === 'criar') {
      const { error } = await supabase.from('campeonatos').insert(form);
      if (error) setError(error.message);
      else { setModal(null); await carregar(); }
    } else {
      const { error } = await supabase.from('campeonatos').update(form).eq('id', editId!);
      if (error) setError(error.message);
      else { setModal(null); await carregar(); }
    }
    setSalvando(false);
  }

  async function deletar(id: string) {
    const { error } = await supabase.from('campeonatos').delete().eq('id', id);
    if (error) setError(error.message);
    else setCampeonatos((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Campeonatos</h1>
          <p className="text-muted-foreground mt-1 text-sm">{campeonatos.length} campeonato{campeonatos.length !== 1 ? 's' : ''} cadastrado{campeonatos.length !== 1 ? 's' : ''}</p>
        </div>
        <Button onClick={abrirCriar} className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-heading uppercase tracking-wider text-sm">
          <Plus className="h-4 w-4" /> Novo Campeonato
        </Button>
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
      ) : campeonatos.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground text-sm">
          Nenhum campeonato cadastrado ainda.
        </div>
      ) : (
        <div className="grid gap-4">
          {campeonatos.map((c) => (
            <div key={c.id} className="bg-card border border-border rounded-lg p-5 flex items-center justify-between gap-4">
              <div className="space-y-1.5 min-w-0">
                <h2 className="font-heading font-semibold text-lg leading-tight truncate">{c.nome}</h2>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatarPeriodo(c.data_inicio, c.data_fim)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    {c.local}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => abrirEditar(c)}
                  className="p-2 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => deletar(c.id!)}
                  className="p-2 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!modal} onOpenChange={(open) => !open && setModal(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{modal === 'criar' ? 'Novo Campeonato' : 'Editar Campeonato'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Nome</Label>
              <Input
                className="mt-1"
                placeholder="Ex: Ranch Sorting Regional 2026"
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Data início</Label>
                <Input
                  className="mt-1"
                  type="date"
                  value={form.data_inicio}
                  onChange={(e) => setForm({ ...form, data_inicio: e.target.value })}
                />
              </div>
              <div>
                <Label>Data fim</Label>
                <Input
                  className="mt-1"
                  type="date"
                  value={form.data_fim}
                  onChange={(e) => setForm({ ...form, data_fim: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label>Local</Label>
              <Input
                className="mt-1"
                placeholder="Ex: Arena Municipal de Cascavel"
                value={form.local}
                onChange={(e) => setForm({ ...form, local: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModal(null)}>Cancelar</Button>
            <Button onClick={salvar} disabled={salvando}>
              {salvando && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {modal === 'criar' ? 'Criar' : 'Salvar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
