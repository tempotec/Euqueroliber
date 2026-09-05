import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { impactoContent } from '../../content/impacto'
import { AnimatedTitle } from '../ui/AnimatedTitle'
import { InstitutionalImage } from '../ui/InstitutionalImage'
import { Section } from '../ui/Section'

export function Impacto() {
  return (
    <>
      {/* Cabeçalho institucional */}
      <Section id="impacto" className="bg-[#F7F3E8]">
        <AnimatedTitle as="h1" className="text-4xl font-semibold tracking-normal text-[#111827] md:text-5xl">
          {impactoContent.title}
        </AnimatedTitle>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#374151] md:text-lg">
          {impactoContent.intro}
        </p>
      </Section>

      {/* Três pilares de impacto */}
      <Section id="impacto-pilares" className="bg-[#FBF8EF]">
        <div className="grid gap-6 lg:grid-cols-3 lg:items-stretch">
          {impactoContent.pilares.map((pilar) => (
            <article
              key={pilar.title}
              className="flex flex-col overflow-hidden rounded-lg border border-[#D9E2D0] bg-white shadow-sm"
            >
              <InstitutionalImage
                image={pilar.image}
                figureClassName="relative aspect-[16/10] overflow-hidden bg-[#082F49]"
                imgClassName="transition duration-300 hover:scale-[1.015]"
              />
              <div className="flex flex-1 flex-col p-6">
                <h2 className="text-xl font-bold leading-snug text-[#0F3A5F] md:text-2xl">{pilar.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-[#374151] md:text-base">{pilar.description}</p>
                <ul className="mt-4 space-y-2">
                  {pilar.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm leading-relaxed text-[#374151]">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#F2B705]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </Section>

      {/* Conexão entre os impactos */}
      <Section id="impacto-conexao" className="bg-[#F7F3E8]">
        <div className="mx-auto max-w-3xl text-center">
          <AnimatedTitle as="h2" className="text-3xl font-semibold tracking-normal text-[#111827] md:text-4xl">
            {impactoContent.conexao.title}
          </AnimatedTitle>
          <p className="mt-4 text-base leading-relaxed text-[#374151] md:text-lg">
            {impactoContent.conexao.description}
          </p>
        </div>
      </Section>

      {/* CTA final */}
      <Section id="impacto-cta" className="bg-[#FBF8EF]">
        <div className="flex flex-col items-start gap-5 rounded-lg border border-[#F2B705]/40 bg-gradient-to-br from-white to-[#FBF8EF] p-6 shadow-sm md:flex-row md:items-center md:justify-between md:p-8">
          <div>
            <h2 className="text-2xl font-bold leading-tight text-[#14532D] md:text-3xl">
              Quer gerar impacto junto com a gente?
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#374151] md:text-base">
              Vamos conversar sobre como transformar resíduos, trabalho e território em resultados compartilhados.
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
