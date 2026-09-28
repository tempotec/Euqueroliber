import { useCallback, useEffect, useMemo, useState } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ApiError,
  createPublication,
  getAdminPublication,
  publishPublication,
  revertPublicationDraft,
  unpublishPublication,
  updatePublication,
  type Publication,
  type PublicationDraft,
} from '../lib/api'

function friendlyMessage(error: unknown): string {
  if (error instanceof ApiError) {
    switch (error.code) {
      case 'slug_already_exists':
        return 'Já existe uma publicação com esse endereço (slug). Escolha outro ou deixe em branco para gerar automaticamente.'
      case 'validation_error':
        return 'Verifique os campos obrigatórios: título e conteúdo.'
      case 'status_change_requires_explicit_action':
        return 'Para publicar ou despublicar use os botões específicos.'
      case 'not_found':
        return 'Publicação não encontrada.'
      case 'server_unavailable':
        return 'Não foi possível conectar ao servidor.'
      default:
        return error.message || 'Não foi possível salvar a publicação.'
    }
  }

  return 'Não foi possível salvar a publicação.'
}

type FormState = {
  title: string
  slug: string
  summary: string
  content: string
  coverImage: string
}

const EMPTY_FORM: FormState = {
  title: '',
  slug: '',
  summary: '',
  content: '',
  coverImage: '',
}

function toForm(data: PublicationDraft | Publication): FormState {
  return {
    title: data.title,
    slug: data.slug,
    summary: data.summary ?? '',
    content: data.content,
    coverImage: data.cover_image ?? '',
  }
}

function formEquals(a: FormState, b: FormState): boolean {
  return (
    a.title.trim() === b.title.trim() &&
    a.slug.trim() === b.slug.trim() &&
    a.summary.trim() === b.summary.trim() &&
    a.content === b.content &&
    a.coverImage.trim() === b.coverImage.trim()
  )
}

