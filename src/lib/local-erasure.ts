export const ERASURE_EVENT = 'cvmais-erasure';
export function clearPrivateCopies(userId: string, cvId?: string) {
  const prefix = `cvmais-pending:${userId}:`;
  try {
    const keys = Object.keys(localStorage).filter(key => cvId ? key === `${prefix}${cvId}` : key.startsWith(prefix));
    keys.forEach(key => localStorage.removeItem(key));
    // Notify other current tabs so an open editor stops saving removed documents.
    localStorage.setItem(ERASURE_EVENT, JSON.stringify({ userId, cvId: cvId || null, at: Date.now() }));
    localStorage.removeItem(ERASURE_EVENT);
  } catch { /* The server deletion succeeds even when browser storage is unavailable. */ }
}
