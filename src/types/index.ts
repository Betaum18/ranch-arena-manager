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

export interface Inscription {
  id: string;
  nome: string;
  dupla: string;
  categoria: string;
  status: 'Confirmado' | 'Pendente';
}

export interface UploadResult {
  success: boolean;
  fileName: string;
}
