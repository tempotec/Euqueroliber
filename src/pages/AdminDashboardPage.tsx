import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export function AdminDashboardPage() {
  const navigate = useNavigate()
  const { logout, user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleLogout() {
    setIsSubmitting(true)

    try {
      await logout()
      navigate('/admin/login', { replace: true })
    } finally {
      setIsSubmitting(false)
    }
  }

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `inline-flex items-center rounded-full px-5 py-2.5 text-sm font-semibold transition ${
      isActive
        ? 'bg-white/18 text-white'
        : 'text-white/70 hover:bg-white/10 hover:text-white'
    }`

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#f7f3e8_0%,_#ffffff_52%,_#eef5ee_100%)] px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-[2rem] border border-white/70 bg-[linear-gradient(135deg,_rgba(15,58,95,0.98),_rgba(20,83,45,0.94))] px-8 py-10 text-white shadow-[0_28px_110px_rgba(8,47,73,0.16)] md:px-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-[#F2B705]">
                Painel Administrativo
              </p>
              <h1 className="mt-4 text-4xl font-semibold">
                Bem-vindo, {user?.email}
              </h1>
            </div>

            <button
              className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/18 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={isSubmitting}
              onClick={() => void handleLogout()}
              type="button"
            >
              {isSubmitting ? 'Saindo...' : 'Sair'}
            </button>
          </div>

          <nav className="mt-8 flex flex-wrap items-center gap-2 border-t border-white/15 pt-6">
            <NavLink to="/admin" end className={navLinkClass}>
              Painel
            </NavLink>
            <NavLink to="/admin/publicacoes" className={navLinkClass}>
              Publicações
            </NavLink>
          </nav>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-[2rem] border border-[var(--border)] bg-white/88 px-8 py-8 shadow-[0_24px_90px_rgba(8,47,73,0.08)]">
            <p className="text-sm uppercase tracking-[0.22em] text-[var(--amber)]">
              Painel
            </p>
            <h2 className="mt-4 text-2xl font-semibold text-[var(--blue-deep)]">
              Visão geral
            </h2>
            <p className="mt-3 max-w-2xl text-base text-[var(--muted)]">
              Área central do gerenciamento de conteúdo. A partir daqui você
              acessa as publicações do site.
            </p>
          </div>

          <div className="rounded-[2rem] border border-[var(--border)] bg-white/88 px-8 py-8 shadow-[0_24px_90px_rgba(8,47,73,0.08)]">
            <p className="text-sm uppercase tracking-[0.22em] text-[var(--amber)]">
              Publicações
            </p>
            <h2 className="mt-4 text-2xl font-semibold text-[var(--blue-deep)]">
              Gerencie os conteúdos
            </h2>
            <p className="mt-3 max-w-2xl text-base text-[var(--muted)]">
              Crie rascunhos, publique ou remova artigos e materiais exibidos
              na página pública.
            </p>
            <NavLink
              to="/admin/publicacoes"
              className="mt-5 inline-flex items-center justify-center rounded-full bg-[linear-gradient(135deg,_#0F3A5F,_#14532D)] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Acessar Publicações
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  )
}
