import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileSpreadsheet, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { uploadInscricoes } from '@/services/upload';
import type { Inscricao } from '@/types';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [inscricoes, setInscricoes] = useState<Inscricao[]>([]);

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted.length) {
      setFile(accepted[0]);
      setError('');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
    maxFiles: 1,
  });

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const result = await uploadInscricoes(file);
      setInscricoes(result.inscricoes);
      setFile(null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erro ao processar o arquivo.');
    } finally {
      setUploading(false);
    }
  };

  const totalPago = inscricoes.filter((i) => i.status_pagamento === 'Pago').length;
  const totalPendente = inscricoes.filter((i) => i.status_pagamento === 'Pendente').length;
  const somaPago = inscricoes
    .filter((i) => i.status_pagamento === 'Pago')
    .reduce((acc, i) => acc + i.valor_competidor, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Upload de Planilha de Inscritos</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Envie o arquivo .xls ou .xlsx exportado do sistema de inscrições da ABQM.
        </p>
      </div>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">
          {isDragActive ? 'Solte o arquivo aqui...' : 'Arraste e solte um arquivo .xls / .xlsx aqui, ou clique para selecionar'}
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

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {inscricoes.length > 0 && (
        <>
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-primary" />
            <p className="text-sm text-primary font-medium">
              {inscricoes.length} inscrições importadas com sucesso.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <p className="text-2xl font-heading font-bold">{inscricoes.length}</p>
              <p className="text-xs text-muted-foreground mt-1">Total de Inscrições</p>
            </div>
            <div className="bg-card border border-green-500/20 rounded-lg p-4 text-center">
              <p className="text-2xl font-heading font-bold text-green-500">{totalPago}</p>
              <p className="text-xs text-muted-foreground mt-1">Pagos · R$ {somaPago.toLocaleString('pt-BR')}</p>
            </div>
            <div className="bg-card border border-yellow-500/20 rounded-lg p-4 text-center">
              <p className="text-2xl font-heading font-bold text-yellow-500">{totalPendente}</p>
              <p className="text-xs text-muted-foreground mt-1">Pendentes</p>
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
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Usuário</th>
                    <th className="text-right py-3 px-4 text-muted-foreground font-medium">Valor</th>
                    <th className="text-center py-3 px-4 text-muted-foreground font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {inscricoes.map((i, idx) => (
                    <tr key={idx} className="border-b border-border/50 hover:bg-muted/30">
                      <td className="py-2.5 px-4 text-xs">{i.prova}</td>
                      <td className="py-2.5 px-4 font-medium">{i.competidor}</td>
                      <td className="py-2.5 px-4 text-muted-foreground">{i.animal}</td>
                      <td className="py-2.5 px-4 text-muted-foreground">{i.usuario ?? '—'}</td>
                      <td className="py-2.5 px-4 text-right">
                        R$ {i.valor_competidor.toLocaleString('pt-BR')}
                      </td>
                      <td className="py-2.5 px-4 text-center">
                        <Badge
                          variant={i.status_pagamento === 'Pago' ? 'default' : 'secondary'}
                          className={
                            i.status_pagamento === 'Pago'
                              ? 'bg-green-500/20 text-green-600 hover:bg-green-500/20'
                              : 'bg-yellow-500/20 text-yellow-600 hover:bg-yellow-500/20'
                          }
                        >
                          {i.status_pagamento}
                        </Badge>
                      </td>
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
