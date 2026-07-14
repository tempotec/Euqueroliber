import type { PropsWithChildren } from 'react'

type SectionProps = PropsWithChildren<{
  id: string
  title?: string
  subtitle?: string
  className?: string
}>

export function Section({ id, title, subtitle, className, children }: SectionProps) {
  return (
    <section id={id} className={`scroll-mt-20 px-5 py-12 md:px-8 md:py-16 lg:py-[4.5rem] ${className ?? ''}`}>
      <div className="mx-auto w-full max-w-6xl">
        {title && <h2 className="text-balance text-3xl font-semibold tracking-normal text-[var(--ink)] md:text-4xl">{title}</h2>}
        {subtitle && <p className="mt-3 max-w-3xl text-pretty text-[1.03rem] leading-relaxed text-[var(--muted)] md:text-lg">{subtitle}</p>}
        <div className={title || subtitle ? 'mt-8 md:mt-9' : ''}>{children}</div>
      </div>
    </section>
  )
}
