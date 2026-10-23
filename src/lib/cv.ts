export const models = ['classico', 'moderno', 'minimalista', 'criativo', 'executivo'] as const;
export type Model = (typeof models)[number];
export const modelLabels: Record<Model, string> = {
  classico: 'Clássico', moderno: 'Moderno', minimalista: 'Minimalista', criativo: 'Criativo', executivo: 'Executivo',
};
export type Entry = { id: string; title: string; organisation: string; period: string; description: string };
export type CVData = {
  name: string; role: string; email: string; phone: string; city: string; website: string;
  profile: string; skills: string; languages: string;
  experiences: Entry[]; education: Entry[]; model: Model;
};
export const DRAFT_KEY = 'cvmais-draft-v2';
export const MAX_ENTRIES = 8;
export const blank: CVData = {
  name: '', role: '', email: '', phone: '', city: '', website: '', profile: '', skills: '', languages: '',
  experiences: [], education: [], model: 'classico',
};
export function emptyCV(): CVData { return { ...blank, experiences: [], education: [] }; }
export function isModel(value: unknown): value is Model {
  return typeof value === 'string' && models.includes(value as Model);
}
function text(value: unknown, limit: number): string {
  return typeof value === 'string' ? value.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '').slice(0, limit) : '';
}
export function hasEntryContent(entry: Entry): boolean {
  return Boolean(entry.title.trim() || entry.organisation.trim() || entry.period.trim() || entry.description.trim());
}
function readEntries(value: unknown, legacy: unknown, prefix: string): Entry[] {
  if (!Array.isArray(value)) {
    const description = text(legacy, 4000);
    return description.trim() ? [{ id: `${prefix}-legacy`, title: '', organisation: '', period: '', description }] : [];
  }
  return value.filter(v => v && typeof v === 'object' && !Array.isArray(v)).slice(0, MAX_ENTRIES).map((v, index) => ({
    id: `${prefix}-${index}`, title: text(v.title, 150), organisation: text(v.organisation, 150),
    period: text(v.period, 100), description: text(v.description, 4000),
  }));
}
/** Treat stored/imported data as untrusted and migrate the original text-only editor. */
export function normaliseCV(value: unknown): CVData {
  const result = emptyCV();
  if (!value || typeof value !== 'object' || Array.isArray(value)) return result;
  const saved = value as Record<string, unknown>;
  for (const key of ['name', 'role', 'email', 'phone', 'city', 'website', 'profile', 'skills', 'languages'] as const) {
    result[key] = text(saved[key], ['profile', 'skills', 'languages'].includes(key) ? 4000 : 150);
  }
  result.experiences = readEntries(saved.experiences, saved.experience, 'work');
  result.education = readEntries(saved.education, saved.education, 'study');
  if (isModel(saved.model)) result.model = saved.model;
  return result;
}
export function readDraft(raw: string | null): CVData {
  try { return normaliseCV(raw ? JSON.parse(raw) : null); } catch { return emptyCV(); }
}
export function canExport(data: CVData): boolean {
  return Boolean(data.name.trim() && (data.profile.trim() || data.skills.trim() || data.languages.trim() ||
    data.experiences.some(hasEntryContent) || data.education.some(hasEntryContent)));
}
export function pdfFilename(name: string): string {
  const safe = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70);
  return `CV-${safe || 'curriculo'}.pdf`;
}
export function contactLine(data: CVData): string {
  return [data.city, data.phone, data.email, data.website].map(v => v.trim()).filter(Boolean).join(' · ');
}
