import { homeImages } from './homeImages'

export const impactoContent = {
  title: 'Impacto',
  intro:
    'A transformação ambiental ganha força quando também gera inclusão, trabalho, participação e desenvolvimento nos territórios.',
  image: homeImages.impact,
  pilares: [
    {
      title: 'Impacto Ambiental',
      description:
        'Cuidar dos resíduos é cuidar do território, da água, do solo e das pessoas que nele vivem.',
      image: homeImages.manifesto,
      items: [
        'Redução do descarte inadequado',
        'Recuperação e valorização de materiais',
        'Coleta seletiva e logística reversa',
        'Destinação ambientalmente adequada',
        'Educação ambiental e responsabilidade compartilhada',
      ],
    },
    {
      title: 'Impacto Social',
      description:
        'A reciclagem só se sustenta quando reconhece e valoriza quem move a cadeia.',
      image: homeImages.reserveImpactCooperativeWork,
      items: [
        'Inclusão produtiva e geração de trabalho e renda',
        'Fortalecimento de cooperativas',
        'Valorização de catadores e catadoras',
        'Formação, autonomia e cooperação',
        'Criação de oportunidades',
      ],
    },
    {
      title: 'Impacto Territorial',
      description:
        'Soluções construídas com base na realidade de cada território têm mais chance de durar.',
      image: homeImages.territory,
      items: [
        'Fortalecimento comunitário',
        'Articulação de redes e organizações',
        'Desenvolvimento territorial',
        'Participação local',
        'Aproximação entre empresas, comunidades, cooperativas e poder público',
      ],
    },
  ],
  conexao: {
    title: 'Impactos que se conectam',
    description:
      'Gestão de resíduos, educação, trabalho, renda e desenvolvimento territorial fazem parte do mesmo ciclo. Não são áreas isoladas: cada avanço ambiental abre espaço para inclusão, e cada conquista social fortalece o território.',
  },
} as const
