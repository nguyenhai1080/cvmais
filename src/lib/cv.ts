import { industryModels, industryVariant, designModel, type IndustryModel } from './industry-catalogue.ts';
export const legacyModels = ['classico', 'moderno', 'minimalista', 'criativo', 'executivo', 'primeiro', 'tecnico', 'saude', 'engenharia', 'servico'] as const;
export type LegacyModel = (typeof legacyModels)[number];
export type Model = LegacyModel | IndustryModel;
export const models:readonly Model[]=[...legacyModels,...industryModels];
const legacyLabels: Record<LegacyModel, string> = {
  classico: 'Maputo · Clássico', moderno: 'Índico · Moderno', minimalista: 'Essencial · Minimalista', criativo: 'Coral · Criativo', executivo: 'Prestígio · Executivo', primeiro: 'Horizonte · Primeiro emprego', tecnico:'Código · Tecnologia', saude:'Vital · Saúde e educação', engenharia:'Estrutura · Engenharia', servico:'Acolher · Serviços',
};
export const modelLabels:Record<Model,string>={...legacyLabels,...Object.fromEntries(industryModels.map(id=>{const v=industryVariant(id)!;return [id,`${v.industry.brand} · ${v.layout.label}`];}))} as Record<Model,string>;
export type Entry = { id: string; title: string; organisation: string; period: string; description: string };
export type CVData = {
  cvLanguage: 'pt' | 'en';
  name: string; role: string; email: string; phone: string; city: string; website: string;
  profile: string; skills: string; languages: string; photo: string;
  experiences: Entry[]; education: Entry[]; model: Model;
};
export const DRAFT_KEY = 'cvmais-draft-v2';
export const MAX_ENTRIES = 8;
export const blank: CVData = {
  cvLanguage:'pt', name: '', role: '', email: '', phone: '', city: '', website: '', profile: '', skills: '', languages: '',
  experiences: [], education: [], model: 'classico', photo: '',
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
  result.cvLanguage = saved.cvLanguage === 'en' ? 'en' : 'pt';
  for (const key of ['name', 'role', 'email', 'phone', 'city', 'website', 'profile', 'skills', 'languages'] as const) {
    result[key] = text(saved[key], ['profile', 'skills', 'languages'].includes(key) ? 4000 : 150);
  }
  result.experiences = readEntries(saved.experiences, saved.experience, 'work');
  result.education = readEntries(saved.education, saved.education, 'study');
  if (isModel(saved.model)) result.model = saved.model;
  result.photo = normalisePhoto(saved.photo);
  return result;
}
export function normalisePhoto(value: unknown): string {
  if (typeof value !== 'string' || value.length > 160_000 || !/^data:image\/jpeg;base64,\/9j\/[A-Za-z0-9+/]*={0,2}$/.test(value)) return '';
  try {
    const bytes = atob(value.slice('data:image/jpeg;base64,'.length));
    return bytes.charCodeAt(bytes.length - 2) === 255 && bytes.charCodeAt(bytes.length - 1) === 217 ? value : '';
  } catch { return ''; }
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
/** Keep compact sidebars on the first page; long content reflows into the main column. */
export function usesSidebar(data: CVData): boolean {
  const family=designModel(data.model);
  if (['minimalista','tecnico','engenharia'].includes(family)) return false;
  if (['saude','servico'].includes(family) && !data.skills.trim() && !data.languages.trim()) return false;
  const study = ['moderno', 'executivo'].includes(family) ? data.education.flatMap(e => [e.title,e.organisation,e.period,e.description]) : [];
  const lines = [data.skills, data.languages, ...study]
    .filter(Boolean).flatMap(value => value.split('\n'))
    .reduce((sum, line) => sum + Math.max(1, Math.ceil(line.length / 20)), 0);
  return lines <= 31;
}
