import { PublicationCover } from '../ui/PublicationCover'

/** Campos necessários para apresentar um artigo. */
export type PublicationArticleData = {
  title: string
  summary: string
  content: string
  cover_image: string | null
  published_at?: string | null
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return ''

  try {
    return new Date(iso).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return ''
  }
}

type PublicationArticleProps = {
  publication: PublicationArticleData
  /**
   * Rótulo exibido no lugar da data quando o artigo ainda não tem data pública
   * (ex: preview de um rascunho nunca publicado).
   */
  dateFallbackLabel?: string | null
}

/**
 * Apresentação do artigo — usada pela página pública E pelo preview editorial.
 *
 * Fonte única: o preview nunca deve divergir do que o visitante verá.
 * O conteúdo é renderizado como TEXTO React (sem `dangerouslySetInnerHTML`).
 */
export function PublicationArticle({
  publication,
  dateFallbackLabel = null,
}: PublicationArticleProps) {
  const date = formatDate(publication.published_at)
  const label = date || dateFallbackLabel

  return (
    <article className="mt-10 overflow-hidden rounded-[2rem] border border-[var(--border)] bg-white/88 shadow-[0_24px_90px_rgba(8,47,73,0.08)]">
      <PublicationCover
        coverImage={publication.cover_image}
        title={publication.title}
        imageClassName="h-full w-full object-cover"
        imageLoading="eager"
        emptyFallback="none"
      />

      <div className="px-6 py-10 md:px-10">
        {label && (
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#D97706]">
            {label}
          </p>
        )}

        <h1 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-normal text-[#111827] md:text-4xl">
          {publication.title}
        </h1>

        {publication.summary && (
          <p className="mt-6 text-lg leading-relaxed text-[#374151]">{publication.summary}</p>
        )}

        <div className="mt-8 whitespace-pre-line border-t border-[var(--border)] pt-8 text-base leading-relaxed text-[#374151]">
          {publication.content}
        </div>
      </div>
    </article>
  )
}
