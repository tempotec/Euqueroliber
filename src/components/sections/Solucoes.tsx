import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Leaf, Recycle, Users, X, type LucideIcon } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { solucoesContent, type SolutionContent } from '../../content/solucoes'
import { InstitutionalImage } from '../ui/InstitutionalImage'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'

const iconMap: Record<string, LucideIcon> = {
  Leaf,
  Recycle,
  Users,
}

const sectionHeadingClass = 'text-sm font-semibold uppercase tracking-[0.12em] text-[#D97706]'

type SolutionCardProps = {
  item: SolutionContent
  onOpen: (item: SolutionContent) => void
}

function SolutionCard({ item, onOpen }: SolutionCardProps) {
  const Icon = iconMap[item.icon] ?? Recycle

  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      className="group flex h-full w-full flex-col overflow-hidden rounded-lg border border-[#D9E2D0] bg-white text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#D97706]/45 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D97706] focus-visible:ring-offset-2"
    >
      <InstitutionalImage
        image={item.image}
        figureClassName="relative aspect-[16/10] overflow-hidden bg-[#082F49]"
        imgClassName="transition duration-300 group-hover:scale-[1.025]"
      />

      <div className="flex h-full min-h-[13rem] flex-col p-5 md:p-6">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-[#14532D] text-white ring-1 ring-[#14532D]/20 transition group-hover:bg-[#F2B705] group-hover:text-[#111827] group-hover:ring-[#F2B705]">
          <Icon size={20} />
        </span>
        <h3 className="mt-4 text-lg font-bold leading-snug text-[#14532D]">{item.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-[#374151] md:text-[0.95rem]">{item.description}</p>

        <span className="mt-auto inline-flex items-center gap-2 pt-4 text-sm font-semibold text-[#0F3A5F] transition group-hover:text-[#D97706]">
          Conhecer solução
          <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
        </span>
      </div>
    </button>
  )
}

type SolutionModalProps = {
  item: SolutionContent
  onClose: () => void
}

function SolutionModal({ item, onClose }: SolutionModalProps) {
  const Icon = iconMap[item.icon] ?? Recycle
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)
  const isInstitutional = Boolean(item.impactoSocial)

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    },
    [onClose],
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [handleKeyDown])

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[#111827]/55 p-3 backdrop-blur-sm sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="solution-modal-title"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className="relative flex max-h-[90dvh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-[#D9E2D0] bg-[#FBF8EF] shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Fechar solução"
          className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#111827]/80 text-white shadow transition hover:bg-[#111827] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2B705] focus-visible:ring-offset-2"
        >
          <X size={18} />
        </button>

        <div className="overflow-y-auto overscroll-contain">
          <div className="relative">
            <InstitutionalImage
              image={item.image}
              figureClassName="relative aspect-[16/8] overflow-hidden bg-[#082F49] sm:aspect-[16/7]"
              imgClassName="opacity-95"
            />
          </div>

          <div className="px-5 py-6 md:px-8 md:py-8">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-[#14532D] text-white ring-1 ring-[#14532D]/20">
              <Icon size={20} />
            </span>
            <h2 id="solution-modal-title" className="mt-4 text-2xl font-bold leading-tight text-[#14532D] md:text-3xl">
              {item.title}
            </h2>
            <p className="mt-2 text-pretty text-base font-medium leading-relaxed text-[#0F3A5F] md:text-lg">
              {item.subtitle}
            </p>

            {isInstitutional && <h3 className={`${sectionHeadingClass} mt-6`}>Introdução</h3>}
            <div className={isInstitutional ? 'mt-3 space-y-3' : 'mt-5 space-y-3'}>
              {item.intro.map((paragraph) => (
                <p key={paragraph} className="text-pretty text-[0.98rem] leading-relaxed text-[#374151] md:text-[1.02rem]">
                  {paragraph}
                </p>
              ))}
            </div>

            {isInstitutional ? (
              <>
                <div className="mt-6">
                  <h3 className={sectionHeadingClass}>Como atuamos</h3>
                  {item.actingIntro && (
                    <p className="mt-3 text-pretty text-[0.98rem] leading-relaxed text-[#374151] md:text-[1.02rem]">
                      {item.actingIntro}
                    </p>
                  )}
                  <ul className="mt-3 grid gap-x-6 gap-y-2 md:grid-cols-2">
                    {item.actions.map((action) => (
                      <li key={action} className="flex items-start gap-2 text-[0.95rem] leading-relaxed text-[#374151]">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#F2B705]" aria-hidden="true" />
                        {action}
                      </li>
                    ))}
                  </ul>
                  {item.actingNote && (
                    <p className="mt-3 text-pretty text-[0.98rem] leading-relaxed text-[#374151] md:text-[1.02rem]">
                      {item.actingNote}
                    </p>
                  )}
                </div>

                <InstitutionalImage
                  image={item.detailImage}
                  figureClassName="relative mt-6 aspect-[16/8] overflow-hidden rounded-lg border border-[#D9E2D0] bg-[#082F49] shadow-sm"
                />

                <div className="mt-8 border-t border-[#D9E2D0] pt-6">
                  <h3 className={sectionHeadingClass}>Gestão ambiental com impacto social</h3>
                  <div className="mt-3 space-y-3">
                    {item.impactoSocial?.map((paragraph) => (
                      <p key={paragraph} className="text-pretty text-[0.98rem] leading-relaxed text-[#374151] md:text-[1.02rem]">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className={sectionHeadingClass}>Do problema à solução</h3>
                  <div className="mt-3 space-y-3">
                    {item.problemaSolucao?.map((paragraph) => (
                      <p key={paragraph} className="text-pretty text-[0.98rem] leading-relaxed text-[#374151] md:text-[1.02rem]">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>

                {item.cta && (
                  <div className="mt-8 rounded-xl bg-[#14532D] p-5 md:p-6">
                    <p className="text-pretty text-base font-medium leading-relaxed text-white md:text-lg">{item.cta}</p>
                  </div>
                )}
              </>
            ) : (
              <div className="mt-6 grid gap-6 md:grid-cols-[1.05fr_0.95fr] md:items-start">
                <div>
                  <h3 className={sectionHeadingClass}>Como atuamos</h3>
                  <ul className="mt-3 space-y-2">
                    {item.actions.map((action) => (
                      <li key={action} className="flex items-start gap-2 text-[0.95rem] leading-relaxed text-[#374151]">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#F2B705]" aria-hidden="true" />
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
                <InstitutionalImage
                  image={item.detailImage}
                  figureClassName="relative aspect-[4/3] overflow-hidden rounded-lg border border-[#D9E2D0] bg-[#082F49] shadow-sm"
                />
              </div>
            )}

            <div className="mt-8 flex flex-col gap-3 border-t border-[#D9E2D0] pt-6 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center rounded-md border border-[#D9E2D0] bg-white px-4 py-2.5 text-sm font-semibold text-[#374151] transition hover:border-[#D97706]/50 hover:text-[#111827] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D97706] focus-visible:ring-offset-2"
              >
                Voltar para Soluções
              </button>
              <Link
                to="/contato"
                onClick={onClose}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-[#14532D] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#166534] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D97706] focus-visible:ring-offset-2"
              >
                Fale com a gente
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export function Solucoes() {
  const [active, setActive] = useState<SolutionContent | null>(null)
  const triggerRef = useRef<HTMLElement | null>(null)

  const open = useCallback((item: SolutionContent) => {
    triggerRef.current = document.activeElement as HTMLElement | null
    setActive(item)
  }, [])

  const close = useCallback(() => {
    setActive(null)
    window.setTimeout(() => {
      triggerRef.current?.focus()
    }, 0)
  }, [])

  return (
    <Section id="solucoes" className="bg-[#F7F3E8]">
      <Reveal>
        <h2 className="text-balance text-3xl font-semibold tracking-normal text-[#111827] md:text-4xl">Soluções</h2>
        <p className="mt-3 max-w-3xl text-pretty text-[1.03rem] leading-relaxed text-[#374151] md:text-lg">
          Atuamos em três frentes que se complementam: cuidar dos resíduos, educar para transformar e gerar valor com a
          economia circular.
        </p>
      </Reveal>

      <div className="mt-8 grid gap-5 md:grid-cols-3 lg:gap-6">
        {solucoesContent.map((item) => (
          <SolutionCard key={item.title} item={item} onOpen={open} />
        ))}
      </div>

      <AnimatePresence>{active && <SolutionModal key={active.title} item={active} onClose={close} />}</AnimatePresence>
    </Section>
  )
}
