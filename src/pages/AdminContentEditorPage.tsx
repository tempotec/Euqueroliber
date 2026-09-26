import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AdminNav } from '../components/admin/AdminNav'
import { ContentForm } from '../components/admin/content/ContentForm'
import { isSameContent } from '../components/admin/content/arrayUtils'
import { getContentErrorMessage, isUnauthorizedError } from '../components/admin/content/errorMessages'
import { formatAdminDate, getContentSectionMeta } from '../components/admin/content/sections'
import { useAuth } from '../auth/AuthContext'
import {
  getAdminContentSection,
  publishAdminContent,
  revertAdminContent,
  updateAdminContentDraft,
  type AdminContentSection,
  type ContentData,
} from '../lib/api'

type BusyState = 'idle' | 'loading' | 'saving' | 'publishing' | 'reverting'

type Banner = { tone: 'success' | 'error'; text: string } | null

function cloneContentData(data: ContentData): ContentData {
  return JSON.parse(JSON.stringify(data)) as ContentData
}

export function AdminContentEditorPage() {
  const params = useParams()
  const sectionKey = params.key ?? ''

  // A key remonta o editor ao trocar de seção, resetando o estado local
  // sem precisar de setState síncrono dentro de um efeito.
  return <AdminContentEditor key={sectionKey} sectionKey={sectionKey} />
}

interface AdminContentEditorProps {
  sectionKey: string
}

