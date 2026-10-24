import { emptyCV, type Model, type CVData } from './cv';
export type TemplateCategory = 'Profissional' | 'Criativo' | 'Primeiro emprego';
export const templates: { id: Model; name: string; category: TemplateCategory; description: string; colour: string; detail: string }[] = [
  { id: 'classico', name: 'Maputo', category: 'Profissional', description: 'Uma apresentação com presença.', colour: '#183B55', detail: 'Retrato circular · Cabeçalho azul profundo' },
  { id: 'moderno', name: 'Índico', category: 'Profissional', description: 'O teu percurso, com clareza e ritmo.', colour: '#087f82', detail: 'Fotografia · Percurso em linha do tempo' },
  { id: 'minimalista', name: 'Essencial', category: 'Profissional', description: 'A tua experiência fala por si.', colour: '#363b40', detail: 'Uma coluna · Tipografia editorial' },
  { id: 'criativo', name: 'Coral', category: 'Criativo', description: 'Personalidade, com equilíbrio.', colour: '#bb5a48', detail: 'Retrato circular · Destaques em coral' },
  { id: 'executivo', name: 'Prestígio', category: 'Profissional', description: 'Presença para o próximo desafio.', colour: '#967238', detail: 'Fotografia · Tipografia editorial e dourado' },
  { id: 'primeiro', name: 'Horizonte', category: 'Primeiro emprego', description: 'O teu potencial merece espaço.', colour: '#69578c', detail: 'Retrato circular · Formação em destaque' },
];
/** Fictional demonstration content; never a customer or testimonial. */
export function templateSample(model: Model): CVData {
  const sample: CVData = { ...emptyCV(), model,
    name: 'Celina Macamo', role: 'Gestora de operações', city: 'Maputo, Moçambique',
    email: 'celina@exemplo.com', phone: '+258 84 000 0000', website: 'linkedin.com/in/exemplo',
    profile: 'Profissional de operações com experiência em coordenação de equipas e melhoria de processos. Transformo desafios do dia-a-dia em soluções práticas, com organização, clareza e atenção às pessoas.',
    experiences: [
      { id: 'sample-work-1', title: 'Coordenadora de operações', organisation: 'Organização de exemplo · Maputo', period: '2022 — actual', description: 'Coordenação das actividades administrativas e acompanhamento de fornecedores.\nPreparação de relatórios de gestão e organização dos processos internos.\nApoio à equipa na definição de prioridades e no cumprimento de prazos.' },
      { id: 'sample-work-2', title: 'Assistente administrativa', organisation: 'Empresa de demonstração · Matola', period: '2020 — 2022', description: 'Atendimento a clientes e gestão de documentação.\nAcompanhamento de encomendas e apoio às operações diárias.' },
    ],
    education: [{ id: 'sample-study', title: 'Licenciatura em Gestão', organisation: 'Instituição de exemplo · Maputo', period: '2016 — 2020', description: 'Gestão de projectos e desenvolvimento organizacional.' }],
    skills: 'Gestão de equipas\nPlaneamento operacional\nMicrosoft Excel\nComunicação\nAnálise de processos\nGestão de projectos\nOrganização\nAtendimento ao cliente',
    languages: 'Português · Fluente\nInglês · Intermédio\nChangana · Língua materna',
  };
  if (model === 'criativo') return { ...sample, name: 'Ana Mucavele', email: 'ana@exemplo.com', role: 'Designer de comunicação', profile: 'Crio identidades visuais e conteúdos que aproximam marcas e pessoas. Combino pensamento estratégico, curiosidade e atenção ao detalhe em cada projecto.', skills: 'Identidade visual\nDesign editorial\nFigma e Adobe Illustrator\nDirecção de arte\nComunicação digital', experiences: [
    { ...sample.experiences[0], title: 'Designer de comunicação', description: 'Desenvolvimento de identidades visuais e materiais para campanhas.\nCriação de conteúdos digitais em colaboração com a equipa de comunicação.\nPreparação de peças gráficas para impressão e publicação.' },
    { ...sample.experiences[1], title: 'Assistente de design', description: 'Paginação de materiais editoriais e adaptação de peças para redes sociais.\nOrganização da biblioteca de marca e dos ficheiros de projecto.' },
  ], education: [{ ...sample.education[0], title: 'Licenciatura em Design', description: 'Comunicação visual, tipografia e design editorial.' }] };
  if (model === 'primeiro') return { ...sample, name: 'João Matusse', email: 'joao@exemplo.com', role: 'Recém-licenciado em Informática', profile: 'Recém-licenciado com interesse em desenvolvimento web e apoio tecnológico. Procuro a primeira oportunidade para aplicar os meus conhecimentos, aprender com uma equipa e contribuir com dedicação.', skills: 'HTML, CSS e JavaScript\nResolução de problemas\nTrabalho em equipa\nMicrosoft Office\nOrganização', education: [{ ...sample.education[0], title: 'Licenciatura em Informática', period: '2021 — 2025', description: 'Projecto final: aplicação web para organizar actividades académicas.\nParticipação em trabalhos de programação e bases de dados.' }], experiences: [{ ...sample.experiences[0], title: 'Estágio em apoio informático', period: '2025 · 3 meses', description: 'Apoio na configuração de equipamentos e no atendimento a utilizadores.\nRegisto de pedidos de suporte e elaboração de instruções de utilização.\nColaboração com a equipa em pequenas melhorias no portal interno.' }] };
  if (model === 'executivo') return { ...sample, name: 'Daniel Mondlane', email: 'daniel@exemplo.com', experiences: sample.experiences.map((entry,i) => ({ ...entry, title: i === 0 ? 'Director de operações' : 'Coordenador de operações' })), role: 'Director de operações', profile: 'Liderança de operações com foco em equipas, qualidade e sustentabilidade do negócio. Experiência no planeamento estratégico e na execução de iniciativas que melhoram a organização e o serviço ao cliente.' };
  return sample;
}
