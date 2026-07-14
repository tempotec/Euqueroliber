import { impactoContent } from '../../content/impacto'
import { AnimatedTitle } from '../ui/AnimatedTitle'
import { InstitutionalImage } from '../ui/InstitutionalImage'
import { Section } from '../ui/Section'

export function Impacto() {
  return (
    <Section id="impacto" className="bg-[#F7F3E8]">
      <AnimatedTitle as="h2" className="text-3xl font-semibold tracking-normal text-[#111827] md:text-4xl">
        {impactoContent.title}
      </AnimatedTitle>

      <div className="mt-8 grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-stretch">
        <InstitutionalImage
          image={impactoContent.image}
          figureClassName="relative aspect-[4/3] overflow-hidden rounded-lg border border-[#D9E2D0] bg-[#082F49] shadow-[0_20px_48px_-34px_rgba(15,23,42,0.45)] lg:aspect-[5/4]"
          imgClassName="transition duration-300 hover:scale-[1.015]"
        />

        <div className="grid gap-3.5">
          {impactoContent.cards.map((item) => (
            <article key={item.title} className="rounded-lg border border-[#D9E2D0] bg-gradient-to-br from-white to-[#FBF8EF] p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#D97706]/55 hover:shadow-md md:p-6">
              <h3 className="text-lg font-bold leading-snug text-[#0F3A5F] md:text-xl">{item.title}</h3>
              <p className="mt-3 text-sm font-medium leading-relaxed text-[#374151] md:text-base">{item.description}</p>
            </article>
          ))}
          <p className="rounded-lg border border-[#F2B705]/35 bg-[#F2B705]/15 p-5 text-sm font-medium leading-relaxed text-[#111827] md:text-base">{impactoContent.contexto}</p>
        </div>
      </div>
    </Section>
  )
}
