import { type FormEvent, useState } from 'react'
import { homeImages } from '../../content/homeImages'
import { siteContent } from '../../content/site'
import { ApiError, sendContactMessage } from '../../lib/api'
import { AnimatedTitle } from '../ui/AnimatedTitle'
import { InstitutionalImage } from '../ui/InstitutionalImage'
import { Section } from '../ui/Section'

const SUBJECT_OPTIONS = [
  'Gestão de Resíduos',
  'Educação Ambiental',
  'Inclusão Produtiva e Economia Circular',
  'Projetos e Parcerias',
  'Outro',
] as const

type FormState = {
  name: string
  email: string
  organization: string
  phone: string
  subject: string
  message: string
  website: string
}

const EMPTY_FORM: FormState = {
  name: '',
  email: '',
  organization: '',
  phone: '',
  subject: SUBJECT_OPTIONS[0],
  message: '',
  website: '',
}

export function Contato() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  function updateField(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  function validate(): Record<string, string> {
    const errors: Record<string, string> = {}

    if (!form.name.trim()) {
      errors.name = 'Informe seu nome.'
    }

    if (!form.email.trim()) {
      errors.email = 'Informe seu e-mail.'
    } else if (form.email.indexOf('@') === -1 || form.email.indexOf('.', form.email.indexOf('@')) === -1) {
      errors.email = 'Informe um e-mail válido.'
    }

    if (!form.subject.trim()) {
      errors.subject = 'Escolha um assunto.'
    }

    if (!form.message.trim()) {
      errors.message = 'Escreva sua mensagem.'
    }

    return errors
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const errors = validate()
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      setStatus('error')
      setError('Confira os campos destacados e tente novamente.')
      return
    }

    setStatus('sending')
    setError('')

    try {
      await sendContactMessage({
        name: form.name,
        email: form.email,
        organization: form.organization || undefined,
        phone: form.phone || undefined,
        subject: form.subject,
        message: form.message,
        website: form.website,
      })

      setStatus('success')
      setFieldErrors({})
      setForm(EMPTY_FORM)
    } catch (err) {
      setStatus('error')

      if (err instanceof ApiError) {
        setError(err.message || 'Não foi possível enviar sua mensagem agora.')
      } else {
        setError('Não foi possível enviar sua mensagem agora. Tente novamente em instantes.')
      }
    }
  }

  const inputClass = (field?: string) =>
    `w-full rounded-lg border bg-white px-4 py-3 text-sm text-[#111827] outline-none transition placeholder:text-[#9CA3AF] focus:ring-2 ${
      field && fieldErrors[field]
        ? 'border-[#DC2626] focus:ring-[#DC2626]/30'
        : 'border-[#D9E2D0] focus:border-[#14532D] focus:ring-[#14532D]/20'
    }`

  return (
    <>
      <Section id="contato" className="bg-[#F7F3E8]">
        <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-12">
          <div>
            <AnimatedTitle as="h1" className="text-4xl font-semibold tracking-normal text-[#111827] md:text-5xl">
              {siteContent.contato.title}
            </AnimatedTitle>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#374151] md:text-lg">
              Quer desenvolver uma ação, projeto ou parceria? Conte um pouco sobre o que você precisa.
            </p>
          </div>

          <InstitutionalImage
            image={homeImages.territory}
            figureClassName="relative aspect-[16/10] overflow-hidden rounded-lg border border-[#D9E2D0] bg-white shadow-[0_24px_54px_-40px_rgba(15,23,42,0.5)]"
          />
        </div>
      </Section>

      <Section id="contato-form" className="bg-[#FBF8EF]">
        <form onSubmit={handleSubmit} noValidate className="mx-auto max-w-3xl">
          {/* Honeypot invisível — humanos não preenchem */}
          <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
            <label htmlFor="website">Não preencha este campo</label>
            <input
              id="website"
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={form.website}
              onChange={(e) => updateField('website', e.target.value)}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="nome" className="mb-1.5 block text-sm font-semibold text-[#14532D]">
                Nome <span className="text-[#DC2626]">*</span>
              </label>
              <input
                id="nome"
                type="text"
                className={inputClass('name')}
                placeholder="Seu nome"
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
              />
              {fieldErrors.name ? (
                <p className="mt-1.5 text-sm text-[#DC2626]">{fieldErrors.name}</p>
              ) : null}
            </div>

            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-[#14532D]">
                E-mail <span className="text-[#DC2626]">*</span>
              </label>
              <input
                id="email"
                type="email"
                className={inputClass('email')}
                placeholder="voce@exemplo.com"
                value={form.email}
                onChange={(e) => updateField('email', e.target.value)}
              />
              {fieldErrors.email ? (
                <p className="mt-1.5 text-sm text-[#DC2626]">{fieldErrors.email}</p>
              ) : null}
            </div>

            <div>
              <label htmlFor="organizacao" className="mb-1.5 block text-sm font-semibold text-[#14532D]">
                Organização <span className="font-normal text-[#6B7280]">(opcional)</span>
              </label>
              <input
                id="organizacao"
                type="text"
                className={inputClass()}
                placeholder="Empresa, escola, cooperativa..."
                value={form.organization}
                onChange={(e) => updateField('organization', e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="telefone" className="mb-1.5 block text-sm font-semibold text-[#14532D]">
                Telefone <span className="font-normal text-[#6B7280]">(opcional)</span>
              </label>
              <input
                id="telefone"
                type="tel"
                className={inputClass()}
                placeholder="(00) 00000-0000"
                value={form.phone}
                onChange={(e) => updateField('phone', e.target.value)}
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="assunto" className="mb-1.5 block text-sm font-semibold text-[#14532D]">
                Assunto <span className="text-[#DC2626]">*</span>
              </label>
              <select
                id="assunto"
                className={inputClass('subject')}
                value={form.subject}
                onChange={(e) => updateField('subject', e.target.value)}
              >
                {SUBJECT_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {fieldErrors.subject ? (
                <p className="mt-1.5 text-sm text-[#DC2626]">{fieldErrors.subject}</p>
              ) : null}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="mensagem" className="mb-1.5 block text-sm font-semibold text-[#14532D]">
                Mensagem <span className="text-[#DC2626]">*</span>
              </label>
              <textarea
                id="mensagem"
                rows={6}
                className={inputClass('message')}
                placeholder="Conte um pouco sobre o que você precisa..."
                value={form.message}
                onChange={(e) => updateField('message', e.target.value)}
              />
              {fieldErrors.message ? (
                <p className="mt-1.5 text-sm text-[#DC2626]">{fieldErrors.message}</p>
              ) : null}
            </div>
          </div>

          <div className="mt-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div aria-live="polite">
              {status === 'success' ? (
                <p className="text-sm font-semibold text-[#14532D]">
                  Mensagem enviada com sucesso. Obrigado pelo contato.
                </p>
              ) : null}
              {status === 'error' ? (
                <p className="text-sm font-semibold text-[#DC2626]">{error}</p>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={status === 'sending'}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#14532D] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#166534] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {status === 'sending' ? 'Enviando...' : siteContent.contato.ctaLabel}
            </button>
          </div>
        </form>
      </Section>
    </>
  )
}
