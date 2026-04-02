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
            const valor_competidor = calcularValorCompetidor(prova);

            return { prova, animal, competidor, valor_competidor };
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

export async function parseInscricoes(file: File): Promise<Inscricao[]> {
  return parseXls(file);
}

export async function salvarInscricoes(file: File, inscricoes: Inscricao[], campeonatoId: string): Promise<void> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Tempo esgotado ao salvar. Verifique a conexão.')), 10000)
  );

  const rows = inscricoes.map((i) => ({ ...i, arquivo: file.name, campeonato_id: campeonatoId }));
  const { error } = await Promise.race([
    supabase.from('inscricoes').insert(rows),
    timeout,
  ]);
  if (error) throw new Error(error.message);
}
