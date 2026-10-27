import type { LegacyModel } from './cv.ts';
export type Profession = {
  slug:string;name:string;title:string;description:string;h1:string;intro:string;
  model:LegacyModel;modelName:string;area:string;audience:string;
  advice:{title:string;body:string}[];profile:string;activity:string;
  skills:string[];questions:{q:string;a:string}[];
};
export const professions:readonly Profession[]=[
  {
    slug:'motorista',name:'Motorista',title:'Modelo de CV para Motorista em Moçambique | CVMais',
    description:'Prepara um CV para motorista com exemplos de perfil, experiência e competências. Escolhe um modelo gratuito e descarrega o PDF no CVMais.',
    h1:'Modelo de CV para Motorista em Moçambique',
    intro:'Um CV para motorista deve ajudar a empresa a perceber que tipo de condução conheces e como organizas o teu trabalho. Explica, quando for verdade, as rotas que realizaste, o cuidado com a viatura, a documentação de transporte e o contacto com clientes. Se ainda procuras a primeira oportunidade, destaca a formação e as actividades que consegues demonstrar.',
    model:'classico',modelName:'Maputo · Clássico',area:'logistica',audience:'Transporte de passageiros, distribuição, entregas e apoio logístico',
    advice:[
      {title:'Indica a carta de condução correcta',body:'Inclui apenas a categoria que tens efectivamente válida. Se a vaga exigir transporte de passageiros ou mercadorias, confirma os requisitos do anúncio. Nunca apresentes uma autorização ou formação que ainda não possuis.'},
      {title:'Explica que percursos realizaste',body:'Descreve entregas urbanas, viagens entre distritos, controlo de guias ou registo de quilometragem, conforme a tua experiência. Indica tarefas concretas em vez de uma lista genérica de qualidades.'},
      {title:'Mostra organização e segurança',body:'Quando se aplicar, menciona verificações antes da partida, comunicação de avarias, respeito pelos procedimentos de segurança e entrega de documentação. Mantém as descrições curtas e verificáveis.'}
    ],
    profile:'Motorista com experiência em entregas urbanas e organização de percursos. Verifico a documentação das entregas e comunico necessidades de manutenção à equipa. Procuro contribuir para um serviço pontual e seguro.',
    activity:'Motorista de distribuição · Empresa fictícia\nRealização de entregas em percursos definidos pela equipa, confirmação das guias e comunicação de ocorrências. Verificação básica da viatura antes das saídas.',
    skills:['Organização de rotas','Conferência de guias','Comunicação com clientes','Verificação básica da viatura'],
    questions:[
      {q:'Devo colocar a categoria da carta no CV?',a:'Sim, se for relevante e estiver válida. Não publiques números de documentos pessoais desnecessários.'},
      {q:'E se ainda não tenho experiência?',a:'Descreve formação, actividades supervisionadas ou tarefas reais. Não transformes uma actividade informal em emprego fictício.'}
    ]
  },
  {
    slug:'vendedor',name:'Vendedor',title:'Modelo de CV para Vendedor e Atendimento | CVMais',
    description:'Cria um CV de vendedor em Moçambique. Vê exemplos de atendimento, caixa e organização de loja e descarrega um modelo gratuito em PDF.',
    h1:'Modelo de CV para Vendedor e Atendimento',
    intro:'Para uma vaga de vendas, o recrutador precisa de perceber como atendes pessoas, apresentas produtos e acompanhas pedidos. Mostra experiências concretas, mesmo que tenham acontecido num pequeno negócio familiar ou numa actividade temporária. Distingue sempre o tipo de colaboração: emprego, estágio, apoio familiar ou voluntariado.',
    model:'servico',modelName:'Acolher · Serviços',area:'vendas',audience:'Lojas, balcões de atendimento, promotores e equipas comerciais',
    advice:[
      {title:'Descreve situações de atendimento',body:'Explica como recebias clientes, esclarecias dúvidas, organizavas pedidos ou encaminhavas reclamações. Se trabalhavas com diferentes produtos, identifica os que conheces sem exagerar a especialização.'},
      {title:'Inclui tarefas de loja e caixa reais',body:'Reposição, inventário, etiquetagem e registo de pagamentos podem ser úteis quando fizeram parte do teu trabalho. Não acrescentes a operação de caixa se nunca a realizaste.'},
      {title:'Usa resultados só quando os conheces',body:'Uma frase como «apoiei o fecho diário e a contagem de stock» pode ser mais credível do que uma percentagem de vendas inventada. Se tens números confirmados, indica o período.'}
    ],
    profile:'Profissional de atendimento com experiência na organização de produtos e apoio a clientes no ponto de venda. Tenho prática em esclarecer pedidos e trabalhar com a equipa em dias de maior movimento.',
    activity:'Assistente de loja · Estabelecimento fictício\nAtendimento a clientes, reposição de produtos e verificação de etiquetas. Apoio à organização do stock e encaminhamento de pedidos.',
    skills:['Atendimento ao cliente','Organização de produtos','Reposição e inventário','Comunicação em equipa'],
    questions:[
      {q:'Como apresentar vendas num negócio familiar?',a:'Identifica o apoio ao negócio familiar como tal e explica as tarefas executadas, sem fingir um contrato de trabalho formal.'},
      {q:'Basta escrever que sou comunicativo?',a:'É mais claro relacionar essa qualidade com uma tarefa, como esclarecer dúvidas ou acompanhar pedidos.'}
    ]
  },
  {
    slug:'estudante',name:'Estudante',title:'Modelo de CV para Estudante Sem Experiência | CVMais',
    description:'Faz o teu primeiro CV como estudante em Moçambique. Mostra formação, projectos e actividades reais num currículo gratuito em PDF.',
    h1:'Modelo de CV para Estudante Sem Experiência',
    intro:'Se estás a estudar e ainda não trabalhaste formalmente, podes criar um CV claro sem inventar experiência. A formação, os projectos escolares, as actividades comunitárias e as competências demonstráveis ajudam a apresentar o teu percurso. Escolhe um modelo que dê prioridade ao que já sabes fazer e à oportunidade a que te candidatas.',
    model:'primeiro',modelName:'Horizonte · Primeiro emprego',area:'educacao',audience:'Primeiro emprego, estágio, trabalho de férias e recém-formados',
    advice:[
      {title:'Começa pela formação real',body:'Indica o nível concluído ou em curso, o estabelecimento de ensino e os períodos correctos. Se ainda não terminaste um curso, escreve «em curso» e evita apresentar uma qualificação como concluída.'},
      {title:'Transforma projectos em exemplos',body:'Um trabalho escolar, uma apresentação em grupo ou voluntariado pode mostrar organização, escrita e colaboração. Explica a tua contribuição e identifica a actividade pelo que realmente foi.'},
      {title:'Escolhe competências demonstráveis',body:'Indica programas que utilizas, línguas que falas e tarefas que já realizaste. Não precisas de preencher todas as secções: campos vazios não entram no PDF do CVMais.'}
    ],
    profile:'Estudante do ensino secundário à procura de uma primeira oportunidade de aprendizagem em apoio administrativo. Tenho experiência em projectos escolares com organização de documentos e apresentação de resultados em grupo.',
    activity:'Projecto escolar · Exemplo fictício\nOrganização das tarefas do grupo, preparação de uma apresentação e consolidação da informação recolhida para o trabalho final.',
    skills:['Organização de tarefas','Documentos e apresentações','Trabalho em equipa','Competências digitais básicas'],
    questions:[
      {q:'Posso fazer CV sem experiência?',a:'Sim. Destaca a formação, projectos e actividades verdadeiras. Evita inventar cargos ou datas.'},
      {q:'Preciso de fotografia?',a:'Não é obrigatória em todas as candidaturas. Segue o anúncio e inclui apenas dados pessoais necessários.'}
    ]
  },
  {
    slug:'administrativo',name:'Assistente administrativo',title:'Modelo de CV para Assistente Administrativo | CVMais',
    description:'Organiza um CV administrativo com exemplos de arquivo, agenda, atendimento e ferramentas de escritório. Cria e descarrega o PDF grátis.',
    h1:'Modelo de CV para Assistente Administrativo',
    intro:'Um currículo administrativo beneficia de uma estrutura organizada, datas claras e exemplos de tarefas realizadas. A empresa precisa de compreender como lidas com documentos, informação, prazos e comunicação entre equipas. Se trabalhaste numa recepção, escola ou pequena empresa, mostra actividades relacionadas com a função sem alterar o teu cargo verdadeiro.',
    model:'classico',modelName:'Maputo · Clássico',area:'administracao',audience:'Apoio administrativo, recepção, secretariado e gestão documental',
    advice:[
      {title:'Destaca rotinas de escritório',body:'Descreve organização de arquivos, preparação de listas, acompanhamento de pedidos ou marcação de reuniões se essas tarefas fizeram parte do teu trabalho. Explica que documentos utilizavas.'},
      {title:'Indica ferramentas com o nível real',body:'Podes listar Word, folhas de cálculo, email e plataformas internas se os utilizaste. Em vez de «Excel avançado» sem fundamento, descreve tarefas como actualizar tabelas e organizar ficheiros.'},
      {title:'Mostra atenção aos prazos',body:'Uma descrição da preparação de documentos ou acompanhamento de solicitações é melhor do que adjectivos soltos. Não reveles nomes de clientes nem informação interna confidencial.'}
    ],
    profile:'Assistente administrativa com prática em organização de arquivos, preparação de documentos e apoio ao atendimento. Procuro contribuir para rotinas de escritório claras, com atenção aos prazos e à comunicação.',
    activity:'Apoio administrativo · Organização fictícia\nRegisto de pedidos, actualização de listas de contacto e organização de documentos por assunto e data. Apoio na preparação de reuniões.',
    skills:['Arquivo e organização documental','Word e folhas de cálculo','Gestão de agenda','Comunicação e atendimento'],
    questions:[
      {q:'Como apresentar conhecimentos de Excel?',a:'Diz exactamente o que consegues fazer: tabelas simples, filtros ou fórmulas, conforme a experiência real.'},
      {q:'Devo partilhar informação interna da empresa?',a:'Não. Descreve responsabilidades em termos gerais e preserva dados confidenciais.'}
    ]
  },
  {
    slug:'enfermeiro',name:'Enfermeiro',title:'Modelo de CV para Enfermeiro em Moçambique | CVMais',
    description:'Organiza um currículo de enfermagem com formação, estágios e cuidados prestados. Adapta um modelo de CV gratuito e descarrega em PDF.',
    h1:'Modelo de CV para Enfermeiro em Moçambique',
    intro:'Um CV de enfermagem deve apresentar formação, experiência clínica e competências de comunicação de forma rigorosa. Para uma candidatura, distingue estágio supervisionado de experiência profissional e informa apenas qualificações e autorizações que realmente possuis. Não reveles casos clínicos nem dados pessoais de utentes.',
    model:'saude',modelName:'Vital · Saúde e educação',area:'saude',audience:'Candidaturas de enfermagem, estágio clínico e serviços de saúde',
    advice:[
      {title:'Identifica formação e situação profissional',body:'Indica o curso concluído ou em curso, a instituição e o período. Se a vaga exigir inscrição ou autorização profissional, confirma os requisitos e apresenta apenas documentos válidos.'},
      {title:'Distingue estágio e trabalho independente',body:'Regista o estágio com a designação correcta e menciona supervisão quando aplicável. Descreve tarefas que realizaste, como apoio ao acolhimento ou organização de material.'},
      {title:'Apresenta competências sem expor utentes',body:'Comunicação, organização, higiene e trabalho em equipa podem ser relevantes quando demonstráveis. Nunca incluas nomes, fotografias, diagnósticos ou detalhes identificáveis de utentes.'}
    ],
    profile:'Profissional de enfermagem com formação na área e experiência em acolhimento e registo de cuidados. Valorizo a comunicação com utentes, o trabalho em equipa e o cumprimento dos procedimentos da unidade.',
    activity:'Estágio de enfermagem · Unidade fictícia\nApoio ao acolhimento e preparação de materiais sob supervisão. Organização de registos conforme os procedimentos da equipa.',
    skills:['Comunicação com utentes','Organização de registos','Trabalho em equipa','Confidencialidade e procedimentos'],
    questions:[
      {q:'Posso colocar estágio no CV?',a:'Sim. Usa a palavra «estágio», indica a instituição e as tarefas supervisionadas que realizaste.'},
      {q:'Como apresentar qualificações profissionais?',a:'Inclui apenas cursos, inscrições e autorizações que possuis, conforme o anúncio.'}
    ]
  }
];
export const professionSlugs=professions.map(p=>p.slug);
export function professionBySlug(slug:string){return professions.find(p=>p.slug===slug);}
export function professionUrl(slug:string){return '/modelos/para/'+slug;}
