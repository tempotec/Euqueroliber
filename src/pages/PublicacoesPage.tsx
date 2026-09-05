import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getPublicPublications, type PublicPublication } from '../lib/api'

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

export function PublicacoesPage() {
  const [items, setItems] = useState<PublicPublication[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    let active = true

    getPublicPublications()
      .then((data) => {
        if (active) setItems(data.items ?? [])
      })
      .catch(() => {
        if (active) setHasError(true)
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  return (
    <section id="publicacoes" className="bg-[#F7F3E8] px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#D97706]">
            Publicações
          </p>
          <h1 className="mt-3 text-balance text-3xl font-semibold tracking-normal text-[#111827] md:text-4xl">
            Conteúdos, materiais e novidades
          </h1>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-[#374151]">
            Artigos e materiais sobre educação ambiental, gestão de resíduos e
            logística reversa.
          </p>
        </div>

        <div className="mt-12">
          {isLoading ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map((index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-[2rem] border border-[var(--border)] bg-white/88 shadow-[0_24px_90px_rgba(8,47,73,0.08)]"
                >
                  <div className="aspect-[16/9] animate-pulse bg-[#E5E0D2]" />
                  <div className="space-y-3 px-6 py-6">
                    <div className="h-4 w-2/3 animate-pulse rounded-full bg-[#E5E0D2]" />
                    <div className="h-3 w-full animate-pulse rounded-full bg-[#E5E0D2]" />
                    <div className="h-3 w-4/5 animate-pulse rounded-full bg-[#E5E0D2]" />
                  </div>
                </div>
              ))}
            </div>
          ) : hasError ? (
            <div className="rounded-[2rem] border border-[var(--border)] bg-white/88 px-8 py-16 text-center shadow-[0_24px_90px_rgba(8,47,73,0.08)]">
              <p className="text-lg font-medium text-[#374151]">
                Não foi possível carregar as publicações agora.
              </p>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Tente novamente em instantes.
              </p>
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-[2rem] border border-[var(--border)] bg-white/88 px-8 py-16 text-center shadow-[0_24px_90px_rgba(8,47,73,0.08)]">
              <p className="text-lg font-medium text-[#374151]">
                Ainda não há publicações disponíveis.
              </p>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Em breve novos conteúdos serão publicados aqui.
              </p>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((publication) => (
                <Link
                  key={publication.id}
                  to={`/publicacoes/${publication.slug}`}
                  className="group flex flex-col overflow-hidden rounded-[2rem] border border-[var(--border)] bg-white/88 shadow-[0_24px_90px_rgba(8,47,73,0.08)] transition hover:-translate-y-1 hover:shadow-[0_30px_110px_rgba(8,47,73,0.14)]"
                >
                  {publication.cover_image ? (
                    <div className="aspect-[16/9] overflow-hidden">
                      <img
                        src={publication.cover_image}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="flex aspect-[16/9] items-center justify-center bg-[linear-gradient(135deg,_#0F3A5F,_#14532D)]">
                      <span className="text-4xl font-semibold text-[#F2B705]">
                        {publication.title.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}

                  <div className="flex flex-1 flex-col px-6 py-6">
                    {publication.published_at && (
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#D97706]">
                        {formatDate(publication.published_at)}
                      </p>
                    )}
                    <h2 className="mt-3 text-balance text-xl font-semibold leading-snug text-[#111827]">
                      {publication.title}
                    </h2>
                    {publication.summary && (
                      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-[#374151]">
                        {publication.summary}
                      </p>
                    )}
                    <span className="mt-auto pt-6 text-sm font-semibold text-[#0F3A5F] transition group-hover:text-[#14532D]">
                      Ler publicação →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
