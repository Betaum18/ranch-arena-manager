import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileSpreadsheet, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { parseInscricoes, salvarInscricoes } from '@/services/upload';
import type { Campeonato, Inscricao } from '@/types';

export default function UploadPage() {
  const [campeonatos, setCampeonatos] = useState<Campeonato[]>([]);
  const [campeonatoId, setCampeonatoId] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [parseError, setParseError] = useState('');
  const [inscricoes, setInscricoes] = useState<Inscricao[]>([]);

  useEffect(() => {
    supabase
      .from('campeonatos')
      .select('id, nome, data_inicio, data_fim, local')
      .order('data_inicio', { ascending: false })
      .then(({ data }) => setCampeonatos(data ?? []));
  }, []);

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted.length) {
      setFile(accepted[0]);
      setParseError('');
      setSaveError('');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
    maxFiles: 1,
    disabled: !campeonatoId,
  });

  const handleUpload = async () => {
    if (!file || !campeonatoId) return;
    setUploading(true);
    setParseError('');
    setSaveError('');
    try {
      const parsed = await parseInscricoes(file);
      setInscricoes(parsed);
      setFile(null);
      salvarInscricoes(file, parsed, campeonatoId).catch((e: unknown) => {
        setSaveError(e instanceof Error ? e.message : 'Erro ao salvar no banco.');
      });
    } catch (e: unknown) {
      setParseError(e instanceof Error ? e.message : 'Erro ao processar o arquivo.');
    } finally {
      setUploading(false);
    }
  };

  const totalValor = inscricoes.reduce((acc, i) => acc + i.valor_competidor, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Upload de Planilha de Inscritos</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Selecione o campeonato e envie o arquivo .xls ou .xlsx exportado do sistema ABQM.
        </p>
      </div>

      <div className="bg-card border border-border rounded-lg p-5 space-y-2">
        <Label htmlFor="campeonato">Campeonato</Label>
        <select
          id="campeonato"
          value={campeonatoId}
          onChange={(e) => { setCampeonatoId(e.target.value); setFile(null); setInscricoes([]); }}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">Selecione um campeonato...</option>
          {campeonatos.map((c) => (
            <option key={c.id} value={c.id}>{c.nome}</option>
          ))}
        </select>
        {campeonatos.length === 0 && (
          <p className="text-xs text-muted-foreground">Nenhum campeonato cadastrado. Crie um primeiro na aba Campeonatos.</p>
        )}
      </div>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-10 text-center transition-colors ${
          !campeonatoId
            ? 'border-border opacity-40 cursor-not-allowed'
            : isDragActive
            ? 'border-primary bg-primary/5 cursor-pointer'
            : 'border-border hover:border-primary/50 cursor-pointer'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">
          {!campeonatoId
            ? 'Selecione um campeonato acima para habilitar o upload'
            : isDragActive
            ? 'Solte o arquivo aqui...'
            : 'Arraste e solte um arquivo .xls / .xlsx aqui, ou clique para selecionar'}
        </p>
        <p className="text-xs text-muted-foreground/60 mt-1">Apenas arquivos .xls e .xlsx</p>
      </div>

      {file && (
        <div className="bg-card border border-border rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileSpreadsheet className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium">{file.name}</p>
              <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
          </div>
          <Button
            onClick={handleUpload}
            disabled={uploading}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-heading uppercase tracking-wider text-sm"
          >
            {uploading ? 'Processando...' : 'Importar'}
          </Button>
        </div>
      )}

      {parseError && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <p className="text-sm text-destructive">{parseError}</p>
        </div>
      )}

      {inscricoes.length > 0 && (
        <>
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-primary" />
            <p className="text-sm text-primary font-medium">
              {inscricoes.length} inscrições lidas com sucesso.
            </p>
          </div>
          {saveError && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
              <p className="text-sm text-yellow-600">Aviso: {saveError}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <p className="text-2xl font-heading font-bold">{inscricoes.length}</p>
              <p className="text-xs text-muted-foreground mt-1">Total de Inscrições</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <p className="text-2xl font-heading font-bold">R$ {totalValor.toLocaleString('pt-BR')}</p>
              <p className="text-xs text-muted-foreground mt-1">Valor Total</p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Prova</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Competidor</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Animal</th>
                    <th className="text-right py-3 px-4 text-muted-foreground font-medium">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {inscricoes.map((i, idx) => (
                    <tr key={idx} className="border-b border-border/50 hover:bg-muted/30">
                      <td className="py-2.5 px-4 text-xs">{i.prova}</td>
                      <td className="py-2.5 px-4 font-medium">{i.competidor}</td>
                      <td className="py-2.5 px-4 text-muted-foreground">{i.animal}</td>
                      <td className="py-2.5 px-4 text-right">R$ {i.valor_competidor.toLocaleString('pt-BR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
