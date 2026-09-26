import type { InstitutionalImage } from '../../../content/homeImages'
import { homeImages } from '../../../content/homeImages'
import { resolveAssetPreview } from './assetUrl'
import { parceiros } from '../../../content/parceiros'
import { projetosContent } from '../../../content/projetos'
import { solucoesContent, type SolutionContent } from '../../../content/solucoes'
import type { ParceirosPageContent } from '../../../pages/ParceirosPage'
import type { ProjetosPageContent } from '../../../pages/ProjetosClientesPage'
import type { ContatoSectionContent } from '../../sections/Contato'
import type { HeroSectionContent } from '../../sections/Hero'
import type { ProcessoSectionContent } from '../../sections/ComoTrabalhamos'
import type { ProjetosTimelineContent } from '../../sections/ProjetosTimeline'
import type { QuemSomosSectionContent } from '../../sections/QuemSomos'
import type { SolucoesSectionContent } from '../../sections/Solucoes'
import type { FooterSectionContent } from '../../layout/Footer'
import type {
  ContentImage,
  ContatoContent,
  FooterContent,
  HomeContent,
  ParceirosContent,
  ProcessoContent,
  ProjetosContent,
  QuemSomosContent,
  SolucaoItem,
  SolucoesContent,
} from './types'

/**
 * Adaptadores: draft_data do CMS -> props dos componentes publicos.
 *
 * Regras seguidas aqui (e nao dentro dos componentes visuais):
 *  1. O draft nunca e mutado.
 *  2. Caminhos de imagem sao resolvidos com `resolveAssetPreview` (mesma logica do painel):
 *     o BASE_URL do projeto e aplicado, mas URLs externas (http/https/data:) passam
 *     intactas. O valor ARMAZENADO no CMS nao muda.
 *  3. Quando o CMS nao possui um campo que o componente exibe (ex.: imagem de cabecalho
 *     de Projetos, subtitulo do CTA), o valor estatico e preservado.
 *  4. Nenhum campo e sobrescrito silenciosamente: cada caso tem comentario explicito.
 */

type ImageDraft = string | ContentImage | null | undefined

function readString(source: ContentImage, key: string): string | undefined {
  const value = source[key]
  return typeof value === 'string' ? value : undefined
}

function readLoading(source: ContentImage): InstitutionalImage['loading'] {
  const value = source.loading
  return value === 'lazy' || value === 'eager' ? value : undefined
}

/**
 * Mescla o caminho de imagem do CMS sobre a configuracao estatica.
 *
 * Detalhe importante: se o caminho MUDOU, o `srcSet`/`sizes` estaticos sao descartados.
 * Sem isso o navegador continuaria escolhendo a imagem ANTIGA (o `srcSet` tem prioridade
 * sobre o `src`), e o preview mentiria. Se o caminho esta igual, tudo e preservado.
 */
function applyDraftImage(base: InstitutionalImage, draft: ImageDraft): InstitutionalImage {
  if (!draft) {
    return base
  }

  const rawSrc = typeof draft === 'string' ? draft : draft.src

  if (!rawSrc) {
    return base
  }

  const resolvedSrc = resolveAssetPreview(rawSrc)
  const isUnchanged = resolvedSrc === base.src

  if (typeof draft === 'string') {
    return {
      ...base,
      src: resolvedSrc,
      ...(isUnchanged ? {} : { srcSet: undefined, sizes: undefined }),
    }
  }

  return {
    ...base,
    alt: readString(draft, 'alt') ?? base.alt,
    objectPosition: readString(draft, 'objectPosition') ?? base.objectPosition,
    aspect: readString(draft, 'aspect') ?? base.aspect,
    badge: readString(draft, 'badge') ?? base.badge,
    loading: readLoading(draft) ?? base.loading,
    src: resolvedSrc,
    ...(isUnchanged ? {} : { srcSet: undefined, sizes: undefined }),
  }
}

/**
 * Constroi uma imagem completa a partir do draft, sem base estatica correspondente.
 * Usado quando o administrador ADICIONA um item que ainda nao existe no site.
 * `role`/`status` recebem defaults explicitos — sao metadados de acervo, nao conteudo.
 */
function buildImageFromDraft(draft: ContentImage, section: string): InstitutionalImage {
  return {
    src: resolveAssetPreview(draft.src),
    alt: readString(draft, 'alt') ?? '',
    section,
    role: 'impacto',
    status: 'provisoria',
    objectPosition: readString(draft, 'objectPosition'),
    aspect: readString(draft, 'aspect'),
    badge: readString(draft, 'badge'),
    loading: readLoading(draft),
  }
}

/* ------------------------------------------------------------------ home */

export function toHeroContent(draft: HomeContent): HeroSectionContent {
  return {
    brand: draft.brand,
    title: draft.hero.title,
    subtitle: draft.hero.subtitle,
    image: applyDraftImage(homeImages.hero, draft.hero.image),
    ctaLabels: (draft.hero.ctas ?? []).map((cta) => cta.label),
  }
}

/* ------------------------------------------------------------ quem_somos */

export function toQuemSomosContent(draft: QuemSomosContent): QuemSomosSectionContent {
  return {
    title: draft.title,
    opening: draft.opening,
    image: applyDraftImage(homeImages.aboutRobson, draft.image),
    historia: draft.historia,
    atuacao: draft.atuacao,
  }
}

