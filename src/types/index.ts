export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export interface Campeonato {
  id?: string;
  nome: string;
  data_inicio: string;
  data_fim: string;
  local: string;
  created_at?: string;
}

export interface Inscricao {
  id?: string;
  campeonato_id?: string;
  prova: string;
  animal: string;
  competidor: string;
  valor_competidor: number;
  arquivo?: string;
  created_at?: string;
}

export interface UploadResult {
  success: boolean;
  fileName: string;
  inscricoes: Inscricao[];
}
