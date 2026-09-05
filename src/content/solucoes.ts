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
      'Gerenciar resíduos vai além de retirar materiais de um local. O trabalho envolve compreender o que é gerado, como separar, armazenar, movimentar, medir e destinar corretamente.',
      'Estruturamos o fluxo completo do resíduo, do ponto de geração à destinação final ambientalmente adequada, envolvendo pessoas, processos e parceiros da cadeia.',
    ],
    actions: [
      'Diagnóstico dos resíduos e fluxos existentes',
      'Implantação ou aprimoramento de coleta seletiva',
      'Organização de pontos de descarte',
      'Orientação para separação e acondicionamento',
      'Capacitação de equipes',
      'Triagem, classificação e gravimetria',
      'Planejamento logístico',
      'Articulação com cooperativas e recicladores',
      'Logística reversa',
      'Destinação ambientalmente adequada',
      'Acompanhamento de indicadores',
      'Apoio a programas e projetos Lixo Zero',
    ],
    detailImage: homeImages.solutionSorting,
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
