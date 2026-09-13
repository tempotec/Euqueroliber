import { homeImages, type InstitutionalImage } from './homeImages'

export type SolutionSection = {
  heading: string
  intro?: string | string[]
  items?: string[]
  paragraphs?: string[]
}

export type SolutionContent = {
  title: string
  subtitle: string
  description: string
  icon: string
  image: InstitutionalImage
  intro: string[]
  actions?: string[]
  detailImage: InstitutionalImage
  actingIntro?: string
  actingNote?: string | string[]
  socialHeading?: string
  impactoSocial?: string[]
  problemHeading?: string
  problemaSolucao?: string[]
  cta?: string | string[]
  sections?: SolutionSection[]
}

export const solucoesContent: SolutionContent[] = [
  {
    title: 'Gestão de Resíduos',
    subtitle: 'Do resíduo descartado ao recurso corretamente destinado.',
    description:
      'Diagnóstico, coleta seletiva, logística e destinação adequada para transformar resíduos em recursos bem encaminhados.',
    icon: 'Recycle',
    image: homeImages.solutionCollection,
    intro: [
      'Gerenciar resíduos é muito mais do que retirar materiais de um lugar. É compreender o que está sendo gerado, como separar, armazenar, movimentar, medir e destinar corretamente, criando um fluxo ambientalmente responsável e socialmente justo.',
      'Nossa atuação foi construída ao longo de anos de experiência prática com coleta seletiva, triagem, reciclagem, cooperativismo, logística, gravimetria, formação de equipes e articulação com diferentes atores da cadeia de resíduos.',
      'Essa vivência permite olhar para cada operação de forma integrada: do comportamento de quem gera o resíduo até sua chegada à cooperativa, recicladora ou solução adequada de tratamento.',
    ],
    actingIntro:
      'Desenvolvemos soluções de acordo com a realidade de empresas, escolas, comunidades, condomínios, organizações, eventos e instituições públicas, incluindo:',
    actions: [
      'diagnóstico dos resíduos e dos fluxos existentes',
      'implantação e aprimoramento da coleta seletiva',
      'definição e organização de pontos de descarte',
      'orientação para separação e acondicionamento',
      'capacitação de equipes',
      'triagem, classificação e gravimetria',
      'planejamento logístico',
      'articulação com cooperativas e recicladores',
      'logística reversa',
      'destinação ambientalmente adequada',
      'acompanhamento de indicadores e resultados',
      'apoio a programas e projetos Lixo Zero',
    ],
    actingNote:
      'Sempre que possível, priorizamos a conexão com cooperativas e cadeias produtivas capazes de devolver os materiais ao ciclo econômico, contribuindo simultaneamente para reduzir impactos ambientais e fortalecer trabalho e renda.',
    detailImage: homeImages.solutionSorting,
    impactoSocial: [
      'Nosso diferencial está em compreender que existe uma cadeia humana por trás de cada material recuperado.',
      'Papel, plástico, metal, vidro, óleo, resíduos orgânicos e outros materiais não precisam encerrar sua trajetória no descarte. Quando existe planejamento, educação e articulação, eles podem voltar à produção, alimentar novos processos e fortalecer trabalhadores, cooperativas e territórios.',
      'Por isso, não tratamos gestão de resíduos como uma operação isolada. Integramos educação ambiental, organização operacional, economia circular, cooperativismo e inclusão socioprodutiva.',
      'Uma gestão eficiente precisa produzir resultados que possam ser percebidos e acompanhados: redução do descarte inadequado, aumento da recuperação de materiais, participação das pessoas, fortalecimento da cadeia da reciclagem e melhoria das condições ambientais do território.',
    ],
    problemaSolucao: [
      'Empresas e instituições podem ser grandes aliadas dessa transformação. Comunidades e cooperativas também.',
      'Nosso papel é construir as conexões necessárias para que responsabilidade ambiental se transforme em ação concreta, resultado e impacto positivo compartilhado.',
    ],
    cta: 'Precisa estruturar ou melhorar a gestão de resíduos da sua organização, território ou projeto? Vamos construir uma solução adequada à sua realidade.',
  },
  {
    title: 'Educação Ambiental',
    subtitle: 'Conhecimento que se transforma em atitude, cuidado e participação.',
    description:
      'Sensibilização, aprendizagem e mudança de comportamento para engajar pessoas e equipes na causa ambiental.',
    icon: 'Leaf',
    image: homeImages.solutionEducation,
    intro: [
      'Educação ambiental, para nós, não é uma ação isolada nem uma palestra que termina quando o encontro acaba. É um processo de sensibilização, aprendizagem e mudança de comportamento, capaz de aproximar pessoas dos desafios do seu território e transformá-las em parte da solução.',
      'Nossa metodologia nasce da experiência prática com reciclagem, cooperativismo, mobilização comunitária, formação de equipes e gestão de resíduos. Por isso, conectamos informação à realidade: mostramos de onde vêm os resíduos, para onde vão, quem trabalha nessa cadeia e como escolhas aparentemente simples podem gerar impactos ambientais, sociais e econômicos.',
      'Desenvolvemos ações para escolas, empresas, comunidades, cooperativas, instituições, órgãos públicos e eventos, adaptando linguagem, metodologia e atividades a cada público.',
    ],
    actions: [
      'Palestras, oficinas e rodas de conversa, com linguagem acessível e conteúdos conectados ao cotidiano.',
      'Formação de crianças, adolescentes, jovens, educadores, trabalhadores e lideranças, fortalecendo consciência ambiental e cidadania.',
      'Capacitação de equipes operacionais, contribuindo para que a separação dos resíduos aconteça corretamente na prática.',
      'Formação de multiplicadores e agentes ambientais, para que o conhecimento continue circulando depois das atividades.',
      'Campanhas de mobilização e sensibilização, apoiando programas de coleta seletiva, logística reversa e iniciativas Lixo Zero.',
      'Vivências práticas, como compostagem, hortas, jardinagem, mutirões, atividades na natureza e transformação criativa de materiais.',
    ],
    actingNote: [
      'Mais do que ensinar onde colocar cada resíduo, buscamos desenvolver uma nova percepção: aquilo que muitas vezes é tratado como lixo pode ser matéria-prima, trabalho, renda, aprendizagem e oportunidade.',
      'Quando uma criança compreende o valor do território, uma empresa melhora seus processos, uma comunidade começa a separar seus resíduos ou uma cooperativa é reconhecida como parte da solução, a educação ambiental deixa de ser discurso e passa a produzir transformação.',
    ],
    detailImage: homeImages.projectEducationWorkshop,
    socialHeading: 'Educação que conecta pessoas, território e futuro',
    impactoSocial: [
      'Nossa experiência demonstra que equipamentos e lixeiras, sozinhos, não constroem uma cultura sustentável. A transformação acontece quando as pessoas compreendem por que mudar, como participar e quem é beneficiado por essa mudança.',
      'É essa consciência que buscamos construir.',
    ],
    cta: 'Quer desenvolver uma ação de educação ambiental em sua escola, empresa, comunidade ou instituição? Vamos construir essa transformação juntos.',
  },
  {
    title: 'Inclusão Produtiva e Economia Circular',
    subtitle: 'Onde alguns enxergam descarte, nós enxergamos matéria-prima, criatividade e oportunidade.',
    description:
      'Reuso, reparo e transformação criativa que conectam circularidade a trabalho, renda e desenvolvimento territorial.',
    icon: 'Users',
    image: homeImages.reserveImpactCooperativeWork,
    intro: [
      'A economia circular propõe uma mudança simples e profunda: substituir a lógica de extrair, consumir e descartar por sistemas capazes de reduzir desperdícios, reaproveitar materiais e prolongar sua permanência nos ciclos produtivos.',
      'Nossa experiência com reciclagem, cooperativismo e desenvolvimento territorial acrescenta uma dimensão essencial a esse conceito: a circularidade dos materiais também pode movimentar pessoas, conhecimento, trabalho e renda.',
      'Por isso, articulamos economia circular e criatividade para transformar resíduos em novos recursos e aproximar empresas, comunidades, cooperativas, artesãos, empreendedores, educadores e organizações.',
    ],
    sections: [
      {
        heading: 'Da matéria-prima à oportunidade',
        intro: [
          'Materiais que perderam sua função original podem assumir novos significados por meio do reuso, reparo, reciclagem, compostagem, artesanato e transformação criativa.',
          'Essa lógica pode gerar:',
        ],
        items: [
          'produtos e peças produzidos a partir de materiais reaproveitados;',
          'artesanato e design sustentável;',
          'transformação de madeira, plástico, PET, tecidos e outros resíduos;',
          'reaproveitamento de óleo vegetal em novos produtos;',
          'compostagem e utilização do composto em hortas e cultivos;',
          'oficinas de produção e aprendizagem;',
          'formação de empreendedores e agentes ambientais;',
          'fortalecimento de cooperativas e iniciativas locais;',
          'logística reversa conectada a cadeias produtivas;',
          'geração de trabalho e renda a partir de materiais recuperados.',
        ],
      },
      {
        heading: 'Circularidade que inclui pessoas',
        paragraphs: [
          'Nossa proposta não termina quando um resíduo volta para a indústria.',
          'Buscamos construir ciclos em que o valor econômico do material permaneça também nos territórios e alcance quem participa da transformação.',
          'Isso significa aproximar quem gera o resíduo de quem pode recuperá-lo, transformá-lo ou utilizá-lo como matéria-prima. Significa ainda criar oportunidades para cooperativas, artesãos, empreendedores comunitários, jovens e pessoas que encontram no trabalho uma possibilidade concreta de autonomia.',
          'A experiência acumulada no cooperativismo nos ensinou que uma cadeia circular se fortalece quando diferentes atores deixam de trabalhar isoladamente e passam a cooperar.',
        ],
      },
      {
        heading: 'Criatividade também é tecnologia social',
        paragraphs: [
          'Transformar uma garrafa, uma madeira descartada, uma peça de tecido, óleo usado ou matéria orgânica é importante. Mas o impacto se amplia quando essa transformação gera conhecimento, pertencimento, capacidades produtivas e novas possibilidades econômicas.',
          'Por isso, nossas iniciativas podem integrar oficinas, espaços de experimentação, formação, produção artesanal, compostagem, agricultura urbana, reciclagem criativa e articulação comercial.',
          'Queremos ajudar a construir territórios onde materiais circulem por mais tempo, recursos sejam utilizados com inteligência e mais pessoas possam participar da economia verde.',
        ],
      },
      {
        heading: 'Empresas, organizações e pessoas podem fazer parte desse ciclo',
        paragraphs: [
          'Uma empresa pode destinar materiais. Uma escola pode formar multiplicadores. Uma cooperativa pode realizar triagem e beneficiamento. Um artesão pode transformar. Um território pode produzir. Um parceiro pode financiar, contratar, doar conhecimento, equipamentos ou infraestrutura.',
          'Economia circular acontece quando essas pontas se encontram.',
        ],
      },
    ],
    detailImage: homeImages.projectCommunityReuse,
    cta: [
      'Se você representa uma empresa, organização, poder público, cooperativa, instituição de ensino ou iniciativa social, existe espaço para construir essa transformação conosco.',
      'Vamos transformar resíduos em recursos, criatividade em oportunidade e cooperação em impacto.',
    ],
  },
]
