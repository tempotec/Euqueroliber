import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ApiError, getPublicPublication, type Publication } from '../lib/api'
import { PublicationArticle } from '../components/publications/PublicationArticle'

type ViewState =
  | { status: 'loading' }
  | { status: 'notfound' }
  | { status: 'unavailable' }
  | { status: 'error' }
  | { status: 'ready'; publication: Publication }

export function PublicacaoDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const [view, setView] = useState<ViewState>(() =>
    slug ? { status: 'loading' } : { status: 'notfound' },
  )

  useEffect(() => {
    if (!slug) return

    const controller = new AbortController()
    let active = true

    getPublicPublication(slug, controller.signal)
      .then((data) => {
        if (active) setView({ status: 'ready', publication: data })
      })
      .catch((reason: unknown) => {
        if (!active) return
        if (reason instanceof DOMException && reason.name === 'AbortError') return

        const code = reason instanceof ApiError ? reason.code : 'request_failed'

        // 404 continua sendo conteudo inexistente — nunca falha de infraestrutura.
        if (code === 'not_found') {
          setView({ status: 'notfound' })
        } else if (code === 'api_not_configured' || code === 'server_unavailable') {
          setView({ status: 'unavailable' })
        } else {
          setView({ status: 'error' })
        }
      })

    return () => {
      active = false
      controller.abort()
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

        {view.status === 'unavailable' && (
          <div className="mt-10 rounded-[2rem] border border-[var(--border)] bg-white/88 px-8 py-16 text-center shadow-[0_24px_90px_rgba(8,47,73,0.08)]">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#D97706]">
              Temporariamente indisponível
            </p>
            <h1 className="mt-4 text-2xl font-semibold text-[#111827]">
              Publicações temporariamente indisponíveis
            </h1>
            <p className="mt-3 text-base text-[#374151]">
              Estamos trabalhando para restabelecer o conteúdo. Tente novamente mais tarde ou volte
              para a lista de publicações.
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

        {view.status === 'ready' && <PublicationArticle publication={view.publication} />}
      </div>
    </section>
  )
}
