import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ApiError, getPublicPublication, type Publication } from '../lib/api'

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

type ViewState =
  | { status: 'loading' }
  | { status: 'notfound' }
  | { status: 'error' }
  | { status: 'ready'; publication: Publication }

export function PublicacaoDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const [view, setView] = useState<ViewState>({ status: 'loading' })

  useEffect(() => {
    if (!slug) return

    let active = true

    getPublicPublication(slug)
      .then((data) => {
        if (active) setView({ status: 'ready', publication: data })
      })
      .catch((reason: unknown) => {
        if (!active) return
        if (reason instanceof ApiError && reason.code === 'not_found') {
          setView({ status: 'notfound' })
        } else {
          setView({ status: 'error' })
        }
      })

    return () => {
      active = false
    }
  }, [slug])

  return (
    <section id="publicacao" className="bg-[#F7F3E8] px-6 py-20 md:py-28">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/publicacoes"
          className="inline-block text-sm font-semibold text-[#0F3A5F] transition hover:text-[#14532D]"
        >
          ← Voltar para Publicações
        </Link>

        {view.status === 'loading' && (
          <div className="mt-10 rounded-[2rem] border border-[var(--border)] bg-white/88 px-8 py-16 text-center text-sm text-[var(--muted)] shadow-[0_24px_90px_rgba(8,47,73,0.08)]">
            Carregando publicação…
          </div>
        )}

        {view.status === 'notfound' && (
          <div className="mt-10 rounded-[2rem] border border-[var(--border)] bg-white/88 px-8 py-16 text-center shadow-[0_24px_90px_rgba(8,47,73,0.08)]">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#D97706]">
              Não encontrada
            </p>
            <h1 className="mt-4 text-2xl font-semibold text-[#111827]">
              Publicação não encontrada
            </h1>
            <p className="mt-3 text-base text-[#374151]">
              O conteúdo que você procura não está disponível ou foi removido.
            </p>
          </div>
        )}

        {view.status === 'error' && (
          <div className="mt-10 rounded-[2rem] border border-[var(--border)] bg-white/88 px-8 py-16 text-center shadow-[0_24px_90px_rgba(8,47,73,0.08)]">
            <p className="text-lg font-medium text-[#374151]">
              Não foi possível carregar a publicação agora.
            </p>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Tente novamente em instantes.
            </p>
          </div>
        )}

        {view.status === 'ready' && (
          <article className="mt-10 overflow-hidden rounded-[2rem] border border-[var(--border)] bg-white/88 shadow-[0_24px_90px_rgba(8,47,73,0.08)]">
            {view.publication.cover_image && (
              <div className="aspect-[16/9] overflow-hidden">
                <img
                  src={view.publication.cover_image}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            <div className="px-6 py-10 md:px-10">
              {view.publication.published_at && (
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#D97706]">
                  {formatDate(view.publication.published_at)}
                </p>
              )}

              <h1 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-normal text-[#111827] md:text-4xl">
                {view.publication.title}
              </h1>

              {view.publication.summary && (
                <p className="mt-6 text-lg leading-relaxed text-[#374151]">
                  {view.publication.summary}
                </p>
              )}

              <div className="mt-8 whitespace-pre-line border-t border-[var(--border)] pt-8 text-base leading-relaxed text-[#374151]">
                {view.publication.content}
              </div>
            </div>
          </article>
        )}
      </div>
    </section>
  )
}
