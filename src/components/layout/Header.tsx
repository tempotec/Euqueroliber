import { Menu, Recycle } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { siteContent } from '../../content/site'

const headerNav = [
  { label: 'Home', to: '/' },
  { label: 'Quem Somos', to: '/quem-somos' },
  { label: 'Solu\u00e7\u00f5es', to: '/solucoes' },
  { label: 'Projetos', to: '/projetos' },
  { label: 'Parceiros', to: '/parceiros' },
  { label: 'Publica\u00e7\u00f5es', to: '/publicacoes' },
  { label: 'Contato', to: '/contato' },
]

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `relative rounded-md px-1 py-0.5 text-[0.82rem] font-semibold transition lg:text-sm ${isActive ? 'text-[#14532D] after:absolute after:inset-x-0 after:-bottom-1 after:h-[3px] after:rounded-full after:bg-[#F2B705]' : 'text-[#374151] hover:text-[#166534] hover:after:absolute hover:after:inset-x-0 hover:after:-bottom-1 hover:after:h-[3px] hover:after:rounded-full hover:after:bg-[#D97706]/50'}`

export function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-[#D9E2D0] bg-[#F7F3E8]/95 shadow-[0_8px_28px_-24px_rgba(15,23,42,0.65)] backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-3 md:px-8 lg:py-3.5">
        <Link to="/" className="inline-flex items-center gap-2 text-[#111827]" onClick={() => setOpen(false)}>
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#14532D] text-white shadow-sm"><Recycle size={18} /></span>
          <span className="text-xs font-semibold uppercase tracking-[0.14em] sm:text-sm">{siteContent.brand}</span>
        </Link>

        <button type="button" className="inline-flex rounded-lg border border-[#D9E2D0] bg-white p-2 text-[#0F3A5F] shadow-sm transition hover:border-[#D97706] hover:text-[#D97706] md:hidden" onClick={() => setOpen((value) => !value)} aria-label={open ? 'Fechar menu' : 'Abrir menu'} aria-expanded={open}>
          <Menu size={18} />
        </button>

        <nav className="hidden items-center gap-3 md:flex lg:gap-4" aria-label="Navegação principal">
          {headerNav.map((item) => <NavLink key={item.to} to={item.to} className={linkClass} end={item.to === '/'}>{item.label}</NavLink>)}
        </nav>
      </div>

      {open && (
        <nav className="border-t border-[#D9E2D0] bg-[#F7F3E8] px-5 py-3 shadow-lg md:hidden" aria-label="Navegação mobile">
          <ul className="space-y-2">
            {headerNav.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} end={item.to === '/'} className={({ isActive }) => `block rounded-lg border-l-4 px-3 py-2 text-sm transition ${isActive ? 'border-[#F2B705] bg-[#F2B705]/15 font-semibold text-[#14532D]' : 'border-transparent text-[#111827] hover:bg-[#F2B705]/15'}`} onClick={() => setOpen(false)}>{item.label}</NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}
