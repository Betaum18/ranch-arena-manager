export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export interface Championship {
  id: string;
  title: string;
  date: string;
  location: string;
  status: 'Inscrições Abertas' | 'Em Breve' | 'Encerrado';
}

export interface Inscricao {
  id?: string;
  prova: string;
  animal: string;
  competidor: string;
  usuario?: string;
  valor_dupla?: number;
  valor_competidor: number;
  status_pagamento: 'Pago' | 'Pendente';
  arquivo?: string;
  created_at?: string;
}

export interface UploadResult {
  success: boolean;
  fileName: string;
  inscricoes: Inscricao[];
}
