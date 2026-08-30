import { createContext, useContext } from 'react'
import type { AdminUser } from '../lib/api'

export type AuthContextValue = {
  error: string | null
  isAuthenticated: boolean
  isLoading: boolean
  user: AdminUser | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshAuth: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}
