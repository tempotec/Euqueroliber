import { parceiros } from '../content/parceiros'
import { AnimatedTitle } from '../components/ui/AnimatedTitle'
import { Section } from '../components/ui/Section'

export function ParceirosPage() {
  return (
    <>
      <Section id="parceiros" className="bg-[#F7F3E8]">
        <div className="max-w-4xl">
          <AnimatedTitle as="h1" className="text-4xl font-semibold tracking-normal text-[#111827] md:text-5xl">
            Parceiros
          </AnimatedTitle>

          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#374151] md:text-lg">
            Construímos nossa atuação em rede, conectando organizações, iniciativas e parceiros que contribuem para ampliar conhecimento, estrutura e capacidade de realização.
          </p>

          <ul className="mt-8 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            {parceiros.map((parceiro) => (
              <li
                key={parceiro.name}
                className="flex items-center gap-4 rounded-lg border border-[#D9E2D0] bg-white p-4 shadow-sm"
              >
                <div className={`flex h-16 w-24 shrink-0 items-center justify-center rounded-md border border-[#E5E7EB] p-2 ${parceiro.name === 'Bizarte' ? 'bg-[#0B0B0B]' : 'bg-white'}`}>
                  {parceiro.logo ? (
                    <img
                      src={parceiro.logo}
                      alt={`Logotipo de ${parceiro.name}`}
                      className="max-h-full max-w-full object-contain"
                      loading="lazy"
                    />
                  ) : (
                    <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[#0F3A5F] text-sm font-bold uppercase text-white">
                      {parceiro.name.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold leading-snug text-[#14532D]">{parceiro.name}</h3>
                  {parceiro.description ? (
                    <p className="mt-1 text-sm leading-relaxed text-[#374151]">{parceiro.description}</p>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Section>
    </>
  )
}
