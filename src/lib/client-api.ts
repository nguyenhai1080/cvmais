import type { CVData } from './cv';
export type Account = { id: string; email: string };
export type CloudCV = { id: string; title: string; data: CVData; revision: number; updated: number; deleted: number | null };
export class APIError extends Error {
  status: number;
  constructor(message: string, status: number) { super(message); this.status = status; }
}
export async function api<T>(path: string, method = 'GET', body?: unknown): Promise<T> {
  const response = await fetch(`/api/storage/${path}`, { method, cache: 'no-store', credentials: 'same-origin',
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' }, body: body === undefined ? undefined : JSON.stringify(body) });
  const value = await response.json();
  if (!response.ok) throw new APIError(value.error || 'Não foi possível concluir o pedido.', response.status);
  return value;
}
export function errorMessage(error: unknown) { return error instanceof Error ? error.message : 'Não foi possível ligar ao servidor. Tenta novamente.'; }
