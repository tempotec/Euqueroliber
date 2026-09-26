import { homeImages } from './homeImages'

export const siteContent = {
  brand: 'Eu Quero Liberdade',

  hero: {
    title: 'Transformamos res\u00edduos em dignidade, trabalho e liberdade.',
    image: homeImages.hero.src,
    subtitle:
      'Educa\u00e7\u00e3o ambiental, gest\u00e3o de res\u00edduos, log\u00edstica reversa e inclus\u00e3o socioprodutiva para comunidades, empresas, escolas, eventos e poder p\u00fablico.',
    ctas: [
      { label: 'Conhe\u00e7a nossa hist\u00f3ria' },
      { label: 'Fale com a gente' },
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
  contato: {
    title: 'Contato',
    ctaLabel: 'Entrar em contato',
  },
  footer: {
    message:
      'Res\u00edduo, processo, transforma\u00e7\u00e3o, impacto e parceria: esse \u00e9 o caminho da Eu Quero Liberdade.',
    rights: `\u00a9 ${new Date().getFullYear()} Eu Quero Liberdade.`,
  },
}
