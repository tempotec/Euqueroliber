import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AdminNav } from '../components/admin/AdminNav'
import { getContentErrorMessage, isUnauthorizedError } from '../components/admin/content/errorMessages'
import { PublicationArticle } from '../components/publications/PublicationArticle'
import { useAuth } from '../auth/AuthContext'
import { getAdminPublication, type Publication } from '../lib/api'

type ViewState =
  | { status: 'loading' }
  | { status: 'ready'; publication: Publication }
  | { status: 'notfound' }
  | { status: 'error'; message: string }

/**
 * O site público NÃO consome esta página. Ela existe apenas dentro da área
 * autenticada para visualizar a EDIÇÃO PENDENTE (draft) usando exatamente a
 * mesma apresentação da página pública — sem iframe e sem endpoint público.
 */
export function AdminPublicationPreviewPage() {
  const params = useParams()
  const publicationId = params.id ?? ''
  const navigate = useNavigate()
  const { logout } = useAuth()

  const [view, setView] = useState<ViewState>(() =>
    publicationId ? { status: 'loading' } : { status: 'notfound' },
  )

  const logoutRef = useRef(logout)
  const navigateRef = useRef(navigate)

  useEffect(() => {
    logoutRef.current = logout
    navigateRef.current = navigate
  }, [logout, navigate])

  useEffect(() => {
    if (!publicationId) return

    let active = true

    getAdminPublication(publicationId)
      .then((publication) => {
        if (active) setView({ status: 'ready', publication })
      })
      .catch((error: unknown) => {
        if (!active) return

        if (isUnauthorizedError(error)) {
          void logoutRef.current().finally(() => {
            navigateRef.current('/admin/login', { replace: true })
          })
          return
        }

        setView({ status: 'error', message: getContentErrorMessage(error) })
      })

    return () => {
      active = false
    }
  }, [publicationId])

  const backToEditor = (
    <Link
      to={`/admin/publicacoes/${publicationId}/editar`}
      className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/10 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
    >
      ← Voltar para edição
    </Link>
  )

  if (view.status === 'loading') {
    return (
      <div className="min-h-screen bg-[#F7F3E8] px-6 py-16">
        <p className="mx-auto max-w-3xl rounded-[2rem] border border-[var(--border)] bg-white/88 px-8 py-10 text-base text-[var(--muted)]">
          Carregando preview...
        </p>
      </div>
    )
  }

  if (view.status === 'notfound' || view.status === 'error') {
    return (
      <div className="min-h-screen bg-[#F7F3E8] px-6 py-16">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-[var(--border)] bg-white/88 px-8 py-10">
          <h1 className="text-2xl font-semibold text-[var(--blue-deep)]">
            {view.status === 'notfound' ? 'Publicação não encontrada' : 'Não foi possível carregar o preview'}
          </h1>
          {view.status === 'error' && (
            <p className="mt-2 text-sm text-[var(--muted)]">{view.message}</p>
          )}
          <Link
            to="/admin/publicacoes"
            className="mt-6 inline-flex items-center justify-center rounded-full border border-[var(--border)] bg-white px-6 py-3 text-sm font-semibold text-[var(--blue-deep)] transition hover:border-[var(--blue)]"
          >
            Voltar para Publicações
          </Link>
        </div>
      </div>
    )
  }

  const { publication } = view
  const previewingDraft = publication.has_unpublished_changes

  return (
    <div className="min-h-screen bg-[#F7F3E8]">
      {/* Barra administrativa — sempre FORA do artigo. */}
      <div className="sticky top-0 z-50 border-b border-white/60 bg-[linear-gradient(135deg,_rgba(15,58,95,0.98),_rgba(20,83,45,0.96))] px-5 py-4 text-white shadow-[0_18px_50px_rgba(8,47,73,0.18)] md:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[#F2B705]">
                Preview da publicação
              </p>
              <h1 className="mt-1 text-xl font-semibold">
                {publication.editor_data.title}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-[#F2B705]/25 px-4 py-1.5 text-xs font-semibold text-[#FDE68A]">
                {previewingDraft ? 'Status: Rascunho pendente' : 'Status: Rascunho'}
              </span>
              {backToEditor}
            </div>
          </div>

          <p className="text-xs text-white/85">
            {previewingDraft
              ? 'Você está visualizando uma versão não publicada. O site público continua mostrando a versão anterior até você clicar em "Publicar alterações".'
              : 'Você está visualizando uma versão não publicada. Esta publicação ainda não aparece no site público.'}
          </p>

          <AdminNav />
        </div>
      </div>

      <section className="px-6 py-12 md:py-16">
        <div className="mx-auto max-w-4xl">
          <PublicationArticle
            publication={{
              ...publication.editor_data,
              published_at: publication.published_at,
            }}
            dateFallbackLabel={publication.published_at ? null : 'Rascunho — não publicado'}
          />
        </div>
      </section>
    </div>
  )
}
