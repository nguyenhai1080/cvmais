export const models = ['classico', 'moderno', 'minimalista', 'criativo', 'executivo'] as const;
export type Model = (typeof models)[number];
export type CVData = {
  name: string; role: string; email: string; city: string;
  profile: string; experience: string; education: string; skills: string;
  model: Model;
};
export const blank: CVData = {
  name: '', role: '', email: '', city: '', profile: '', experience: '',
  education: '', skills: '', model: 'classico',
};
export function isModel(value: unknown): value is Model {
  return typeof value === 'string' && models.includes(value as Model);
}
/** Restore only supported text fields. Storage is user-controlled and may be corrupt. */
export function readDraft(raw: string | null): CVData {
  if (!raw) return { ...blank };
  let parsed: unknown;
  try { parsed = JSON.parse(raw); } catch { return { ...blank }; }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return { ...blank };
  const saved = parsed as Record<string, unknown>;
  const result = { ...blank };
  for (const key of ['name', 'role', 'email', 'city', 'profile', 'experience', 'education', 'skills'] as const) {
    if (typeof saved[key] === 'string') {
      result[key] = saved[key].slice(0, ['name', 'role', 'email', 'city'].includes(key) ? 150 : 4000);
    }
  }
  if (isModel(saved.model)) result.model = saved.model;
  return result;
}
