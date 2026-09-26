import { useEffect, useRef, useState } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Footer } from '../components/layout/Footer'
import { ComoTrabalhamos } from '../components/sections/ComoTrabalhamos'
import { Contato } from '../components/sections/Contato'
import { Hero } from '../components/sections/Hero'
import { QuemSomos } from '../components/sections/QuemSomos'
import { Solucoes } from '../components/sections/Solucoes'
import { AdminNav } from '../components/admin/AdminNav'
import { getContentErrorMessage, isUnauthorizedError } from '../components/admin/content/errorMessages'
import {
  toContatoContent,
  toFooterContent,
  toHeroContent,
  toParceirosPageContent,
  toProcessoContent,
  toProjetosPageContent,
  toQuemSomosContent,
  toSolucoesContent,
} from '../components/admin/content/previewAdapters'
import { getContentSectionMeta } from '../components/admin/content/sections'
import type {
  ContatoContent,
  FooterContent,
  HomeContent,
  ParceirosContent,
  ProcessoContent,
  ProjetosContent,
  QuemSomosContent,
  SolucoesContent,
} from '../components/admin/content/types'
import { ParceirosPage } from './ParceirosPage'
import { ProjetosClientesPage } from './ProjetosClientesPage'
import { useAuth } from '../auth/AuthContext'
import { getAdminContentSection, type ContentData } from '../lib/api'

type ViewState =
  | { status: 'loading' }
  | { status: 'ready'; draft: ContentData }
  | { status: 'error'; message: string }

/**
 * O site publico NAO consome esta pagina. Ela existe apenas dentro da area autenticada
 * para visualizar o RASCUNHO (draft_data) usando os componentes REAIS do site.
 * Nao ha iframe, nem rota publica, nem endpoint publico de draft.
 */
function PreviewContent({ sectionKey, draft }: { sectionKey: string; draft: ContentData }) {
  switch (sectionKey) {
    case 'home':
      return <Hero content={toHeroContent(draft as unknown as HomeContent)} />
    case 'quem_somos':
      return <QuemSomos content={toQuemSomosContent(draft as unknown as QuemSomosContent)} />
    case 'solucoes':
      return <Solucoes content={toSolucoesContent(draft as unknown as SolucoesContent)} />
    case 'processo':
      return <ComoTrabalhamos content={toProcessoContent(draft as unknown as ProcessoContent)} />
    case 'projetos':
      return <ProjetosClientesPage content={toProjetosPageContent(draft as unknown as ProjetosContent)} />
    case 'parceiros':
      return <ParceirosPage content={toParceirosPageContent(draft as unknown as ParceirosContent)} />
    case 'contato':
      return (
        <Contato content={toContatoContent(draft as unknown as ContatoContent)} previewMode />
      )
    case 'footer':
      return <Footer content={toFooterContent(draft as unknown as FooterContent)} />
    default:
      return null
  }
}

export function AdminContentPreviewPage() {
  const params = useParams()
  const sectionKey = params.key ?? ''
  const navigate = useNavigate()
  const { logout } = useAuth()

  const meta = getContentSectionMeta(sectionKey)

  const [view, setView] = useState<ViewState>({ status: 'loading' })

  const logoutRef = useRef(logout)
  const navigateRef = useRef(navigate)

  useEffect(() => {
    logoutRef.current = logout
    navigateRef.current = navigate
  }, [logout, navigate])

  useEffect(() => {
    if (!meta) {
      return
    }

    let active = true

    getAdminContentSection(meta.key)
      .then((response) => {
        if (!active) {
          return
        }

        // Fonte do preview e SEMPRE o rascunho — nunca o publicado.
        setView({ status: 'ready', draft: response.draft_data })
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
  }, [meta])

  /**
   * No modo preview, clicar num link NAO deve tirar o administrador do preview.
   * Interceptamos o clique na fase de captura (uma unica vez, aqui) em vez de alterar
   * os componentes publicos — assim a aparencia do site permanece 100% intacta.
   */
  const handlePreviewClickCapture = (event: ReactMouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement | null
    const anchor = target?.closest('a')

    if (anchor) {
      event.preventDefault()
      event.stopPropagation()
    }
  }

  if (!meta) {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,_#f7f3e8_0%,_#ffffff_52%,_#eef5ee_100%)] px-6 py-10">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-[2rem] border border-[var(--border)] bg-white/88 px-8 py-10">
            <h1 className="text-2xl font-semibold text-[var(--blue-deep)]">
              Conteúdo inexistente
            </h1>
            <p className="mt-3 text-base text-[var(--muted)]">
              A seção solicitada não faz parte das seções de conteúdo do site.
            </p>
            <Link
              to="/admin/conteudo"
              className="mt-6 inline-flex items-center justify-center rounded-full border border-[var(--border)] bg-white px-6 py-3 text-sm font-semibold text-[var(--blue-deep)] transition hover:border-[var(--blue)]"
            >
              Voltar para Conteúdo do site
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F7F3E8]">
      {/* Barra administrativa — sempre FORA do componente publico. */}
      <div className="sticky top-0 z-50 border-b border-white/60 bg-[linear-gradient(135deg,_rgba(15,58,95,0.98),_rgba(20,83,45,0.96))] px-5 py-4 text-white shadow-[0_18px_50px_rgba(8,47,73,0.18)] md:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[#F2B705]">
                Preview do conteúdo
              </p>
              <h1 className="mt-1 text-xl font-semibold">{meta.name}</h1>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-[#F2B705]/25 px-4 py-1.5 text-xs font-semibold text-[#FDE68A]">
                Status: Rascunho
              </span>
              <Link
                to={`/admin/conteudo/${meta.key}`}
                className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/10 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
              >
                ← Voltar para edição
              </Link>
            </div>
          </div>

          <p className="text-xs text-white/85">
            Você está visualizando o rascunho. O site público ainda não foi alterado.
          </p>

          <AdminNav />
        </div>
      </div>

      {view.status === 'loading' ? (
        <div className="mx-auto max-w-6xl px-6 py-16">
          <p className="rounded-[2rem] border border-[var(--border)] bg-white/88 px-8 py-10 text-base text-[var(--muted)]">
            Carregando preview...
          </p>
        </div>
      ) : null}

      {view.status === 'error' ? (
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="rounded-[2rem] border border-[var(--border)] bg-white/88 px-8 py-10">
            <p className="text-base text-[var(--muted)]">
              Não foi possível carregar o preview.
            </p>
            <p className="mt-2 text-sm text-[var(--muted)]">{view.message}</p>
            <Link
              to="/admin/conteudo"
              className="mt-5 inline-flex items-center justify-center rounded-full border border-[var(--border)] bg-white px-6 py-3 text-sm font-semibold text-[var(--blue-deep)] transition hover:border-[var(--blue)]"
            >
              Voltar para Conteúdo do site
            </Link>
          </div>
        </div>
      ) : null}

      {view.status === 'ready' ? (
        <div onClickCapture={handlePreviewClickCapture}>
          <PreviewContent sectionKey={meta.key} draft={view.draft} />
        </div>
      ) : null}
    </div>
  )
}
