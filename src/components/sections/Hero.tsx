import { ChevronDown } from 'lucide-react'
import { homeImages } from '../../content/homeImages'
import { siteContent } from '../../content/site'
import { InstitutionalImage } from '../ui/InstitutionalImage'

export function Hero() {
  return (
    <section id="topo" className="relative isolate overflow-hidden border-b border-[#D97706]/30 bg-[linear-gradient(135deg,#082F49_0%,#0F3A5F_46%,#14532D_100%)] px-5 pb-14 pt-8 md:px-8 md:pb-16 md:pt-12 lg:pb-20 lg:pt-16">
      <div className="relative mx-auto grid w-full max-w-6xl gap-8 md:gap-10 lg:min-h-[34rem] lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:gap-14">
        <div className="relative z-10 max-w-[39rem] lg:py-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#F2B705]">{siteContent.brand}</p>
          <p className="mb-5 inline-flex rounded-md border border-[#F2B705]/45 bg-[#F2B705] px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#111827] shadow-sm">
            Reciclagem com impacto humano
          </p>
          <h1 className="max-w-[11.4em] text-pretty text-[2.45rem] font-bold leading-[1.02] tracking-normal text-white sm:text-[3rem] md:text-[3.6rem] lg:text-[4.25rem]">
            {siteContent.hero.title}
          </h1>
          <p className="mt-5 max-w-[36rem] text-[1.03rem] leading-relaxed text-[#F7F3E8]/90 md:text-lg lg:text-[1.08rem]">
            {siteContent.hero.subtitle}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href={siteContent.hero.ctas[0].href}
              className="inline-flex items-center justify-center rounded-lg bg-[#F2B705] px-5 py-3 text-sm font-semibold text-[#111827] shadow-[0_14px_26px_-18px_rgba(0,0,0,0.9)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#D97706] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2B705]"
            >
              {siteContent.hero.ctas[0].label}
            </a>
            <a
              href={siteContent.hero.ctas[1].href}
              className="inline-flex items-center justify-center rounded-lg border border-[#F7F3E8]/35 bg-white/10 px-5 py-3 text-sm font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#F2B705] hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2B705]"
            >
              {siteContent.hero.ctas[1].label}
            </a>
          </div>
        </div>

        <InstitutionalImage
          image={homeImages.hero}
          figureClassName="relative overflow-hidden rounded-lg border border-[#F2B705]/30 bg-[#082F49] shadow-[0_34px_80px_-45px_rgba(0,0,0,0.9)] aspect-[4/3] sm:aspect-[16/10] lg:aspect-auto lg:min-h-[34rem]"
          imgClassName="lg:min-h-[34rem]"
        />
      </div>

      <a href="#quem-somos" className="absolute bottom-4 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#F7F3E8]/75 transition hover:text-[#F2B705]">
        Continue
        <ChevronDown size={14} />
      </a>
    </section>
  )
}
