import { homeImages } from '../../content/homeImages'
import { siteContent } from '../../content/site'
import { AnimatedTitle } from '../ui/AnimatedTitle'
import { InstitutionalImage } from '../ui/InstitutionalImage'
import { Section } from '../ui/Section'

export function Diferenciais() {
  return (
    <Section id="diferenciais" className="bg-[linear-gradient(135deg,#082F49_0%,#14532D_100%)] text-white">
      <AnimatedTitle as="h2" className="text-3xl font-semibold tracking-normal text-white md:text-4xl">
        {siteContent.diferenciais.title}
      </AnimatedTitle>

      <div className="mt-8 grid gap-5 lg:grid-cols-[0.92fr_1.08fr] lg:items-stretch">
        <InstitutionalImage
          image={homeImages.manifesto}
          figureClassName="relative aspect-[4/3] overflow-hidden rounded-lg border border-[#F2B705]/25 bg-[#082F49] shadow-[0_24px_54px_-36px_rgba(0,0,0,0.8)] lg:aspect-[5/4]"
          imgClassName="transition duration-300 hover:scale-[1.015]"
        />

        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1">
          {siteContent.diferenciais.frases.map((frase) => (
            <blockquote
              key={frase}
              className="rounded-lg border border-[#F2B705]/25 bg-white/[0.07] p-5 text-base leading-relaxed text-[#F7F3E8] shadow-[0_18px_40px_-30px_rgba(15,23,42,0.8)] backdrop-blur-sm md:p-6 md:text-lg"
            >
              {frase}
            </blockquote>
          ))}
        </div>
      </div>
    </Section>
  )
}
