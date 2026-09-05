import { useCallback, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  deletePublication,
  getAdminPublications,
  type Publication,
  type PublicationStatus,
} from '../lib/api'

function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—'

  try {
    return new Date(iso).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  } catch {
    return '—'
  }
}

function StatusBadge({ status }: { status: PublicationStatus }) {
  const published = status === 'published'

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
        published
          ? 'bg-[#14532D]/10 text-[#14532D]'
          : 'bg-[#D97706]/10 text-[#B45309]'
      }`}
    >
      <span
        className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
          published ? 'bg-[#16A34A]' : 'bg-[#F59E0B]'
        }`}
      />
      {published ? 'Publicado' : 'Rascunho'}
    </span>
  )
}

export function AdminPublicationsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [items, setItems] = useState<Publication[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [notice, setNotice] = useState<string | null>(() => {
    const state = location.state as { notice?: string } | null
    return state?.notice ?? null
  })

  const load = useCallback(() => {
    getAdminPublications()
      .then((data) => {
        setItems(data.items ?? [])
      })
      .catch(() => {
        setError('Não foi possível carregar as publicações agora.')
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    if (!notice) return

    const timer = window.setTimeout(() => setNotice(null), 4000)
    return () => window.clearTimeout(timer)
  }, [notice])

  async function handleDelete(publication: Publication) {
    const confirmed = window.confirm(
      `Excluir a publicação "${publication.title}"? Esta ação não pode ser desfeita.`,
    )

    if (!confirmed) return

    setDeletingId(publication.id)
    setError(null)

    try {
      await deletePublication(publication.id)
      setItems((current) => current.filter((item) => item.id !== publication.id))
      setNotice('Publicação excluída.')
    } catch {
      setError('Não foi possível excluir a publicação. Tente novamente.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#f7f3e8_0%,_#ffffff_52%,_#eef5ee_100%)] px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-[#D97706]">
              Gestão de conteúdo
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-[#111827]">
              Publicações
            </h1>
          </div>

          <button
            type="button"
            onClick={() => navigate('/admin/publicacoes/nova')}
            className="inline-flex items-center justify-center rounded-full bg-[linear-gradient(135deg,_#0F3A5F,_#14532D)] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_40px_rgba(8,47,73,0.2)] transition hover:opacity-90"
          >
            Nova publicação
          </button>
        </div>

        {notice && (
          <div className="mt-6 rounded-2xl border border-[#16A34A]/25 bg-[#16A34A]/8 px-5 py-4 text-sm font-medium text-[#14532D]">
            {notice}
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-2xl border border-[#DC2626]/25 bg-[#DC2626]/8 px-5 py-4 text-sm font-medium text-[#991B1B]">
            {error}
          </div>
        )}

        <div className="mt-8 overflow-hidden rounded-[2rem] border border-[var(--border)] bg-white/88 shadow-[0_24px_90px_rgba(8,47,73,0.08)]">
          {isLoading ? (
            <div className="px-8 py-16 text-center text-sm text-[var(--muted)]">
              Carregando publicações…
            </div>
          ) : items.length === 0 ? (
            <div className="px-8 py-16 text-center">
              <p className="text-base text-[var(--muted)]">
                Nenhuma publicação criada ainda.
              </p>
              <button
                type="button"
                onClick={() => navigate('/admin/publicacoes/nova')}
                className="mt-6 inline-flex items-center justify-center rounded-full bg-[linear-gradient(135deg,_#0F3A5F,_#14532D)] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Criar a primeira publicação
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[#FBF7EE]/80 text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                    <th className="px-6 py-4 font-semibold">Título</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">Slug</th>
                    <th className="px-6 py-4 font-semibold">Atualizado em</th>
                    <th className="px-6 py-4 font-semibold">Publicado em</th>
                    <th className="px-6 py-4 text-right font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((publication) => (
                    <tr
                      key={publication.id}
                      className="border-b border-[var(--border)]/60 last:border-0"
                    >
                      <td className="px-6 py-5">
                        <p className="font-semibold text-[#111827]">
                          {publication.title}
                        </p>
                      </td>
                      <td className="px-6 py-5">
                        <StatusBadge status={publication.status} />
                      </td>
                      <td className="px-6 py-5 font-mono text-xs text-[var(--muted)]">
                        /{publication.slug}
                      </td>
                      <td className="px-6 py-5 text-sm text-[var(--muted)]">
                        {formatDate(publication.updated_at)}
                      </td>
                      <td className="px-6 py-5 text-sm text-[var(--muted)]">
                        {formatDate(publication.published_at)}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-end gap-3">
                          <Link
                            to={`/admin/publicacoes/${publication.id}/editar`}
                            className="text-sm font-semibold text-[#0F3A5F] transition hover:text-[#14532D]"
                          >
                            Editar
                          </Link>
                          <button
                            type="button"
                            disabled={deletingId === publication.id}
                            onClick={() => void handleDelete(publication)}
                            className="text-sm font-semibold text-[#DC2626] transition hover:text-[#991B1B] disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {deletingId === publication.id
                              ? 'Excluindo…'
                              : 'Excluir'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
