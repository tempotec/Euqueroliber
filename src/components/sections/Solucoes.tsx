import {
  CalendarRange,
  Leaf,
  Lightbulb,
  Recycle,
  Trash2,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { solucoesContent } from '../../content/solucoes'
import { InstitutionalImage } from '../ui/InstitutionalImage'
import { Section } from '../ui/Section'

const iconMap: Record<string, LucideIcon> = {
  Leaf,
  Recycle,
  Trash2,
  CalendarRange,
  Users,
  Lightbulb,
}

type SolutionItem = (typeof solucoesContent)[number]

type SolutionCardProps = {
  item: SolutionItem
  index: number
}

function SolutionCard({ item, index }: SolutionCardProps) {
  const Icon = iconMap[item.icon] ?? Recycle
  const featured = index === 1

  return (
    <article
      className={[
        'group overflow-hidden rounded-lg border border-[#D9E2D0] bg-white shadow-[0_16px_38px_-32px_rgba(15,23,42,0.58)] transition duration-200 hover:-translate-y-0.5 hover:border-[#D97706]/55 hover:shadow-[0_22px_46px_-34px_rgba(4,120,87,0.45)]',
        featured ? 'md:col-span-2 lg:grid lg:grid-cols-[1fr_0.92fr] lg:items-stretch' : '',
      ].filter(Boolean).join(' ')}
    >
      <InstitutionalImage
        image={item.image}
        figureClassName="relative aspect-[16/10] overflow-hidden bg-[#082F49]"
        imgClassName="transition duration-300 group-hover:scale-[1.025]"
      />

      <div className="flex h-full min-h-[12.5rem] flex-col p-5 md:p-6">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-[#14532D] text-white ring-1 ring-[#14532D]/20 transition group-hover:bg-[#F2B705] group-hover:text-[#111827] group-hover:ring-[#F2B705]">
          <Icon size={20} />
        </span>
        <h3 className="mt-4 text-lg font-bold leading-snug text-[#14532D]">{item.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-[#374151] md:text-[0.95rem]">{item.description}</p>
      </div>
    </article>
  )
}

export function Solucoes() {
  return (
    <Section id="solucoes" className="bg-[#F7F3E8]">
      <h2 className="text-balance text-3xl font-semibold tracking-normal text-[#111827] md:text-4xl">
        {'Solu\u00e7\u00f5es'}
      </h2>

      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:gap-6">
        {solucoesContent.map((item, index) => (
          <SolutionCard key={item.title} item={item} index={index} />
        ))}
      </div>
    </Section>
  )
}