/* -------------------------------------------------------------- solucoes */

/**
 * As 3 solucoes tem shapes diferentes. Fazemos merge com o item estatico de MESMO indice
 * apenas para preencher o que o CMS nao guarda (ex.: `problemHeading`, metadados de acervo
 * da imagem). Os itens do draft NAO sao normalizados entre si.
 */
/**
 * As 3 solucoes tem shapes diferentes. Fazemos merge com o item estatico de MESMO indice
 * apenas para preencher o que o CMS nao guarda (ex.: `problemHeading`, metadados de acervo
 * da imagem). Os itens do draft NAO sao normalizados entre si.
 *
 * Retorna `null` quando nao ha imagem alguma (nem no CMS, nem no site): a imagem e
 * obrigatoria no card, entao o item e omitido em vez de renderizar algo quebrado.
 */
function toSolutionItem(draft: SolucaoItem, base?: SolutionContent): SolutionContent | null {
  const draftImage = draft.image
  const baseImage = base?.image
  let image: InstitutionalImage

  if (draftImage) {
    image = baseImage
      ? applyDraftImage(baseImage, draftImage)
      : buildImageFromDraft(draftImage, 'solucoes')
  } else if (baseImage) {
    image = baseImage
  } else {
    return null
  }

  const draftDetailImage = draft.detailImage
  let detailImage: InstitutionalImage = base?.detailImage ?? image

  if (draftDetailImage) {
    detailImage = base?.detailImage
      ? applyDraftImage(base.detailImage, draftDetailImage)
      : buildImageFromDraft(draftDetailImage, 'solucoes')
  }

  return {
    ...(base ?? {}),
    title: draft.title,
    subtitle: draft.subtitle ?? base?.subtitle ?? '',
    description: draft.description ?? base?.description ?? '',
    icon: draft.icon ?? base?.icon ?? 'Recycle',
    intro: draft.intro ?? base?.intro ?? [],
    image,
    detailImage,
    ...(draft.actions !== undefined ? { actions: draft.actions } : {}),
    ...(draft.actingIntro !== undefined ? { actingIntro: draft.actingIntro } : {}),
    ...(draft.actingNote !== undefined ? { actingNote: draft.actingNote } : {}),
    ...(draft.socialHeading !== undefined ? { socialHeading: draft.socialHeading } : {}),
    ...(draft.impactoSocial !== undefined ? { impactoSocial: draft.impactoSocial } : {}),
    ...(draft.problemaSolucao !== undefined ? { problemaSolucao: draft.problemaSolucao } : {}),
    ...(draft.sections !== undefined ? { sections: draft.sections } : {}),
    ...(draft.cta !== undefined ? { cta: draft.cta } : {}),
  }
}

export function toSolucoesContent(draft: SolucoesContent): SolucoesSectionContent {
  const items = (draft.items ?? [])
    .map((item, index) => toSolutionItem(item, solucoesContent[index]))
    .filter((item): item is SolutionContent => item !== null)

  return {
    heading: draft.heading,
    subheading: draft.subheading,
    items,
  }
}

/* --------------------------------------------------------------- processo */

export function toProcessoContent(draft: ProcessoContent): ProcessoSectionContent {
  return {
    title: draft.title,
    image: applyDraftImage(homeImages.process, draft.image),
    steps: draft.steps,
  }
}

/* --------------------------------------------------------------- projetos */

export function toProjetosPageContent(draft: ProjetosContent): ProjetosPageContent {
  const timeline: ProjetosTimelineContent = {
    items: (draft.items ?? []).map((item, index) => {
      const baseItem = projetosContent[index]

      if (!baseItem) {
        return {
          title: item.title,
          description: item.description,
          image: buildImageFromDraft(item.image, 'projetos'),
        }
      }

      return {
        ...baseItem,
        title: item.title,
        description: item.description,
        image: applyDraftImage(baseItem.image, item.image),
      }
    }),
  }

  return {
    heading: draft.heading,
    subheading: draft.subheading,
    ctaTitle: draft.cta.title,
    ctaLabel: draft.cta.label,
    timeline,
    // O CMS de `projetos` nao possui imagem de cabecalho: mantem a estatica.
    headerImage: homeImages.impact,
  }
}

/* -------------------------------------------------------------- parceiros */

export function toParceirosPageContent(draft: ParceirosContent): ParceirosPageContent {
  return {
    heading: draft.heading,
    subheading: draft.subheading,
    items: (draft.items ?? []).map((item, index) => ({
      ...(parceiros[index] ?? {}),
      name: item.name,
      // O CMS guarda o caminho cru; o site guarda ja resolvido. Resolvemos aqui.
      logo: item.logo ? resolveAssetPreview(item.logo) : parceiros[index]?.logo,
    })),
  }
}

/* ---------------------------------------------------------------- contato */

export function toContatoContent(draft: ContatoContent): ContatoSectionContent {
  return {
    title: draft.title,
    intro: draft.intro,
    ctaLabel: draft.ctaLabel,
    sendingLabel: draft.sendingLabel,
    successMessage: draft.successMessage,
    subjects: draft.subjects,
  }
}

/* ----------------------------------------------------------------- footer */

export function toFooterContent(draft: FooterContent): FooterSectionContent {
  // Apenas `message`. Copyright/ano continuam dinamicos a partir de site.ts.
  return { message: draft.message }
}
