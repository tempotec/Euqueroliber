import { NavLink } from 'react-router-dom'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `inline-flex items-center rounded-full px-5 py-2.5 text-sm font-semibold transition ${
    isActive ? 'bg-white/18 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
  }`

const NAV_ITEMS = [
  { to: '/admin', label: 'Painel', end: true },
  { to: '/admin/conteudo', label: 'Conteúdo do site', end: false },
  { to: '/admin/publicacoes', label: 'Publicações', end: false },
]

export function AdminNav() {
  return (
    <nav className="flex flex-wrap items-center gap-2" aria-label="Navegação administrativa">
      {NAV_ITEMS.map((item) => (
        <NavLink key={item.to} to={item.to} end={item.end} className={navLinkClass}>
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}
