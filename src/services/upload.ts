import type { UploadResult } from '@/types';

export async function uploadInscricoes(file: File): Promise<UploadResult> {
  // TODO: replace with Supabase Storage upload
  console.log('Mock upload:', file.name);
  await new Promise((r) => setTimeout(r, 1000));
  return { success: true, fileName: file.name };
}
