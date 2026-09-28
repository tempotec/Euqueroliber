import { useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import type { InstitutionalImage as InstitutionalImageConfig } from '../../content/homeImages'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { projetosContent } from '../../content/projetos'
import { InstitutionalImage } from '../ui/InstitutionalImage'
import { Section } from '../ui/Section'

/**
 * Item da timeline no formato que o componente consome.
 *
 * Declarado explicitamente (em vez de derivar do conteudo estatico) porque o CMS
 * alimenta o mesmo componente: o site guarda `loading` como literal e o tipo de imagem
 * esperado e `'lazy' | 'eager'`.
 */
export interface ProjetosTimelineItem {
  title: string
  description: string
  image: InstitutionalImageConfig
}

/**
 * Conteudo da timeline (draft_data de `projetos` ou `published_data` publicado).
 *
 * Os textos proprios DESTA secao (`heading`/`subheading`) sao distintos do titulo e
 * da introducao da pagina, por isso trafegam em `projetos.timeline`. Ambos sao
 * opcionais: sem eles o componente mantem os textos fixos originais.
 */
export interface ProjetosTimelineContent {
  heading?: string
  subheading?: string
  items: ProjetosTimelineItem[]
}

/**
 * Textos fixos originais desta secao — fallback quando o CMS nao fornece
 * `heading`/`subheading`. Preservados para manter o site atual identico.
 */
const TIMELINE_HEADING = 'Projetos'
const TIMELINE_SUBHEADING =
  'Frentes e experi\u00eancias de atua\u00e7\u00e3o que conectam reciclagem, educa\u00e7\u00e3o ambiental, mobiliza\u00e7\u00e3o territorial, eventos e fortalecimento de redes.'

interface ProjetosTimelineProps {
  content?: ProjetosTimelineContent
}

type ProjectCardProps = {
  projeto: ProjetosTimelineItem
  index: number
}

function ProjectCard({ projeto, index }: ProjectCardProps) {
  return (
    <article className="group relative min-w-[82%] flex-[0_0_82%] overflow-hidden rounded-lg border border-[#D9E2D0] bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#D97706]/45 hover:shadow-md sm:min-w-[48%] sm:flex-[0_0_48%] lg:min-w-[32%] lg:flex-[0_0_32%]">
      <InstitutionalImage
        image={projeto.image}
        figureClassName="relative aspect-[16/10] overflow-hidden bg-[#082F49]"
        imgClassName="transition duration-300 group-hover:scale-[1.025]"
      />

      <div className="min-h-[10.5rem] p-4 md:p-5">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[#0F3A5F]">Projeto {index + 1}</p>
        <h3 className="mt-2 text-base font-bold leading-snug text-[#14532D] md:text-lg">{projeto.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-[#374151]">{projeto.description}</p>
      </div>
    </article>
  )
}

export function ProjetosTimeline({ content }: ProjetosTimelineProps) {
  const items = content?.items ?? projetosContent
  const heading = content?.heading ?? TIMELINE_HEADING
  const subheading = content?.subheading ?? TIMELINE_SUBHEADING
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: false,
    dragFree: true,
  })

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  return (
    <Section id="projetos" className="bg-[#FBF8EF]">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-3xl">
          <h2 className="text-balance text-3xl font-semibold tracking-normal text-[#111827] md:text-4xl">
            {heading}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#374151] md:text-base">
            {subheading}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={scrollPrev}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#D9E2D0] bg-white text-[#0F3A5F] shadow-sm transition hover:border-[#D97706] hover:text-[#D97706]"
            aria-label="Voltar"
          >
            <ArrowLeft size={16} />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#D9E2D0] bg-white text-[#0F3A5F] shadow-sm transition hover:border-[#D97706] hover:text-[#D97706]"
            aria-label={'Avan\u00e7ar'}
          >
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <div className="relative mt-7 overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4 pb-2 pt-1">
          {items.map((projeto, index) => (
            <ProjectCard key={projeto.title} projeto={projeto} index={index} />
          ))}
        </div>
      </div>
    </Section>
  )
}
