import { homeImages } from './homeImages'

export const siteContent = {
  brand: 'Eu Quero Liberdade',
  nav: [
    { label: 'Quem Somos', href: '#quem-somos' },
    { label: 'Solu\u00e7\u00f5es', href: '#solucoes' },
    { label: 'Prop\u00f3sito', href: '#proposito' },
    { label: 'Como Trabalhamos', href: '#como-trabalhamos' },
    { label: 'Projetos e Trajet\u00f3ria', href: '#projetos' },
    { label: 'Impacto', href: '#impacto' },
    { label: 'Diferenciais', href: '#diferenciais' },
    { label: 'Redes e Setores', href: '#parceiros' },
    { label: 'Contato', href: '#contato' },
  ],
  hero: {
    title: 'Transformamos res\u00edduos em dignidade, trabalho e liberdade.',
    image: homeImages.hero.src,
    subtitle:
      'Educa\u00e7\u00e3o ambiental, gest\u00e3o de res\u00edduos, log\u00edstica reversa e inclus\u00e3o socioprodutiva para comunidades, empresas, escolas, eventos e poder p\u00fablico.',
    ctas: [
      { label: 'Conhe\u00e7a nossa hist\u00f3ria', href: '#quem-somos' },
      { label: 'Fale com a gente', href: '#contato' },
    ],
  },
  quemSomos: {
    title: 'Quem Somos',
    lead:
      'A Eu Quero Liberdade nasce da trajet\u00f3ria de Robson Borges, o Robinho Liberdade, lideran\u00e7a social ligada \u00e0 reciclagem, ao cooperativismo e \u00e0 transforma\u00e7\u00e3o territorial.',
    image: homeImages.aboutRobson.src,
    marcos: [
      { title: 'Origem territorial', description: 'Trajet\u00f3ria conectada \u00e0 reciclagem, ao cooperativismo e \u00e0 transforma\u00e7\u00e3o social.' },
      { title: 'Redes cooperativas', description: 'Articula\u00e7\u00e3o com redes e lideran\u00e7as do setor da reciclagem.' },
      {
        title: 'Grandes eventos',
        description: 'Experi\u00eancia relacionada a opera\u00e7\u00f5es ambientais em ambientes de grande circula\u00e7\u00e3o.',
      },
      { title: 'Impacto coletivo', description: 'Fortalecimento de trabalho, renda e inclus\u00e3o produtiva.' },
    ],
  },
  proposito: {
    title: 'Prop\u00f3sito',
    subtitle: 'Transformar passivos em ativos.',
    image: homeImages.purpose.src,
    pares: [
      ['Res\u00edduo descartado', 'Mat\u00e9ria-prima'],
      ['Pessoa exclu\u00edda', 'Trabalhador inclu\u00eddo'],
      ['Territ\u00f3rio vulner\u00e1vel', 'Comunidade educada'],
      ['Descarte irregular', 'Log\u00edstica reversa'],
    ],
  },
  processo: {
    title: 'Como Trabalhamos',
    image: homeImages.process.src,
    steps: [
      'Diagn\u00f3stico',
      'Planejamento',
      'Mobiliza\u00e7\u00e3o',
      'Coleta e triagem',
      'Destina\u00e7\u00e3o legal',
      'Relat\u00f3rio de impacto',
    ],
  },
  diferenciais: {
    title: 'Diferenciais',
    image: homeImages.manifesto.src,
    frases: [
      'N\u00e3o fazemos apenas gest\u00e3o de res\u00edduos. Fazemos gest\u00e3o de oportunidades.',
      'N\u00e3o tratamos apenas do descarte. Tratamos de pessoas, fam\u00edlias e territ\u00f3rios.',
      'A log\u00edstica reversa tamb\u00e9m pode ser humana: retorno \u00e0 cidadania, ao trabalho e ao pertencimento.',
    ],
  },
  parceiros: {
    title: 'Redes e setores de atua\u00e7\u00e3o',
    itens: [
      'Cooperativas e redes territoriais',
      'Empresas com metas socioambientais',
      'Escolas e universidades',
      'Eventos e produtoras culturais',
      'Institui\u00e7\u00f5es p\u00fablicas e agendas territoriais',
    ],
  },
  contato: {
    title: 'Contato',
    subtitle:
      'Transformar passivos em ativos come\u00e7a por uma conversa clara sobre territ\u00f3rio, res\u00edduos e responsabilidade compartilhada.',
    formTitle: 'Quero estruturar uma a\u00e7\u00e3o',
    ctaLabel: 'Entrar em contato',
    image: homeImages.territory.src,
    perfis: [
      {
        value: 'empresa',
        label: 'Empresa',
        support: 'Quer estruturar log\u00edstica reversa, educa\u00e7\u00e3o ambiental e crit\u00e9rios de impacto.',
      },
      {
        value: 'escola',
        label: 'Escola',
        support: 'Busca uma jornada de educa\u00e7\u00e3o ambiental para estudantes, docentes e comunidade escolar.',
      },
      {
        value: 'prefeitura',
        label: 'Prefeitura',
        support: 'Precisa ampliar coleta seletiva, mobiliza\u00e7\u00e3o social e destina\u00e7\u00e3o respons\u00e1vel em escala territorial.',
      },
      {
        value: 'evento',
        label: 'Evento',
        support: 'Quer planejar um evento com triagem, equipe de campo e legado socioambiental.',
      },
      {
        value: 'organizacao-social',
        label: 'Organiza\u00e7\u00e3o social',
        support: 'Quer cocriar projetos com foco em inclus\u00e3o produtiva, pertencimento e protagonismo comunit\u00e1rio.',
      },
      {
        value: 'comunidade-cooperativa',
        label: 'Comunidade ou cooperativa',
        support: 'Busca fortalecimento de rede, capacita\u00e7\u00e3o e conex\u00e3o com oportunidades.',
      },
    ],
  },
  footer: {
    message:
      'Res\u00edduo, processo, transforma\u00e7\u00e3o, impacto e parceria: esse \u00e9 o caminho da Eu Quero Liberdade.',
    rights: `\u00a9 ${new Date().getFullYear()} Eu Quero Liberdade. Prot\u00f3tipo institucional.`,
  },
}
