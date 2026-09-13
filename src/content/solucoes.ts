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
  actingNote?: string
  impactoSocial?: string[]
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
      'Educação ambiental não deve ser apresentada como uma palestra isolada, mas como processo de sensibilização, aprendizagem e mudança de comportamento.',
      'Atuamos para que o conhecimento vire prática cotidiana, formando pessoas capazes de agir e multiplicar o cuidado com o meio ambiente.',
    ],
    actions: [
      'Palestras',
      'Oficinas',
      'Rodas de conversa',
      'Formação de crianças, jovens, educadores, trabalhadores e lideranças',
      'Capacitação de equipes operacionais',
      'Formação de multiplicadores e agentes ambientais',
      'Campanhas de mobilização',
      'Coleta seletiva',
      'Logística reversa',
      'Iniciativas Lixo Zero',
      'Vivências como compostagem, hortas, jardinagem, mutirões e transformação criativa de materiais',
    ],
    detailImage: homeImages.projectEducationWorkshop,
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
