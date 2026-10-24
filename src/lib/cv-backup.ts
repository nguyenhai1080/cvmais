export function parseCVBackup(raw: string) {
  if (new TextEncoder().encode(raw).byteLength > 512_000) throw new Error('O ficheiro é demasiado grande.');
  let value;
  try { value = JSON.parse(raw); } catch { throw new Error('Selecciona uma cópia de segurança CVMais válida.'); }
  if (value?.format !== 'cvmais-backup-v1' || !value.data || typeof value.data !== 'object' || Array.isArray(value.data)) throw new Error('Selecciona uma cópia de segurança CVMais válida.');
  return value.data as Record<string, unknown>;
}
