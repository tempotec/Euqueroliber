import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { ApiError } from '../lib/api'

function getLoginErrorMessage(error: unknown) {
  if (error instanceof ApiError) {
    if (error.code === 'invalid_credentials') {
      return 'Nao foi possivel entrar. Verifique suas credenciais.'
    }

    if (error.code === 'server_unavailable') {
      return 'Nao foi possivel conectar ao servidor.'
    }
  }

  return 'Nao foi possivel concluir o login.'
}

export function AdminLoginPage() {
  const navigate = useNavigate()
  const { isAuthenticated, isLoading, login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      await login(email, password)
      navigate('/admin', { replace: true })
    } catch (caughtError) {
      setError(getLoginErrorMessage(caughtError))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isLoading && isAuthenticated) {
    return <Navigate to="/admin" replace />
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(242,183,5,0.24),_transparent_38%),linear-gradient(180deg,_#f7f3e8_0%,_#fffef9_52%,_#eef5ee_100%)] px-6 py-12">
      <div className="absolute inset-x-0 top-0 h-56 bg-[linear-gradient(135deg,rgba(8,47,73,0.12),transparent_70%)]" />
      <div className="relative mx-auto flex min-h-[calc(100vh-6rem)] max-w-5xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 shadow-[0_35px_120px_rgba(8,47,73,0.14)] backdrop-blur md:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col justify-between bg-[linear-gradient(160deg,_#0f3a5f_0%,_#14532d_100%)] px-8 py-10 text-white md:px-12">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-[#F2B705]">Eu Quero Liberdade</p>
              <h1 className="mt-6 max-w-md text-4xl font-semibold leading-tight">Acesso administrativo</h1>
              <p className="mt-4 max-w-md text-base text-white/78">
                Esta area protege a base do futuro painel editorial sem expor controles no site publico.
              </p>
            </div>
            <p className="mt-12 text-sm text-white/64">Use suas credenciais para entrar e manter a sessao ativa neste navegador.</p>
          </div>

          <div className="px-8 py-10 md:px-10">
            <p className="text-sm uppercase tracking-[0.22em] text-[var(--amber)]">Login</p>
            <h2 className="mt-4 text-3xl font-semibold text-[var(--blue-deep)]">Entrar</h2>
            <p className="mt-3 text-sm text-[var(--muted)]">Sessao por cookie HttpOnly gerenciada pelo backend.</p>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[var(--blue-deep)]">E-mail</span>
                <input
                  autoComplete="username"
                  className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-base text-[var(--ink)] shadow-sm"
                  name="email"
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  type="email"
                  value={email}
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[var(--blue-deep)]">Senha</span>
                <input
                  autoComplete="current-password"
                  className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-base text-[var(--ink)] shadow-sm"
                  name="password"
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  type="password"
                  value={password}
                />
              </label>

              {error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              ) : null}

              <button
                className="inline-flex w-full items-center justify-center rounded-full bg-[var(--blue-deep)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--blue)] disabled:cursor-not-allowed disabled:opacity-70"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? 'Entrando...' : 'Entrar'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
