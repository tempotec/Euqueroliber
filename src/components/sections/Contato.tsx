import { type FormEvent, useMemo, useState } from 'react'
import { homeImages } from '../../content/homeImages'
import { siteContent } from '../../content/site'
import { AnimatedTitle } from '../ui/AnimatedTitle'
import { InstitutionalImage } from '../ui/InstitutionalImage'
import { Section } from '../ui/Section'

const prototypeNotice = 'Este prot\u00f3tipo ainda n\u00e3o envia dados. A integra\u00e7\u00e3o de contato ser\u00e1 definida em uma pr\u00f3xima etapa.'

export function Contato() {
  const [perfil, setPerfil] = useState(siteContent.contato.perfis[0].value)
  const [notice, setNotice] = useState('')

  const supportText = useMemo(() => {
    return siteContent.contato.perfis.find((item) => item.value === perfil)?.support ?? ''
  }, [perfil])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget
    if (!form.reportValidity()) {
      return
    }

    setNotice(prototypeNotice)
  }

  return (
    <Section id="contato" className="bg-[#F7F3E8]">
      <AnimatedTitle as="h2" className="text-3xl font-semibold tracking-normal text-[#111827] md:text-4xl">
        {siteContent.contato.title}
      </AnimatedTitle>
      <p className="mt-3 max-w-3xl text-pretty text-[1.03rem] leading-relaxed text-[#374151] md:text-lg">{siteContent.contato.subtitle}</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[0.84fr_1.16fr] lg:items-start">
        <InstitutionalImage
          image={homeImages.territory}
          figureClassName="relative aspect-[4/3] overflow-hidden rounded-lg border border-[#D9E2D0] bg-[#082F49] shadow-[0_20px_48px_-34px_rgba(15,23,42,0.45)] lg:aspect-[5/4]"
          imgClassName="transition duration-300 hover:scale-[1.015]"
        />

        <form className="rounded-lg border border-[#D9E2D0] bg-white p-5 shadow-sm md:p-6" onSubmit={handleSubmit} noValidate={false}>
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#0F3A5F]">{siteContent.contato.formTitle}</p>

          <label className="mt-4 block text-sm font-semibold text-[#111827]" htmlFor="perfil">
            Perfil
          </label>
          <select
            id="perfil"
            name="perfil"
            className="mt-2 w-full rounded-lg border border-[#D9E2D0] bg-white px-3 py-2.5 text-sm shadow-sm transition focus:border-[#D97706]"
            value={perfil}
            onChange={(event) => {
              setPerfil(event.target.value)
              setNotice('')
            }}
          >
            {siteContent.contato.perfis.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>

          <p className="mt-3 rounded-lg border border-[#F2B705]/35 bg-[#F2B705]/15 p-3 text-sm leading-relaxed text-[#111827]">{supportText}</p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-[#111827]" htmlFor="contato-nome">
              Nome
              <input
                id="contato-nome"
                name="nome"
                type="text"
                autoComplete="name"
                required
                className="mt-2 w-full rounded-lg border border-[#D9E2D0] bg-white px-3 py-2.5 text-sm font-normal shadow-sm transition focus:border-[#D97706]"
              />
            </label>

            <label className="block text-sm font-semibold text-[#111827]" htmlFor="contato-email">
              E-mail
              <input
                id="contato-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-2 w-full rounded-lg border border-[#D9E2D0] bg-white px-3 py-2.5 text-sm font-normal shadow-sm transition focus:border-[#D97706]"
              />
            </label>

            <label className="block text-sm font-semibold text-[#111827] sm:col-span-2" htmlFor="contato-organizacao">
              {'Organiza\u00e7\u00e3o'}
              <input
                id="contato-organizacao"
                name="organizacao"
                type="text"
                autoComplete="organization"
                className="mt-2 w-full rounded-lg border border-[#D9E2D0] bg-white px-3 py-2.5 text-sm font-normal shadow-sm transition focus:border-[#D97706]"
              />
            </label>

            <label className="block text-sm font-semibold text-[#111827] sm:col-span-2" htmlFor="contato-mensagem">
              Como podemos ajudar?
              <textarea
                id="contato-mensagem"
                name="mensagem"
                rows={4}
                required
                className="mt-2 w-full rounded-lg border border-[#D9E2D0] bg-white px-3 py-2.5 text-sm font-normal shadow-sm transition focus:border-[#D97706]"
              />
            </label>
          </div>

          {notice && (
            <p id="contato-status" role="status" className="mt-4 rounded-lg border border-[#0F3A5F]/20 bg-[#0F3A5F]/8 p-3 text-sm font-medium leading-relaxed text-[#0F3A5F]">
              {notice}
            </p>
          )}

          <button
            type="submit"
            className="mt-5 w-full rounded-lg bg-[#166534] px-4 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_-18px_rgba(4,120,87,0.9)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#14532D]"
          >
            {siteContent.contato.ctaLabel}
          </button>
        </form>
      </div>
    </Section>
  )
}
