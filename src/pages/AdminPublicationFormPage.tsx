import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ApiError,
  createPublication,
  getAdminPublication,
  updatePublication,
  type Publication,
  type PublicationStatus,
} from '../lib/api'

function friendlyMessage(error: unknown): string {
  if (error instanceof ApiError) {
    switch (error.code) {
      case 'slug_already_exists':
        return 'Já existe uma publicação com esse endereço (slug). Escolha outro ou deixe em branco para gerar automaticamente.'
      case 'validation_error':
        return 'Verifique os campos obrigatórios: título e conteúdo.'
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

export function AdminPublicationFormPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEditing = id !== undefined

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [summary, setSummary] = useState('')
  const [content, setContent] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [status, setStatus] = useState<PublicationStatus>('draft')

  const [isLoading, setIsLoading] = useState(isEditing)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!isEditing) return

    let active = true

    getAdminPublication(id as string)
      .then((publication: Publication) => {
        if (!active) return
        setTitle(publication.title)
        setSlug(publication.slug)
        setSummary(publication.summary ?? '')
        setContent(publication.content)
        setCoverImage(publication.cover_image ?? '')
        setStatus(publication.status)
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
  }, [id, isEditing])

  async function handleSubmit(nextStatus: PublicationStatus) {
    setError(null)
    setIsSubmitting(true)

    const payload = {
      title: title.trim(),
      slug: slug.trim() || undefined,
      summary: summary.trim(),
      content,
      cover_image: coverImage.trim() || undefined,
      status: nextStatus,
    }

    try {
      if (isEditing) {
        await updatePublication(id as string, payload)
      } else {
        await createPublication(payload)
      }

      navigate('/admin/publicacoes', {
        state: {
          notice: isEditing
            ? 'Publicação atualizada.'
            : 'Publicação criada.',
        },
      })
    } catch (reason: unknown) {
      setError(friendlyMessage(reason))
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputClass =
    'mt-2 w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-base text-[#111827] outline-none transition focus:border-[#D97706] focus:ring-2 focus:ring-[#D97706]/25'

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

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#f7f3e8_0%,_#ffffff_52%,_#eef5ee_100%)] px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/admin/publicacoes"
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

        {error && (
          <div className="mt-6 rounded-2xl border border-[#DC2626]/25 bg-[#DC2626]/8 px-5 py-4 text-sm font-medium text-[#991B1B]">
            {error}
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
                value={title}
                onChange={(event) => setTitle(event.target.value)}
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
                value={slug}
                onChange={(event) => setSlug(event.target.value)}
                placeholder="importancia-da-coleta-seletiva"
                className={`${inputClass} font-mono`}
              />
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
                value={summary}
                onChange={(event) => setSummary(event.target.value)}
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
                value={content}
                onChange={(event) => setContent(event.target.value)}
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
                value={coverImage}
                onChange={(event) => setCoverImage(event.target.value)}
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
                onClick={() => void handleSubmit('draft')}
                className="inline-flex flex-1 items-center justify-center rounded-full border border-[#D97706]/40 bg-[#D97706]/10 px-6 py-3 text-sm font-semibold text-[#B45309] transition hover:bg-[#D97706]/20 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting
                  ? 'Salvando…'
                  : status === 'published' && isEditing
                    ? 'Voltar para rascunho'
                    : 'Salvar como rascunho'}
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => void handleSubmit('published')}
                className="inline-flex flex-1 items-center justify-center rounded-full bg-[linear-gradient(135deg,_#0F3A5F,_#14532D)] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_40px_rgba(8,47,73,0.2)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting
                  ? 'Salvando…'
                  : status === 'published' && isEditing
                    ? 'Salvar alterações (publicado)'
                    : 'Publicar'}
              </button>
            </div>

            {isEditing && (
              <p className="text-xs text-[var(--muted)]">
                Status atual:{' '}
                <span className="font-semibold text-[#111827]">
                  {status === 'published' ? 'Publicado' : 'Rascunho'}
                </span>
                . Publicações com status Rascunho não aparecem na página pública.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
