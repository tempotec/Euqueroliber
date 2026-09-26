import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AdminNav } from '../components/admin/AdminNav'
import { isSameContent } from '../components/admin/content/arrayUtils'
import { getContentErrorMessage, isUnauthorizedError } from '../components/admin/content/errorMessages'
import { ADMIN_CONTENT_SECTIONS, formatAdminDate } from '../components/admin/content/sections'
import { useAuth } from '../auth/AuthContext'
import { getAdminContentSections, type AdminContentSection } from '../lib/api'

type ViewState =
  | { status: 'loading' }
  | { status: 'ready'; sections: AdminContentSection[] }
  | { status: 'error'; message: string }

function StatusBadge({ published }: { published: boolean }) {
  if (published) {
    return (
      <span className="inline-flex items-center rounded-full bg-[#14532D]/10 px-3 py-1 text-xs font-semibold text-[#14532D]">
        Publicado
      </span>
    )
  }

  return (
    <span className="inline-flex items-center rounded-full bg-[#F2B705]/20 px-3 py-1 text-xs font-semibold text-[#8A5A00]">
      Alterações não publicadas
    </span>
  )
}

export function AdminContentPage() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [view, setView] = useState<ViewState>({ status: 'loading' })
  const [reloadToken, setReloadToken] = useState(0)

  // Refs mantem as funcoes de auth/navegacao atuais sem entrar nas dependencias
  // do efeito (o contexto de auth nao e memoizado e mudaria de identidade a cada render).
  const logoutRef = useRef(logout)
  const navigateRef = useRef(navigate)

  useEffect(() => {
    logoutRef.current = logout
    navigateRef.current = navigate
  }, [logout, navigate])

  useEffect(() => {
    let active = true

    getAdminContentSections()
      .then((response) => {
        if (!active) {
          return
        }

        setView({ status: 'ready', sections: response.sections ?? [] })
      })
      .catch((error: unknown) => {
        if (!active) {
          return
        }

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
  }, [reloadToken])

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#f7f3e8_0%,_#ffffff_52%,_#eef5ee_100%)] px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-[2rem] border border-white/70 bg-[linear-gradient(135deg,_rgba(15,58,95,0.98),_rgba(20,83,45,0.94))] px-8 py-10 text-white shadow-[0_28px_110px_rgba(8,47,73,0.16)] md:px-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-[#F2B705]">
                Painel Administrativo
              </p>
              <h1 className="mt-4 text-4xl font-semibold">Conteúdo do site</h1>
              <p className="mt-3 max-w-2xl text-base text-white/80">
                As oito seções institucionais do site. Edite o rascunho de cada uma e publique
                quando estiver pronto.
              </p>
            </div>
          </div>

          <div className="mt-8">
            <AdminNav />
          </div>
        </div>

        <div className="mt-8">
          {view.status === 'loading' ? (
            <p className="rounded-[2rem] border border-[var(--border)] bg-white/88 px-8 py-10 text-base text-[var(--muted)]">
              Carregando conteúdo...
            </p>
          ) : null}

          {view.status === 'error' ? (
            <div className="rounded-[2rem] border border-[var(--border)] bg-white/88 px-8 py-10">
              <p className="text-base text-[var(--muted)]">{view.message}</p>
              <button
                type="button"
                className="mt-5 inline-flex items-center justify-center rounded-full border border-[var(--border)] bg-white px-6 py-3 text-sm font-semibold text-[var(--blue-deep)] transition hover:border-[var(--blue)]"
                onClick={() => {
                  setView({ status: 'loading' })
                  setReloadToken((token) => token + 1)
                }}
              >
                Tentar novamente
              </button>
            </div>
          ) : null}

          {view.status === 'ready' ? (
            <ul className="grid gap-5 md:grid-cols-2">
              {ADMIN_CONTENT_SECTIONS.map((meta) => {
                const section = view.sections.find((entry) => entry.key === meta.key)
                const published = section
                  ? isSameContent(section.draft_data, section.published_data)
                  : false

                return (
                  <li
                    key={meta.key}
                    className="flex flex-col rounded-[2rem] border border-[var(--border)] bg-white/88 px-7 py-7 shadow-[0_24px_90px_rgba(8,47,73,0.08)]"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <h2 className="text-xl font-semibold text-[var(--blue-deep)]">
                        {meta.name}
                      </h2>
                      {section ? (
                        <StatusBadge published={published} />
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-[var(--border)] px-3 py-1 text-xs font-semibold text-[var(--muted)]">
                          Não inicializada
                        </span>
                      )}
                    </div>

                    <p className="mt-2 font-mono text-xs text-[var(--muted)]">{meta.key}</p>

                    <p className="mt-3 grow text-sm text-[var(--muted)]">{meta.description}</p>

                    <dl className="mt-5 grid gap-2 text-xs text-[var(--muted)]">
                      <div className="flex gap-2">
                        <dt className="font-semibold">Última atualização:</dt>
                        <dd>{formatAdminDate(section?.updated_at ?? null)}</dd>
                      </div>
                      <div className="flex gap-2">
                        <dt className="font-semibold">Última publicação:</dt>
                        <dd>{formatAdminDate(section?.published_at ?? null)}</dd>
                      </div>
                    </dl>

                    <div className="mt-6">
                      <Link
                        to={`/admin/conteudo/${meta.key}`}
                        className="inline-flex items-center justify-center rounded-full bg-[linear-gradient(135deg,_#0F3A5F,_#14532D)] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                      >
                        Editar
                      </Link>
                    </div>
                  </li>
                )
              })}
            </ul>
          ) : null}

          <p className="mt-8 text-xs text-[var(--muted)]">
            As oito seções são fixas: este painel não permite criar novas seções.
          </p>
        </div>
      </div>
    </div>
  )
}
