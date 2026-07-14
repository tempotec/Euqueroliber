import { homeImages } from '../../content/homeImages'
import { siteContent } from '../../content/site'
import { AnimatedTitle } from '../ui/AnimatedTitle'
import { InstitutionalImage } from '../ui/InstitutionalImage'
import { Section } from '../ui/Section'

export function Proposito() {
  return (
    <Section id="proposito" className="bg-[#FBF8EF]">
      <AnimatedTitle as="h2" className="text-3xl font-semibold tracking-normal text-[#111827] md:text-4xl">
        {siteContent.proposito.title}
      </AnimatedTitle>
      <p className="mt-3 max-w-3xl text-pretty text-[1.03rem] leading-relaxed text-[#374151] md:text-lg">{siteContent.proposito.subtitle}</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
        <InstitutionalImage
          image={homeImages.purpose}
          figureClassName="relative aspect-[4/3] overflow-hidden rounded-lg border border-[#D9E2D0] bg-[#082F49] shadow-[0_20px_48px_-34px_rgba(15,23,42,0.45)] lg:aspect-[5/4]"
          imgClassName="transition duration-300 hover:scale-[1.015]"
        />

        <div className="space-y-3">
          {siteContent.proposito.pares.map(([from, to]) => (
            <article key={from} className="flex flex-col gap-2 rounded-lg border border-[#D9E2D0] bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#D97706]/45 hover:shadow-md sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-medium text-[#374151]">{from}</p>
              <span className="text-[0.68rem] uppercase tracking-[0.14em] text-[#D97706]">se torna</span>
              <p className="text-sm font-semibold text-[#14532D]">{to}</p>
            </article>
          ))}
        </div>
      </div>
    </Section>
  )
}
