import { homeImages, type InstitutionalImage } from './homeImages'

export type SolutionContent = {
  title: string
  subtitle: string
  description: string
  icon: string
  image: InstitutionalImage
  intro: string[]
  actions: string[]
  detailImage: InstitutionalImage
  actingIntro?: string
  actingNote?: string | string[]
  socialHeading?: string
  impactoSocial?: string[]
  problemHeading?: string
  problemaSolucao?: string[]
  cta?: string
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
    subtitle: 'Do reaproveitamento de materiais à geração de trabalho e renda.',
    description:
      'Reuso, reparo e transformação criativa que conectam circularidade a trabalho, renda e desenvolvimento territorial.',
    icon: 'Users',
    image: homeImages.reserveImpactCooperativeWork,
    intro: [
      'A circularidade deve ser apresentada não apenas como reaproveitamento de materiais, mas também como oportunidade de geração de trabalho, renda, autonomia e desenvolvimento territorial.',
      'Conectamos o ciclo dos materiais às pessoas, fortalecendo cooperativas e empreendedores que transformam resíduos em valor.',
    ],
    actions: [
      'Reuso',
      'Reparo',
      'Reciclagem',
      'Compostagem',
      'Artesanato',
      'Transformação criativa',
      'Reaproveitamento de madeira, plástico, PET, tecidos e outros materiais',
      'Reaproveitamento de óleo vegetal',
      'Oficinas produtivas',
      'Formação de empreendedores e agentes ambientais',
      'Fortalecimento de cooperativas',
      'Logística reversa',
      'Geração de trabalho e renda',
    ],
    detailImage: homeImages.projectCommunityReuse,
  },
]
