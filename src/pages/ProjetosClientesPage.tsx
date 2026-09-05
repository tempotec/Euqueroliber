import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { clientes } from '../content/clientes'
import { parceiros } from '../content/parceiros'
import { homeImages } from '../content/homeImages'
import { ProjetosTimeline } from '../components/sections/ProjetosTimeline'
import { AnimatedTitle } from '../components/ui/AnimatedTitle'
import { InstitutionalImage } from '../components/ui/InstitutionalImage'
import { Section } from '../components/ui/Section'

export function ProjetosClientesPage() {
  return (
    <>
      {/* Cabeçalho institucional */}
      <Section id="projetos-clientes" className="bg-[#F7F3E8]">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <AnimatedTitle as="h1" className="text-4xl font-semibold tracking-normal text-[#111827] md:text-5xl">
              Projetos e Clientes
            </AnimatedTitle>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#374151] md:text-lg">
              Conheça iniciativas, experiências e conexões construídas a partir da atuação da Eu Quero Liberdade.
            </p>
          </div>

          <InstitutionalImage
            image={homeImages.impact}
            figureClassName="relative aspect-[16/10] overflow-hidden rounded-lg border border-[#D9E2D0] bg-[#082F49] shadow-[0_20px_48px_-34px_rgba(15,23,42,0.45)]"
            imgClassName="transition duration-300 hover:scale-[1.015]"
          />
        </div>
      </Section>

      {/* Projetos reaproveitados do conteúdo existente */}
      <ProjetosTimeline />

      {/* Clientes */}
      <Section id="clientes" className="bg-[#F7F3E8]">
        <div className="max-w-3xl">
          <AnimatedTitle as="h2" className="text-3xl font-semibold tracking-normal text-[#111827] md:text-4xl">
            Clientes
          </AnimatedTitle>

          {clientes.length === 0 ? (
            <p className="mt-4 text-base leading-relaxed text-[#374151] md:text-lg">
              Esta área reunirá organizações e iniciativas que construíram projetos conosco.
            </p>
          ) : (
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {clientes.map((cliente) => (
                <li
                  key={cliente.name}
                  className="flex items-center gap-4 rounded-lg border border-[#D9E2D0] bg-white p-4 shadow-sm"
                >
                  {cliente.logo ? (
                    <img
                      src={cliente.logo}
                      alt={`Logotipo de ${cliente.name}`}
                      className="h-12 w-12 shrink-0 rounded-md object-contain"
                      loading="lazy"
                    />
                  ) : (
                    <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-[#082F49] text-sm font-bold text-white">
                      {cliente.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                  <div>
                    <h3 className="text-base font-bold leading-snug text-[#14532D]">{cliente.name}</h3>
                    {cliente.description ? (
                      <p className="mt-1 text-sm leading-relaxed text-[#374151]">{cliente.description}</p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Section>

      {/* Parceiros */}
      <Section id="parceiros" className="bg-[#FBF8EF]">
        <div className="max-w-4xl">
          <AnimatedTitle as="h2" className="text-3xl font-semibold tracking-normal text-[#111827] md:text-4xl">
            Parceiros
          </AnimatedTitle>

          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#374151] md:text-lg">
            Construímos nossa atuação em rede, conectando organizações, iniciativas e parceiros que contribuem para ampliar conhecimento, estrutura e capacidade de realização.
          </p>

          <ul className="mt-8 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            {parceiros.map((parceiro) => (
              <li
                key={parceiro.name}
                className="flex items-center gap-3.5 rounded-lg border border-[#D9E2D0] bg-white p-4 shadow-sm"
              >
                {parceiro.logo ? (
                  <img
                    src={parceiro.logo}
                    alt={`Logotipo de ${parceiro.name}`}
                    className="h-11 w-11 shrink-0 rounded-md object-contain"
                    loading="lazy"
                  />
                ) : (
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-[#0F3A5F] text-xs font-bold uppercase text-white">
                    {parceiro.name.charAt(0)}
                  </span>
                )}
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-bold leading-snug text-[#14532D]">{parceiro.name}</h3>
                  {parceiro.description ? (
                    <p className="mt-1 text-sm leading-relaxed text-[#374151]">{parceiro.description}</p>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* CTA final */}
      <Section id="projetos-cta" className="bg-[#FBF8EF]">
        <div className="flex flex-col items-start gap-5 rounded-lg border border-[#F2B705]/40 bg-gradient-to-br from-white to-[#FBF8EF] p-6 shadow-sm md:flex-row md:items-center md:justify-between md:p-8">
          <div>
            <h2 className="text-2xl font-bold leading-tight text-[#14532D] md:text-3xl">
              Quer construir um projeto com a gente?
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#374151] md:text-base">
              Vamos conversar sobre território, resíduos e responsabilidade compartilhada.
            </p>
          </div>

          <Link
            to="/contato"
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-[#14532D] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#166534]"
          >
            Fale com a gente
            <ArrowRight size={16} />
          </Link>
        </div>
      </Section>
    </>
  )
}
