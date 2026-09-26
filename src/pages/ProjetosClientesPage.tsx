import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { InstitutionalImage as InstitutionalImageConfig } from '../content/homeImages'
import { homeImages } from '../content/homeImages'
import type { ProjetosTimelineContent } from '../components/sections/ProjetosTimeline'
import { ProjetosTimeline } from '../components/sections/ProjetosTimeline'
import { AnimatedTitle } from '../components/ui/AnimatedTitle'
import { InstitutionalImage } from '../components/ui/InstitutionalImage'
import { Section } from '../components/ui/Section'

/**
 * Conteudo da pagina de Projetos vindo do CMS (draft_data de `projetos`).
 *
 * Sem `content`, a pagina usa os arquivos estaticos exatamente como hoje.
 * A imagem do cabecalho e o subtitulo do bloco CTA NAO existem no CMS — permanecem
 * estaticos, preservando a composicao real da pagina.
 */
export interface ProjetosPageContent {
  heading: string
  subheading: string
  ctaTitle: string
  ctaLabel: string
  timeline: ProjetosTimelineContent
  headerImage?: InstitutionalImageConfig
}

interface ProjetosClientesPageProps {
  content?: ProjetosPageContent
}

export function ProjetosClientesPage({ content }: ProjetosClientesPageProps) {
  const heading = content?.heading ?? 'Projetos'
  const subheading =
    content?.subheading ??
    'Conheça iniciativas, experiências e conexões construídas a partir da atuação da Eu Quero Liberdade.'
  const ctaTitle = content?.ctaTitle ?? 'Quer construir um projeto com a gente?'
  const ctaLabel = content?.ctaLabel ?? 'Fale com a gente'
  const headerImage = content?.headerImage ?? homeImages.impact

  return (
    <>
      {/* Cabeçalho institucional */}
      <Section id="projetos" className="bg-[#F7F3E8]">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <AnimatedTitle as="h1" className="text-4xl font-semibold tracking-normal text-[#111827] md:text-5xl">
              {heading}
            </AnimatedTitle>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#374151] md:text-lg">
              {subheading}
            </p>
          </div>

          <InstitutionalImage
            image={headerImage}
            figureClassName="relative aspect-[16/10] overflow-hidden rounded-lg border border-[#D9E2D0] bg-[#082F49] shadow-[0_20px_48px_-34px_rgba(15,23,42,0.45)]"
            imgClassName="transition duration-300 hover:scale-[1.015]"
          />
        </div>
      </Section>

      {/* Projetos reaproveitados do conteúdo existente */}
      <ProjetosTimeline content={content?.timeline} />

      {/* CTA final */}
      <Section id="projetos-cta" className="bg-[#FBF8EF]">
        <div className="flex flex-col items-start gap-5 rounded-lg border border-[#F2B705]/40 bg-gradient-to-br from-white to-[#FBF8EF] p-6 shadow-sm md:flex-row md:items-center md:justify-between md:p-8">
          <div>
            <h2 className="text-2xl font-bold leading-tight text-[#14532D] md:text-3xl">
              {ctaTitle}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#374151] md:text-base">
              Vamos conversar sobre território, resíduos e responsabilidade compartilhada.
            </p>
          </div>

          <Link
            to="/contato"
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-[#14532D] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#166534]"
          >
            {ctaLabel}
            <ArrowRight size={16} />
          </Link>
        </div>
      </Section>
    </>
  )
}