export function AdminPublicationFormPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [publicationId, setPublicationId] = useState<string | undefined>(id)
  const isEditing = publicationId !== undefined

  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  /** Conteúdo conforme está no servidor — base para detectar alterações locais. */
  const [savedForm, setSavedForm] = useState<FormState>(EMPTY_FORM)
  const [publication, setPublication] = useState<Publication | null>(null)

  const [isLoading, setIsLoading] = useState(isEditing)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [notFound, setNotFound] = useState(false)

  const isDirty = !formEquals(form, savedForm)
  const hasPendingChanges = publication?.has_unpublished_changes ?? false
  const isPublished = publication?.status === 'published'

  const applyLoadedPublication = useCallback((loaded: Publication) => {
    setPublication(loaded)
    const editorForm = toForm(loaded.editor_data)
    setForm(editorForm)
    setSavedForm(editorForm)
  }, [])

  useEffect(() => {
    if (!publicationId) return

    let active = true

    getAdminPublication(publicationId)
      .then((loaded: Publication) => {
        if (!active) return
        applyLoadedPublication(loaded)
      })
      .catch((reason: unknown) => {
        if (!active) return
        if (reason instanceof ApiError && reason.code === 'not_found') {
          setNotFound(true)
        } else {
          setError('Não foi possível carregar a publicação. Tente novamente.')
        }
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })

    return () => {
      active = false
    }
  }, [publicationId, applyLoadedPublication])

  // Proteção contra perda de alterações não salvas (mesmo padrão do CMS).
  useEffect(() => {
    if (!isDirty) return

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ''
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isDirty])

  const payload = useMemo(
    () => ({
      title: form.title.trim(),
      slug: form.slug.trim() || undefined,
      summary: form.summary.trim(),
      content: form.content,
      cover_image: form.coverImage.trim() || undefined,
    }),
    [form],
  )

  /**
   * Persiste a edição. NUNCA publica.
   * Retorna o id da publicação (criada ou existente) ou `null` em caso de erro.
   */
  async function persistDraft(): Promise<string | null> {
    setError(null)
    setIsSubmitting(true)

    try {
      if (isEditing && publicationId) {
        const updated = await updatePublication(publicationId, payload)
        applyLoadedPublication(updated)
        setNotice(
          updated.has_unpublished_changes
            ? 'Alterações salvas como rascunho. O site ainda mostra a versão publicada.'
            : 'Alterações salvas.',
        )
        return publicationId
      }

      const created = await createPublication({ ...payload, status: 'draft' })
      setPublicationId(String(created.id))
      applyLoadedPublication(created)
      setNotice('Publicação criada como rascunho. Ela ainda não aparece no site público.')
      return String(created.id)
    } catch (reason: unknown) {
      setError(friendlyMessage(reason))
      return null
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleSave() {
    await persistDraft()
  }

  async function handlePublish() {
    setError(null)
    setNotice(null)

    // Nunca publicar uma versão antiga: se há alterações locais, salva antes.
    let targetId: string | null = publicationId ?? null

    if (isDirty || !targetId) {
      targetId = await persistDraft()
      if (!targetId) return
    }

    setIsSubmitting(true)

    try {
      await publishPublication(targetId)
      navigate('/admin/publicacoes', {
        state: { notice: 'Publicação publicada. O site já mostra esta versão.' },
      })
    } catch (reason: unknown) {
      setError(friendlyMessage(reason))
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handlePreview() {
    setError(null)

    if (isDirty || !publicationId) {
      const saved = await persistDraft()
      if (!saved) return
      navigate(`/admin/publicacoes/${saved}/preview`)
      return
    }

    navigate(`/admin/publicacoes/${publicationId}/preview`)
  }

  async function handleDiscard() {
    if (!publicationId) return

    const confirmed = window.confirm(
      'Descartar todas as alterações não publicadas? O site público não é afetado.',
    )
    if (!confirmed) return

    setError(null)
    setIsSubmitting(true)

    try {
      const updated = await revertPublicationDraft(publicationId)
      applyLoadedPublication(updated)
      setNotice('Alterações pendentes descartadas. O formulário voltou à versão publicada.')
    } catch (reason: unknown) {
      setError(friendlyMessage(reason))
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleUnpublish() {
    if (!publicationId) return

    const confirmed = window.confirm(
      'Esta publicação deixará de aparecer no site público. Despublicar agora?',
    )
    if (!confirmed) return

    setError(null)
    setIsSubmitting(true)

    try {
      const updated = await unpublishPublication(publicationId)
      applyLoadedPublication(updated)
      navigate('/admin/publicacoes', {
        state: { notice: 'Publicação removida do site público.' },
      })
    } catch (reason: unknown) {
      setError(friendlyMessage(reason))
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleBack(event: ReactMouseEvent<HTMLAnchorElement>) {
    if (!isDirty) return

    const confirmed = window.confirm(
      'Você tem alterações não salvas. Sair e descartá-las?',
    )

    if (!confirmed) {
      event.preventDefault()
    }
  }

  const inputClass =
    'mt-2 w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-base text-[#111827] outline-none transition focus:border-[#D97706] focus:ring-2 focus:ring-[#D97706]/25'

  const secondaryButton =
    'inline-flex flex-1 items-center justify-center rounded-full border border-[var(--border)] bg-white px-6 py-3 text-sm font-semibold text-[#0F3A5F] transition hover:border-[#0F3A5F] disabled:cursor-not-allowed disabled:opacity-70'
  const draftButton =
    'inline-flex flex-1 items-center justify-center rounded-full border border-[#D97706]/40 bg-[#D97706]/10 px-6 py-3 text-sm font-semibold text-[#B45309] transition hover:bg-[#D97706]/20 disabled:cursor-not-allowed disabled:opacity-70'
  const primaryButton =
    'inline-flex flex-1 items-center justify-center rounded-full bg-[linear-gradient(135deg,_#0F3A5F,_#14532D)] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_40px_rgba(8,47,73,0.2)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70'
  const dangerButton =
    'inline-flex flex-1 items-center justify-center rounded-full border border-[#DC2626]/35 bg-[#DC2626]/8 px-6 py-3 text-sm font-semibold text-[#991B1B] transition hover:bg-[#DC2626]/15 disabled:cursor-not-allowed disabled:opacity-70'

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,_#f7f3e8_0%,_#ffffff_52%,_#eef5ee_100%)] px-6 py-10">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-[var(--border)] bg-white/88 px-8 py-16 text-center text-sm text-[var(--muted)] shadow-[0_24px_90px_rgba(8,47,73,0.08)]">
          Carregando publicação…
        </div>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,_#f7f3e8_0%,_#ffffff_52%,_#eef5ee_100%)] px-6 py-10">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-[var(--border)] bg-white/88 px-8 py-16 text-center shadow-[0_24px_90px_rgba(8,47,73,0.08)]">
          <p className="text-sm uppercase tracking-[0.22em] text-[#D97706]">
            Não encontrada
          </p>
          <h1 className="mt-4 text-2xl font-semibold text-[#111827]">
            Publicação não encontrada
          </h1>
          <Link
            to="/admin/publicacoes"
            className="mt-6 inline-block rounded-full bg-[linear-gradient(135deg,_#0F3A5F,_#14532D)] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Voltar para Publicações
          </Link>
        </div>
      </div>
    )
  }

  const slugWillChange = isPublished && !!publication && form.slug.trim() !== publication.slug

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#f7f3e8_0%,_#ffffff_52%,_#eef5ee_100%)] px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/admin/publicacoes"
          onClick={handleBack}
          className="text-sm font-semibold text-[#0F3A5F] transition hover:text-[#14532D]"
        >
          ← Voltar para Publicações
        </Link>

        <div className="mt-6">
          <p className="text-sm uppercase tracking-[0.28em] text-[#D97706]">
            {isEditing ? 'Editar publicação' : 'Nova publicação'}
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-[#111827]">
            {isEditing ? 'Editar publicação' : 'Criar publicação'}
          </h1>
        </div>

        {isEditing && publication && (
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-[var(--border)] px-4 py-1.5 text-xs font-semibold text-[#0F3A5F]">
              {isPublished ? 'Publicado' : 'Rascunho'}
            </span>
            {hasPendingChanges && (
              <span className="rounded-full bg-[#D97706]/15 px-4 py-1.5 text-xs font-semibold text-[#B45309]">
                Publicado — alterações pendentes
              </span>
            )}
            {isDirty && (
              <span className="rounded-full bg-[#0F3A5F]/10 px-4 py-1.5 text-xs font-semibold text-[#0F3A5F]">
                Alterações ainda não salvas
              </span>
            )}
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-2xl border border-[#DC2626]/25 bg-[#DC2626]/8 px-5 py-4 text-sm font-medium text-[#991B1B]">
            {error}
          </div>
        )}

        {notice && (
          <div className="mt-6 rounded-2xl border border-[#14532D]/25 bg-[#14532D]/8 px-5 py-4 text-sm font-medium text-[#14532D]">
            {notice}
          </div>
        )}

        {hasPendingChanges && (
          <div className="mt-6 rounded-2xl border border-[#D97706]/35 bg-[#D97706]/8 px-5 py-4 text-sm text-[#92400E]">
            <p className="font-semibold">Esta publicação tem alterações pendentes.</p>
            <p className="mt-1">
              O site público continua mostrando a versão publicada.{' '}
              <Link
                to={`/admin/publicacoes/${publicationId}/preview`}
                className="font-semibold underline"
              >
                Veja como ficará no preview
              </Link>
              .
            </p>
          </div>
        )}

        <div className="mt-8 rounded-[2rem] border border-[var(--border)] bg-white/88 px-6 py-8 shadow-[0_24px_90px_rgba(8,47,73,0.08)] md:px-8">
          <div className="space-y-6">
            <div>
              <label
                htmlFor="publication-title"
                className="text-sm font-semibold text-[#111827]"
              >
                Título <span className="text-[#DC2626]">*</span>
              </label>
              <input
                id="publication-title"
                type="text"
                value={form.title}
                onChange={(event) => setForm({ ...form, title: event.target.value })}
                placeholder="Ex.: A importância da coleta seletiva"
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="publication-slug"
                className="text-sm font-semibold text-[#111827]"
              >
                Slug (endereço) <span className="font-normal text-[var(--muted)]">— opcional, gerado automaticamente se vazio</span>
              </label>
              <input
                id="publication-slug"
                type="text"
                value={form.slug}
                onChange={(event) => setForm({ ...form, slug: event.target.value })}
                placeholder="importancia-da-coleta-seletiva"
                className={`${inputClass} font-mono`}
              />
              {slugWillChange ? (
                <p className="mt-2 text-xs font-medium text-[#B45309]">
                  Alterar o slug mudará o endereço público desta publicação — mas só depois de
                  publicar. Até lá, o endereço atual (<span className="font-mono">{publication?.slug}</span>) continua
                  funcionando.
                </p>
              ) : (
                <p className="mt-2 text-xs text-[var(--muted)]">
                  Endereço público atual: <span className="font-mono">{publication?.slug ?? '—'}</span>
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="publication-summary"
                className="text-sm font-semibold text-[#111827]"
              >
                Resumo <span className="font-normal text-[var(--muted)]">— opcional</span>
              </label>
              <textarea
                id="publication-summary"
                value={form.summary}
                onChange={(event) => setForm({ ...form, summary: event.target.value })}
                placeholder="Breve descrição exibida nos cards da página pública."
                rows={3}
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="publication-content"
                className="text-sm font-semibold text-[#111827]"
              >
                Conteúdo <span className="text-[#DC2626]">*</span>
              </label>
              <textarea
                id="publication-content"
                value={form.content}
                onChange={(event) => setForm({ ...form, content: event.target.value })}
                placeholder="Escreva o conteúdo completo da publicação. Parágrafos e quebras de linha são preservados."
                rows={14}
                className={`${inputClass} min-h-[320px] resize-y leading-relaxed`}
              />
            </div>

            <div>
              <label
                htmlFor="publication-cover"
                className="text-sm font-semibold text-[#111827]"
              >
                URL/caminho da imagem de capa <span className="font-normal text-[var(--muted)]">— opcional</span>
              </label>
              <input
                id="publication-cover"
                type="text"
                value={form.coverImage}
                onChange={(event) => setForm({ ...form, coverImage: event.target.value })}
                placeholder="https://… ou /images/…"
                className={inputClass}
              />
              <p className="mt-2 text-xs text-[var(--muted)]">
                Upload de imagens ainda não está disponível; informe a URL ou caminho da imagem.
              </p>
            </div>

            <div className="flex flex-col gap-3 border-t border-[var(--border)] pt-6 sm:flex-row">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => void handleSave()}
                className={isPublished && hasPendingChanges ? draftButton : secondaryButton}
              >
                {isSubmitting
                  ? 'Salvando…'
                  : isPublished
                    ? hasPendingChanges
                      ? 'Salvar rascunho'
                      : 'Salvar alterações'
                    : 'Salvar como rascunho'}
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => void handlePreview()}
                className={secondaryButton}
              >
                Visualizar preview
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => void handlePublish()}
                className={primaryButton}
              >
                {isSubmitting
                  ? 'Salvando…'
                  : isPublished
                    ? 'Publicar alterações'
                    : 'Publicar'}
              </button>
            </div>

            {(hasPendingChanges || (isPublished && isEditing)) && (
              <div className="flex flex-col gap-3 sm:flex-row">
                {hasPendingChanges && (
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => void handleDiscard()}
                    className={dangerButton}
                  >
                    Descartar alterações
                  </button>
                )}

                {isPublished && (
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => void handleUnpublish()}
                    className={dangerButton}
                  >
                    Despublicar
                  </button>
                )}
              </div>
            )}

            <p className="text-xs text-[var(--muted)]">
              {isPublished ? (
                <>
                  Salvar <span className="font-semibold">não publica</span>: as mudanças ficam
                  pendentes até você clicar em <span className="font-semibold">Publicar alterações</span>.
                  {!hasPendingChanges && ' No momento o site mostra exatamente esta versão.'}
                </>
              ) : (
                <>
                  Enquanto estiver como rascunho, esta publicação não aparece no site público.
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
