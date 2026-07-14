import { Menu, Recycle } from 'lucide-react'
import { useState } from 'react'
import { siteContent } from '../../content/site'

const headerNav = [
  { label: 'Quem Somos', href: '#quem-somos' },
  { label: 'Soluções', href: '#solucoes' },
  { label: 'Projetos', href: '#projetos' },
  { label: 'Impacto', href: '#impacto' },
  { label: 'Contato', href: '#contato' },
]

export function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-[#D9E2D0] bg-[#F7F3E8]/95 shadow-[0_8px_28px_-24px_rgba(15,23,42,0.65)] backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-3 md:px-8 lg:py-3.5">
        <a href="#topo" className="inline-flex items-center gap-2 text-[#111827]">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#14532D] text-white shadow-sm">
            <Recycle size={18} />
          </span>
          <span className="text-xs font-semibold uppercase tracking-[0.14em] sm:text-sm">{siteContent.brand}</span>
        </a>

        <button
          type="button"
          className="inline-flex rounded-lg border border-[#D9E2D0] bg-white p-2 text-[#0F3A5F] shadow-sm transition hover:border-[#D97706] hover:text-[#D97706] md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Abrir menu"
        >
          <Menu size={18} />
        </button>

        <nav className="hidden items-center gap-3 md:flex lg:gap-4">
          {headerNav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-md px-1 py-0.5 text-[0.82rem] font-semibold text-[#374151] transition hover:text-[#166534] lg:text-sm"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>

      {open && (
        <nav className="border-t border-[#D9E2D0] bg-[#F7F3E8] px-5 py-3 shadow-lg md:hidden">
          <ul className="space-y-2">
            {headerNav.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="block rounded-lg px-2 py-2 text-sm text-[#111827] hover:bg-[#F2B705]/15" onClick={() => setOpen(false)}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}
