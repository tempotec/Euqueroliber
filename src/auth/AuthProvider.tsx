import { useEffect, useState } from 'react'
import { ApiError, type AdminUser, fetchCurrentAdminUser, loginAdmin, logoutAdmin } from '../lib/api'
import { AuthContext } from './AuthContext'

function getFriendlyErrorMessage(error: unknown) {
  if (error instanceof ApiError) {
    if (error.code === 'invalid_credentials') {
      return 'Nao foi possivel entrar. Verifique suas credenciais.'
    }

    if (error.code === 'server_unavailable') {
      return 'Nao foi possivel conectar ao servidor.'
    }
  }

  return 'Nao foi possivel concluir a autenticacao.'
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function refreshAuth(options?: { keepLoadingState?: boolean }) {
    if (!options?.keepLoadingState) {
      setIsLoading(true)
    }

    try {
      const response = await fetchCurrentAdminUser()
      setUser(response.user)
      setError(null)
    } catch (caughtError) {
      if (caughtError instanceof ApiError && caughtError.status === 401) {
        setUser(null)
        setError(null)
      } else {
        setUser(null)
        setError(getFriendlyErrorMessage(caughtError))
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    let isCancelled = false

    async function loadInitialAuthState() {
      try {
        const response = await fetchCurrentAdminUser()

        if (!isCancelled) {
          setUser(response.user)
          setError(null)
        }
      } catch (caughtError) {
        if (isCancelled) {
          return
        }

        if (caughtError instanceof ApiError && caughtError.status === 401) {
          setUser(null)
          setError(null)
        } else {
          setUser(null)
          setError(getFriendlyErrorMessage(caughtError))
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    void loadInitialAuthState()

    return () => {
      isCancelled = true
    }
  }, [])

  async function login(email: string, password: string) {
    const response = await loginAdmin(email, password)
    setUser(response.user)
    setError(null)
  }

  async function logout() {
    try {
      await logoutAdmin()
    } finally {
      setUser(null)
      setError(null)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        error,
        isAuthenticated: user !== null,
        isLoading,
        user,
        login,
        logout,
        refreshAuth: () => refreshAuth(),
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
