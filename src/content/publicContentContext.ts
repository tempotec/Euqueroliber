import { createContext, useContext, useMemo } from 'react'

import type { ContentData, ContentSectionKey } from '../lib/api'
import { adaptPublishedContent, type PublicAdaptedContent } from './contentAdapters'

/**
 * Estado do conteudo publico consumido pelo site.
 *
 * Vive separado do componente `PublicContentProvider` porque o ESLint exige
 * que arquivos com componente exportem apenas componentes (fast refresh).
 */
export type PublicContentValue = {
  /** De onde veio o conteudo em uso: `static` (.ts) ou `cms` (published_data). */
  source: 'static' | 'cms'
  /** `published_data` cru, indexado por chave. Vazio enquanto carrega. */
  sections: Partial<Record<ContentSectionKey, ContentData>>
}

/** Estado inicial: nenhum conteudo do CMS, tudo cai nos `.ts`. */
export const STATIC_ONLY_CONTENT: PublicContentValue = { source: 'static', sections: {} }

export const PublicContentContext = createContext<PublicContentValue>(STATIC_ONLY_CONTENT)

/** Estado atual do conteudo publico (util para diagnostico). */
export function usePublicContent(): PublicContentValue {
  return useContext(PublicContentContext)
}

/**
 * Conteudo publicado de uma secao, ja convertido nas props do componente real.
 *
 * Retorna `undefined` quando a secao nao veio do CMS, veio vazia ou tem shape
 * inesperado — e o componente cai no conteudo estatico dos `.ts`.
 */
export function usePublishedSection<K extends ContentSectionKey>(
  key: K,
): PublicAdaptedContent[K] | undefined {
  const { sections } = useContext(PublicContentContext)
  const raw = sections[key]

  return useMemo(() => {
    if (!raw) return undefined

    try {
      return adaptPublishedContent(key, raw)
    } catch (error: unknown) {
      console.warn(
        `[CMS] falha ao aplicar conteudo publicado de "${key}"; usando conteudo estatico.`,
        error,
      )
      return undefined
    }
  }, [key, raw])
}
