import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileSpreadsheet, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { uploadInscricoes } from '@/services/upload';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted.length) {
      setFile(accepted[0]);
      setSuccess(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'] },
    maxFiles: 1,
  });

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    await uploadInscricoes(file);
    setUploading(false);
    setSuccess(true);
    setFile(null);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-heading text-2xl font-bold">Upload de Planilha de Inscritos</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Envie o arquivo .xlsx exportado do sistema de inscrições para processar os dados dos competidores.
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
          {isDragActive ? 'Solte o arquivo aqui...' : 'Arraste e solte um arquivo .xlsx aqui, ou clique para selecionar'}
        </p>
        <p className="text-xs text-muted-foreground/60 mt-1">Apenas arquivos .xlsx</p>
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
          <Button onClick={handleUpload} disabled={uploading} className="bg-primary hover:bg-primary/90 text-primary-foreground font-heading uppercase tracking-wider text-sm">
            {uploading ? 'Enviando...' : 'Enviar Arquivo'}
          </Button>
        </div>
      )}

      {success && (
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-primary" />
          <p className="text-sm text-primary font-medium">Arquivo enviado com sucesso!</p>
        </div>
      )}

      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="font-heading text-lg font-bold mb-4">Inscrições Processadas</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 text-muted-foreground font-medium">Nome</th>
                <th className="text-left py-2 px-3 text-muted-foreground font-medium">Dupla</th>
                <th className="text-left py-2 px-3 text-muted-foreground font-medium">Categoria</th>
                <th className="text-left py-2 px-3 text-muted-foreground font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={4} className="text-center py-8 text-muted-foreground italic">
                  Nenhum arquivo enviado ainda
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