function AdminContentEditor({ sectionKey }: AdminContentEditorProps) {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const meta = getContentSectionMeta(sectionKey)

  const [section, setSection] = useState<AdminContentSection | null>(null)
  const [data, setData] = useState<ContentData | null>(null)
  const [savedDraft, setSavedDraft] = useState<ContentData | null>(null)
  const [busy, setBusy] = useState<BusyState>('loading')
  const [loadError, setLoadError] = useState<string | null>(null)
  const [banner, setBanner] = useState<Banner>(null)

  const logoutRef = useRef(logout)
  const navigateRef = useRef(navigate)

  useEffect(() => {
    logoutRef.current = logout
    navigateRef.current = navigate
  }, [logout, navigate])

  const handleUnauthorized = useCallback(() => {
    void logoutRef.current().finally(() => {
      navigateRef.current('/admin/login', { replace: true })
    })
  }, [])

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

        setSection(response)
        setData(cloneContentData(response.draft_data))
        setSavedDraft(cloneContentData(response.draft_data))
        setBusy('idle')
      })
      .catch((error: unknown) => {
        if (!active) {
          return
        }

        if (isUnauthorizedError(error)) {
          handleUnauthorized()
          return
        }

        setLoadError(getContentErrorMessage(error))
        setBusy('idle')
      })

    return () => {
      active = false
    }
  }, [meta, handleUnauthorized])

  const isDirty = useMemo(() => {
    if (!data || !savedDraft) {
      return false
    }

    return !isSameContent(data, savedDraft)
  }, [data, savedDraft])

  const hasUnpublishedDraft = useMemo(() => {
    if (!section) {
      return false
    }

    return !isSameContent(section.draft_data, section.published_data)
  }, [section])

  const isBusy = busy !== 'idle'

  // Aviso ao sair da pagina com alteracoes locais nao salvas.
  useEffect(() => {
    if (!isDirty) {
      return
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [isDirty])

  const handleBack = () => {
    if (isDirty && !window.confirm('Existem alterações não salvas. Deseja sair mesmo assim?')) {
      return
    }

    navigate('/admin/conteudo')
  }

  const handleSave = async (): Promise<AdminContentSection | null> => {
    if (!meta || !data) {
      return null
    }

    setBusy('saving')
    setBanner(null)

    try {
      const response = await updateAdminContentDraft(meta.key, data)
      setSection(response)
      setSavedDraft(cloneContentData(response.draft_data))
      setData(cloneContentData(response.draft_data))
      setBanner({ tone: 'success', text: 'Rascunho salvo.' })
      return response
    } catch (error: unknown) {
      if (isUnauthorizedError(error)) {
        handleUnauthorized()
        return null
      }

      setBanner({ tone: 'error', text: getContentErrorMessage(error) })
      return null
    } finally {
      setBusy('idle')
    }
  }

  const handlePublish = async () => {
    if (!meta || !data) {
      return
    }

    setBanner(null)

    if (isDirty) {
      const saved = await handleSave()

      if (!saved) {
        return
      }
    }

    setBusy('publishing')

    try {
      const response = await publishAdminContent(meta.key)
      setSection(response)
      setSavedDraft(cloneContentData(response.draft_data))
      setData(cloneContentData(response.draft_data))
      setBanner({ tone: 'success', text: 'Conteúdo publicado.' })
    } catch (error: unknown) {
      if (isUnauthorizedError(error)) {
        handleUnauthorized()
        return
      }

      setBanner({ tone: 'error', text: getContentErrorMessage(error) })
    } finally {
      setBusy('idle')
    }
  }

  const handleRevert = async () => {
    if (!meta) {
      return
    }

    if (!window.confirm('Descartar todas as alterações não publicadas desta seção?')) {
      return
    }

    setBusy('reverting')
    setBanner(null)

    try {
      const response = await revertAdminContent(meta.key)
      setSection(response)
      setSavedDraft(cloneContentData(response.draft_data))
      setData(cloneContentData(response.draft_data))
      setBanner({ tone: 'success', text: 'Alterações descartadas.' })
    } catch (error: unknown) {
      if (isUnauthorizedError(error)) {
        handleUnauthorized()
        return
      }

      setBanner({ tone: 'error', text: getContentErrorMessage(error) })
    } finally {
      setBusy('idle')
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

  const buttonBase =
    'inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60'
  const primaryButton = `${buttonBase} bg-[linear-gradient(135deg,_#0F3A5F,_#14532D)] text-white hover:opacity-90`
  const secondaryButton = `${buttonBase} border border-[var(--border)] bg-white text-[var(--blue-deep)] hover:border-[var(--blue)]`

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#f7f3e8_0%,_#ffffff_52%,_#eef5ee_100%)] px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-[2rem] border border-white/70 bg-[linear-gradient(135deg,_rgba(15,58,95,0.98),_rgba(20,83,45,0.94))] px-8 py-10 text-white shadow-[0_28px_110px_rgba(8,47,73,0.16)] md:px-10">
          <p className="text-sm uppercase tracking-[0.28em] text-[#F2B705]">
            Conteúdo do site
          </p>
          <h1 className="mt-4 text-4xl font-semibold">{meta.name}</h1>
          <p className="mt-2 font-mono text-xs text-white/70">{meta.key}</p>

          <div className="mt-8">
            <AdminNav />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button type="button" className={secondaryButton} onClick={handleBack}>
            Voltar
          </button>

          {section ? (
            <span className="text-xs text-[var(--muted)]">
              Última atualização: {formatAdminDate(section.updated_at)} · Última publicação:{' '}
              {formatAdminDate(section.published_at)}
            </span>
          ) : null}
        </div>

        {isDirty ? (
          <p className="mt-4 rounded-2xl border border-[#F2B705]/60 bg-[#F2B705]/15 px-5 py-3 text-sm font-semibold text-[#8A5A00]">
            Alterações ainda não salvas.
          </p>
        ) : null}

        {banner ? (
          <p
            className={`mt-4 rounded-2xl px-5 py-3 text-sm font-semibold ${
              banner.tone === 'success'
                ? 'border border-[#14532D]/30 bg-[#14532D]/10 text-[#14532D]'
                : 'border border-[#B42318]/30 bg-[#B42318]/10 text-[#B42318]'
            }`}
            role="status"
          >
            {banner.text}
          </p>
        ) : null}

        <div className="mt-6">
          {busy === 'loading' ? (
            <p className="rounded-[2rem] border border-[var(--border)] bg-white/88 px-8 py-10 text-base text-[var(--muted)]">
              Carregando conteúdo...
            </p>
          ) : null}

          {loadError ? (
            <div className="rounded-[2rem] border border-[var(--border)] bg-white/88 px-8 py-10">
              <p className="text-base text-[var(--muted)]">{loadError}</p>
              <Link to="/admin/conteudo" className={`${secondaryButton} mt-5`}>
                Voltar para Conteúdo do site
              </Link>
            </div>
          ) : null}

          {!loadError && data && busy !== 'loading' ? (
            <div className="rounded-[2rem] border border-[var(--border)] bg-white/88 px-6 py-8 shadow-[0_24px_90px_rgba(8,47,73,0.08)] sm:px-8">
              <ContentForm
                sectionKey={meta.key}
                value={data}
                onChange={setData}
                disabled={isBusy}
              />
            </div>
          ) : null}
        </div>

        {!loadError && data ? (
          <div className="sticky bottom-4 mt-6 rounded-[2rem] border border-[var(--border)] bg-white/95 px-6 py-5 shadow-[0_24px_90px_rgba(8,47,73,0.12)] backdrop-blur">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                className={primaryButton}
                onClick={() => {
                  void handleSave()
                }}
                disabled={isBusy}
              >
                {busy === 'saving' ? 'Salvando...' : 'Salvar rascunho'}
              </button>

              <button
                type="button"
                className={primaryButton}
                onClick={() => {
                  void handlePublish()
                }}
                disabled={isBusy}
              >
                {busy === 'publishing' ? 'Publicando...' : 'Publicar alterações'}
              </button>

              <button
                type="button"
                className={secondaryButton}
                onClick={() => {
                  void handleRevert()
                }}
                disabled={isBusy || !hasUnpublishedDraft}
              >
                {busy === 'reverting' ? 'Descartando alterações...' : 'Descartar alterações'}
              </button>
            </div>

            <p className="mt-3 text-xs text-[var(--muted)]">
              {hasUnpublishedDraft
                ? 'Este rascunho possui alterações ainda não publicadas.'
                : 'O rascunho está igual à versão publicada.'}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
