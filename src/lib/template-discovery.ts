import { templates, templateAreas, templateMatchesArea, areasForTemplate, newTemplateIds } from './templates.ts';
import { industryVariant } from './industry-catalogue.ts';
import { uiEnglish } from './ui-en.ts';
import type { Model } from './cv.ts';

export const templateStyles = ['Todos', 'Novos', 'Profissional', 'Criativo', 'Primeiro emprego'] as const;
export type TemplateFilters = { area: string; style: string; query: string };
export const defaultTemplateFilters: TemplateFilters = { area: 'all', style: 'Todos', query: '' };
const keywords: Record<string, string> = {
  administracao: 'administrativo administrativa secretaria secretariado escritório office assistant administration',
  contabilidade: 'contabilista contabilístico financeiro financeira accounting accountant finance auditor',
  tecnologia: 'programador programadora programação informática developer software engineer IT technology designer UX UI',
  saude: 'enfermeiro enfermeira enfermagem médico médica saúde cuidados nurse nursing healthcare care',
  educacao: 'professor professora docente ensino educação teacher teaching education training',
  engenharia: 'engenheiro engenheira construção obras manutenção engineer engineering construction maintenance',
  logistica: 'logística armazém motorista transportes logística warehouse logistics driver supply chain',
  vendas: 'vendedor vendedora comercial atendimento vendas sales customer service retail',
  hotelaria: 'recepcionista rececionista recepção turismo hotelaria cozinha hotel hospitality tourism receptionist chef',
  comunicacao: 'comunicação marketing publicidade conteúdos digital social media communication copywriter',
  agricultura: 'agrícola agricultura agrónomo agrónoma produção agriculture farming agronomy',
  projectos: 'projectos projetos comunitário ONG voluntariado project NGO community nonprofit volunteer',
};
function fold(text: string) { return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase(); }

export function readTemplateFilters(params: URLSearchParams): TemplateFilters {
  const area = params.get('area') || 'all', style = params.get('estilo') || 'Todos';
  return {
    area: area === 'gerais' || templateAreas.some(a => a.id === area) ? area : 'all',
    style: templateStyles.some(s => s === style) ? style : 'Todos',
    query: (params.get('q') || '').slice(0, 100),
  };
}
export function templateLibraryHref(filters: TemplateFilters) {
  const params = new URLSearchParams();
  if (filters.area !== 'all') params.set('area', filters.area);
  if (filters.style !== 'Todos') params.set('estilo', filters.style);
  if (filters.query.trim()) params.set('q', filters.query.trim());
  return '/modelos' + (params.size ? '?' + params.toString() : '');
}
export function safeTemplateReturn(value: string | null) {
  if (!value || !value.startsWith('/modelos')) return '/modelos';
  const url = new URL(value, 'https://cvmais.win');
  if (url.origin !== 'https://cvmais.win' || url.pathname !== '/modelos') return '/modelos';
  return templateLibraryHref(readTemplateFilters(url.searchParams));
}
export function templateEditorHref(model: Model, filters: TemplateFilters) {
  const area = filters.area === 'all' || filters.area === 'gerais' ? areasForTemplate(model)[0].id : filters.area;
  const params = new URLSearchParams({ modelo: model, area, biblioteca: templateLibraryHref(filters) });
  return '/criar-cv?' + params.toString();
}
export function discoverTemplates(filters: TemplateFilters) {
  const terms = fold(filters.query.trim()).split(/\s+/).filter(Boolean);
  return templates.filter(t => {
    if (!templateMatchesArea(t.id, filters.area)) return false;
    if (filters.style !== 'Todos' && !(filters.style === 'Novos' ? newTemplateIds.includes(t.id) : t.category === filters.style)) return false;
    const variant = industryVariant(t.id);
    const areas = areasForTemplate(t.id);
    const text = [t.name, t.description, t.detail, t.category, variant?.industry.role || '', variant?.layout.en || '',
      ...areas.flatMap(a => [a.label, uiEnglish[a.label] || '', keywords[a.id] || '']),
      ...[t.name, t.description, t.detail, t.category].map(value => uiEnglish[value] || '')].join(' ');
    const haystack = fold(text);
    return terms.every(term => haystack.includes(term));
  });
}
