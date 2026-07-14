import { homeImages } from '../../content/homeImages'
import { siteContent } from '../../content/site'
import { InstitutionalImage } from '../ui/InstitutionalImage'
import { Section } from '../ui/Section'

export function QuemSomos() {
  return (
    <Section id="quem-somos" className="bg-[#F7F3E8]">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-12">
        <InstitutionalImage
          image={homeImages.aboutRobson}
          figureClassName="relative overflow-hidden rounded-lg border border-[#D9E2D0] bg-white shadow-[0_26px_60px_-40px_rgba(15,23,42,0.55)] aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/4.65]"
          imgClassName="lg:min-h-[32rem]"
        />

        <div className="space-y-5">
          <div>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#D97706]">Origem da história</p>
            <h2 className="mt-3 text-balance text-3xl font-semibold tracking-normal text-[#111827] md:text-4xl">{siteContent.quemSomos.title}</h2>
            <p className="mt-5 max-w-2xl text-pretty text-lg font-semibold leading-relaxed text-[#111827] md:text-xl">
              {siteContent.quemSomos.lead}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {siteContent.quemSomos.marcos.map((marco) => (
              <article key={marco.title} className="rounded-lg border border-[#D9E2D0] bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#D97706]/45 hover:shadow-md">
                <p className="text-lg font-semibold text-[#14532D]">{marco.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-[#374151]">{marco.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}
