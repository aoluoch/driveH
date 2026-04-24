import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { getCurrentUser, checkIsAdmin, loginUser, logoutUser, registerUser, type AppUser } from '../lib/auth'

interface AuthContextValue {
  user: AppUser | null
  isAdmin: boolean
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCurrentUser().then((u) => {
      setUser(u)
      setLoading(false)
    })
  }, [])

  async function login(email: string, password: string) {
    const u = await loginUser(email, password)
    setUser(u)
  }

  async function register(name: string, email: string, password: string) {
    await registerUser(name, email, password)
    // No session is created after registration — user must verify email first
  }

  async function logout() {
    await logoutUser()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{ user, isAdmin: checkIsAdmin(user), loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
