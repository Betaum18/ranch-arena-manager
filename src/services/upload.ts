import * as XLSX from 'xlsx';
import { supabase } from '@/lib/supabase';
import type { Inscricao, UploadResult } from '@/types';

function calcularValorCompetidor(prova: string): number {
  return prova.trim().endsWith('Castrado') ? 50 : 100;
}

function parseXls(file: File): Promise<Inscricao[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target!.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows: Record<string, unknown>[] = XLSX.utils.sheet_to_json(sheet, { defval: '' });

        const inscricoes: Inscricao[] = rows
          .map((row) => {
            const prova = String(row['Prova'] ?? '').trim();
            const animal = String(row['Animal'] ?? '').trim();
            const competidor = String(row['Competidor'] ?? '').trim();
            const usuario = String(row['Usuário'] ?? row['Usuario'] ?? '').trim() || undefined;
            const valorRaw = row['Valor'];
            const valor_dupla = valorRaw !== '' && valorRaw != null ? Number(valorRaw) : undefined;
            const valor_competidor = calcularValorCompetidor(prova);
            const status_pagamento: 'Pago' | 'Pendente' = valor_dupla != null ? 'Pago' : 'Pendente';

            return { prova, animal, competidor, usuario, valor_dupla, valor_competidor, status_pagamento };
          })
          .filter((i) => i.prova && i.competidor);

        resolve(inscricoes);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Erro ao ler o arquivo.'));
    reader.readAsArrayBuffer(file);
  });
}

export async function uploadInscricoes(file: File): Promise<UploadResult> {
  const inscricoes = await parseXls(file);

  const rows = inscricoes.map((i) => ({ ...i, arquivo: file.name }));
  const { error } = await supabase.from('inscricoes').insert(rows);
  if (error) throw new Error(error.message);

  return { success: true, fileName: file.name, inscricoes };
}
