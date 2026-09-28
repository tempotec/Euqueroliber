import { useEffect, useState, type ReactNode } from 'react'

import {
  getPublicContentSections,
  publicApiBaseUrl,
  type ContentData,
  type ContentSectionKey,
} from '../lib/api'
import {
  PublicContentContext,
  STATIC_ONLY_CONTENT,
  type PublicContentValue,
} from './publicContentContext'

/** Chaves institucionais expostas publicamente. */
const PUBLIC_SECTION_KEYS = [
  'home',
  'quem_somos',
  'solucoes',
  'processo',
  'projetos',
  'parceiros',
  'contato',
  'footer',
] as const satisfies readonly ContentSectionKey[]

function isContentSectionKey(value: string): value is ContentSectionKey {
  return (PUBLIC_SECTION_KEYS as readonly string[]).includes(value)
}

/**
 * Requisicao unica por carregamento da aplicacao.
 *
 * O cache guarda a PROMISE (nao o resultado) para que montagens concorrentes
 * — inclusive o duplo efeito do StrictMode em desenvolvimento — compartilhem
 * a mesma chamada em vez de disparar varias.
 */
let cachedPublicContent: ReturnType<typeof getPublicContentSections> | null = null

function loadPublicContentOnce() {
  if (!cachedPublicContent) {
    cachedPublicContent = getPublicContentSections().catch((error: unknown) => {
      cachedPublicContent = null // permite nova tentativa numa proxima montagem
      throw error
    })
  }

  return cachedPublicContent
}

/**
 * Disponibiliza o conteudo publicado do CMS para o site publico.
 *
 * Estrategia: renderiza o conteudo estatico imediatamente e, se o CMS responder
 * com conteudo valido, substitui pelo publicado. Assim uma API lenta ou fora do
 * ar nunca produz tela branca. O fallback e por secao.
 */
export function PublicContentProvider({ children }: { children: ReactNode }) {
  const [value, setValue] = useState<PublicContentValue>(STATIC_ONLY_CONTENT)

  useEffect(() => {
    // Producao sem VITE_API_URL: CMS desabilitado, sem tentar localhost.
    if (!publicApiBaseUrl) return

    let active = true

    loadPublicContentOnce()
      .then((sections) => {
        if (!active) return

        const map: Partial<Record<ContentSectionKey, ContentData>> = {}

        for (const section of sections) {
          if (!isContentSectionKey(section.key)) {
            console.warn(`[CMS] secao desconhecida ignorada: ${section.key}`)
            continue
          }

          // Secao sem conteudo publicado util: mantem o estatico.
          if (Object.keys(section.data).length === 0) continue

          map[section.key] = section.data
        }

        if (Object.keys(map).length === 0) return

        setValue({ source: 'cms', sections: map })
      })
      .catch((error: unknown) => {
        if (!active) return
        console.warn('[CMS] conteudo publicado indisponivel; usando conteudo estatico.', error)
      })

    return () => {
      active = false
    }
  }, [])

  return <PublicContentContext.Provider value={value}>{children}</PublicContentContext.Provider>
}
