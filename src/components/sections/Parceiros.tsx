import { siteContent } from '../../content/site'
import { AnimatedTitle } from '../ui/AnimatedTitle'
import { Section } from '../ui/Section'

export function Parceiros() {
  return (
    <Section id="parceiros" className="bg-[#FBF8EF]">
      <AnimatedTitle as="h2" className="text-3xl font-semibold tracking-normal text-[#111827] md:text-4xl">
        {siteContent.parceiros.title}
      </AnimatedTitle>

      <div className="mt-8 grid gap-3.5 sm:grid-cols-2 md:gap-4">
        {siteContent.parceiros.itens.map((item) => (
          <article key={item} className="rounded-lg border border-[#D9E2D0] bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#D97706]/45 hover:shadow-md">
            <p className="text-sm font-medium leading-relaxed text-[#374151]">{item}</p>
          </article>
        ))}
      </div>
    </Section>
  )
}
