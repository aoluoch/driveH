import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { getCurrentUser, checkIsAdmin, loginAdmin, logoutAdmin, registerUser, type AppUser } from '../lib/auth'

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
    const u = await loginAdmin(email, password)
    setUser(u)
  }

  async function register(name: string, email: string, password: string) {
    const u = await registerUser(name, email, password)
    setUser(u)
  }

  async function logout() {
    await logoutAdmin()
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

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
