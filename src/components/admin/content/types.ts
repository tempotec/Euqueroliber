import type { ContentSectionKey } from '../../../lib/api'

/**
 * Tipos do CMS institucional.
 *
 * Os shapes abaixo foram mapeados a partir de `backend/app/data/content_seed.json`.
 * Todas as interfaces possuem index signature (`[key: string]: unknown`) para que
 * campos tecnicos desconhecidos sejam preservados no round-trip do rascunho,
 * mesmo que nao sejam editaveis nesta versao do painel.
 */

export interface ContentImage {
  src: string
  alt?: string
  [key: string]: unknown
}

export interface ContentFormProps<T> {
  value: T
  onChange: (next: T) => void
  disabled?: boolean
}

/* ----------------------------- home ----------------------------- */

export interface HomeHero {
  title: string
  image: string
  subtitle: string
  ctas: Array<{ label: string; [key: string]: unknown }>
  [key: string]: unknown
}

export interface HomeContent {
  brand: string
  hero: HomeHero
  [key: string]: unknown
}

/* --------------------------- quem_somos -------------------------- */

export interface QuemSomosMarco {
  title: string
  description: string
  [key: string]: unknown
}

export interface QuemSomosHistoriaMarco {
  ano: string
  texto: string
  [key: string]: unknown
}

export interface QuemSomosContent {
  title: string
  lead: string
  image: string
  opening: string
  marcos: QuemSomosMarco[]
  historia: {
    nome: string
    nomePublico: string
    destaque: string
    paragrafos: string[]
    marcos: QuemSomosHistoriaMarco[]
    [key: string]: unknown
  }
  atuacao: {
    titulo: string
    paragrafo: string
    temas: string[]
    [key: string]: unknown
  }
  [key: string]: unknown
}

/* --------------------------- solucoes ---------------------------- */

export interface SolucaoSectionBlock {
  heading: string
  intro?: string[]
  items?: string[]
  [key: string]: unknown
}

/**
 * As solucoes do seed NAO compartilham o mesmo shape:
 *  - item[0] possui actingIntro, actions, impactoSocial, problemaSolucao e cta string;
 *  - item[1] possui actingNote como array, socialHeading e NAO possui actingIntro;
 *  - item[2] NAO possui actingNote/actions/impactoSocial e usa sections + cta array.
 * Por isso todos os campos especificos sao opcionais.
 */
export interface SolucaoItem {
  title: string
  subtitle?: string
  description?: string
  icon?: string
  image?: ContentImage
  detailImage?: ContentImage
  intro?: string[]
  actingIntro?: string
  actingNote?: string | string[]
  actions?: string[]
  socialHeading?: string
  impactoSocial?: string[]
  problemaSolucao?: string[]
  sections?: SolucaoSectionBlock[]
  cta?: string | string[]
  [key: string]: unknown
}

export interface SolucoesContent {
  heading: string
  subheading: string
  items: SolucaoItem[]
  [key: string]: unknown
}

/* --------------------------- processo ---------------------------- */

export interface ProcessoContent {
  title: string
  image: string
  steps: string[]
  [key: string]: unknown
}

/* --------------------------- projetos ---------------------------- */

export interface ProjetoItem {
  title: string
  description: string
  image: ContentImage
  [key: string]: unknown
}

export interface ProjetosContent {
  heading: string
  subheading: string
  cta: {
    title: string
    label: string
    [key: string]: unknown
  }
  items: ProjetoItem[]
  [key: string]: unknown
}

/* -------------------------- parceiros ---------------------------- */

export interface ParceiroItem {
  name: string
  logo?: string
  [key: string]: unknown
}

export interface ParceirosContent {
  heading: string
  subheading: string
  items: ParceiroItem[]
  [key: string]: unknown
}

/* --------------------------- contato ----------------------------- */

export interface ContatoContent {
  title: string
  intro: string
  ctaLabel: string
  sendingLabel: string
  successMessage: string
  fields: Record<string, string>
  subjects: string[]
  [key: string]: unknown
}

/* ---------------------------- footer ----------------------------- */

export interface FooterContent {
  message: string
  [key: string]: unknown
}

/* --------------------------- helpers ----------------------------- */

export type ContentSectionData =
  | HomeContent
  | QuemSomosContent
  | SolucoesContent
  | ProcessoContent
  | ProjetosContent
  | ParceirosContent
  | ContatoContent
  | FooterContent

export const CONTENT_SECTION_KEYS: ContentSectionKey[] = [
  'home',
  'quem_somos',
  'solucoes',
  'processo',
  'projetos',
  'parceiros',
  'contato',
  'footer',
]
