import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { error, isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6 text-center">
        <div className="max-w-sm rounded-[2rem] border border-[var(--border)] bg-white/90 px-8 py-10 shadow-[0_25px_80px_rgba(8,47,73,0.08)]">
          <p className="text-sm uppercase tracking-[0.22em] text-[var(--amber)]">Autenticacao</p>
          <h1 className="mt-4 text-2xl font-semibold text-[var(--blue-deep)]">Validando sessao</h1>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6 text-center">
        <div className="max-w-md rounded-[2rem] border border-[var(--border)] bg-white/90 px-8 py-10 shadow-[0_25px_80px_rgba(8,47,73,0.08)]">
          <p className="text-sm uppercase tracking-[0.22em] text-[var(--amber)]">Servidor</p>
          <h1 className="mt-4 text-2xl font-semibold text-[var(--blue-deep)]">{error}</h1>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  return <>{children}</>
}
