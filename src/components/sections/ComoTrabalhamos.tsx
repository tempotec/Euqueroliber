import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef } from 'react'
import { homeImages } from '../../content/homeImages'
import { siteContent } from '../../content/site'
import { AnimatedTitle } from '../ui/AnimatedTitle'
import { InstitutionalImage } from '../ui/InstitutionalImage'
import { Section } from '../ui/Section'

gsap.registerPlugin(ScrollTrigger)

export function ComoTrabalhamos() {
  const cardsRef = useRef<Array<HTMLDivElement | null>>([])

  useEffect(() => {
    const cards = cardsRef.current.filter(Boolean)

    if (cards.length === 0) {
      return
    }

    const tween = gsap.fromTo(
      cards,
      { autoAlpha: 0, y: 18 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.45,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: cards[0],
          start: 'top 78%',
          once: true,
        },
      },
    )

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [])

  return (
    <Section id="como-trabalhamos" className="bg-[linear-gradient(180deg,#F7F3E8_0%,#FBF8EF_100%)]">
      <AnimatedTitle as="h2" className="text-3xl font-semibold tracking-normal text-[#111827] md:text-4xl">
        {siteContent.processo.title}
      </AnimatedTitle>

      <div className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch">
        <InstitutionalImage
          image={homeImages.process}
          figureClassName="relative aspect-[4/3] overflow-hidden rounded-lg border border-[#D9E2D0] bg-[#082F49] shadow-[0_22px_50px_-36px_rgba(15,23,42,0.45)] lg:aspect-[5/4]"
          imgClassName="transition duration-300 hover:scale-[1.015]"
        />

        <div className="grid gap-3.5">
          {siteContent.processo.steps.map((step, index) => (
            <div
              key={step}
              ref={(el) => {
                cardsRef.current[index] = el
              }}
              className="rounded-lg border border-[#D9E2D0] bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#D97706]/45 hover:shadow-md md:p-5"
            >
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#0F3A5F]">Etapa {index + 1}</p>
              <p className="mt-1 text-sm font-semibold leading-relaxed text-[#111827] md:text-base">{step}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}
