import type { CVData, Model } from './cv';
export const themes: Record<Model, { accent: string; pale: string; ink: string }> = {
  classico: { accent: '#087F82', pale: '#E9F3F2', ink: '#183B55' },
  moderno: { accent: '#087F82', pale: '#ECF7F4', ink: '#193C43' },
  minimalista: { accent: '#394550', pale: '#F1F3F3', ink: '#23303B' },
  criativo: { accent: '#BB5343', pale: '#FBEDE7', ink: '#3E3637' },
  executivo: { accent: '#967238', pale: '#F5F1E9', ink: '#263743' },
  primeiro: { accent: '#6656A0', pale: '#F0EDF8', ink: '#303448' },
  tecnico:{accent:'#146F82',pale:'#EAF3F6',ink:'#182E3E'},
  saude:{accent:'#377561',pale:'#EAF4EE',ink:'#24483F'},
  engenharia:{accent:'#2556A0',pale:'#EBF0F8',ink:'#24354A'},
  servico:{accent:'#824253',pale:'#F9F0EE',ink:'#433039'},
};
export type IconKind = 'work' | 'study' | 'profile' | 'skills' | 'languages' | 'mail' | 'phone' | 'city' | 'website';
export const iconPaths: Record<IconKind, string> = {
  work: 'M4 7h16v13H4z M9 7V4h6v3 M4 12h16 M10 12v3h4v-3',
  study: 'M2 8l10-5 10 5-10 5z M6 10v7c4 3 8 3 12 0v-7 M22 8v9',
  profile: 'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0 M4 21v-3c0-6 16-6 16 0v3',
  skills: 'M12 3l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z',
  languages: 'M3 5h12 M9 2v3 M5 5c0 7 5 10 10 11 M13 5c0 7-5 10-10 11 M14 22l4-10 4 10 M16 18h4',
  mail: 'M3 5h18v14H3z M3 6l9 7 9-7',
  phone: 'M5 3l4 1 1 5-3 2c2 3 3 4 6 6l2-3 5 1 1 4c-1 5-7 3-12-2S1 5 5 3',
  city: 'M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0 M14 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0',
  website: 'M10 14l4-4 M8 16l-2 2a4 4 0 0 1-6-6l5-5a4 4 0 0 1 6 0 M16 8l2-2a4 4 0 0 1 6 6l-5 5a4 4 0 0 1-6 0',
};
export function contacts(data: CVData) {
  return (['email','phone','city','website'] as const).filter(key => data[key].trim()).map(key => ({ key, kind: (key === 'email' ? 'mail' : key) as IconKind, text: data[key].trim() }));
}
/** Present short lists as chips without inventing skill ratings or dropping long text. */
export function chips(value: string): string[] | null {
  const items = value.split(/[\n;,·]+/).map(s => s.trim()).filter(Boolean);
  return items.length > 0 && items.length <= 20 && items.every(s => s.length <= 55) ? items : null;
}
