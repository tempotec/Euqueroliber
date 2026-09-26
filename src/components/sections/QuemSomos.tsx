import type { Widen } from '../../lib/widen'
import type { InstitutionalImage as InstitutionalImageConfig } from '../../content/homeImages'
import { homeImages } from '../../content/homeImages'
import { quemSomosContent } from '../../content/quemSomos'
import { AnimatedTitle } from '../ui/AnimatedTitle'
import { InstitutionalImage } from '../ui/InstitutionalImage'
import { Section } from '../ui/Section'

/**
 * Conteudo de Quem Somos vindo do CMS (draft_data de `quem_somos`).
 * Sem `content`, o componente usa quemSomos.ts + homeImages.ts (comportamento atual).
 *
 * Observacao: o draft do CMS tambem possui `lead` e `marcos` no nivel raiz, mas o
 * componente publico atual NAO renderiza esses campos — o preview tambem nao os exibe
 * (nao inventamos visual que o site real nao tem).
 */
export interface QuemSomosSectionContent {
  title: string
  opening: string
  image: InstitutionalImageConfig
  historia: Widen<typeof quemSomosContent.historia>
  atuacao: Widen<typeof quemSomosContent.atuacao>
}

interface QuemSomosProps {
  content?: QuemSomosSectionContent
}

export function QuemSomos({ content }: QuemSomosProps) {
  const title = content?.title ?? 'Quem Somos'
  const opening = content?.opening ?? quemSomosContent.opening
  const image = content?.image ?? homeImages.aboutRobson
  const historia = content?.historia ?? quemSomosContent.historia
  const atuacao = content?.atuacao ?? quemSomosContent.atuacao

  return (
    <>
      {/* Abertura institucional */}
      <Section id="quem-somos" className="bg-[#F7F3E8] !py-10 lg:!py-12">
        <AnimatedTitle as="h1" className="text-4xl font-semibold tracking-normal text-[#111827] md:text-5xl">
          {title}
        </AnimatedTitle>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-[#374151] md:text-lg">
          {opening}
        </p>
      </Section>

      {/* História — Robinho Liberdade */}
      <Section id="historia" className="bg-[#FBF8EF] !py-10 lg:!py-12">
        <div className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr] lg:items-start lg:gap-8">
          <InstitutionalImage
            image={image}
            figureClassName="relative aspect-[4/3] overflow-hidden rounded-lg border border-[#D9E2D0] bg-white shadow-sm"
          />

          <div className="space-y-5">
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#D97706]">
                Origem da história
              </p>
              <h2 className="mt-3 text-balance text-3xl font-semibold tracking-normal text-[#111827] md:text-4xl">
                {historia.nome}
              </h2>
              <p className="mt-1 text-base font-semibold text-[#0F3A5F]">{historia.nomePublico}</p>
            </div>

            <div className="space-y-4">
              {historia.paragrafos.map((paragrafo) => (
                <p key={paragrafo} className="text-pretty leading-relaxed text-[#374151] md:text-lg">
                  {paragrafo}
                </p>
              ))}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {historia.marcos.map((marco) => (
                <article
                  key={marco.ano}
                  className="rounded-lg border border-[#D9E2D0] bg-white p-4 shadow-sm"
                >
                  <p className="text-lg font-semibold text-[#14532D]">{marco.ano}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#374151]">{marco.texto}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Da trajetória à atuação */}
      <Section id="atuacao" className="bg-[#F7F3E8] !pt-8 !pb-12 lg:!pt-10 lg:!pb-14">
        <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-start lg:gap-8">
          <div>
            <AnimatedTitle as="h2" className="text-3xl font-semibold tracking-normal text-[#111827] md:text-4xl">
              {atuacao.titulo}
            </AnimatedTitle>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#374151] md:text-lg">
              {atuacao.paragrafo}
            </p>
          </div>

          <ul className="grid gap-3 sm:grid-cols-2">
            {atuacao.temas.map((tema) => (
              <li
                key={tema}
                className="flex items-start gap-2 rounded-lg border border-[#D9E2D0] bg-white p-4 text-sm font-medium leading-relaxed text-[#374151] shadow-sm"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#F2B705]" />
                <span>{tema}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>
    </>
  )
}
