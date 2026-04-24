import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { Eye, EyeOff, Loader2, LogIn } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

const EMAIL_NOT_VERIFIED = 'EMAIL_NOT_VERIFIED'

function friendlyLoginError(err: unknown): string {
  const msg = err instanceof Error ? err.message : ''
  if (msg === 'email_not_verified') return EMAIL_NOT_VERIFIED
  if (msg.includes('user_invalid_credentials') || msg.includes('Invalid credentials')) return 'Invalid email or password.'
  if (msg.includes('user_not_found')) return 'No account found with this email.'
  if (msg.includes('user_blocked')) return 'Your account has been blocked. Contact support.'
  if (msg.includes('rate_limit') || msg.includes('too_many')) return 'Too many attempts. Please try again later.'
  if (msg.includes('fetch') || msg.includes('network') || msg.includes('Failed to fetch')) return 'Connection failed. Check your internet and try again.'
  return 'Login failed. Please check your credentials.'
}

export default function UserLogin() {
  const { login, isAdmin, user, loading: authLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 size={32} className="animate-spin text-[#FF5400]" />
      </div>
    )
  }

  if (user) return <Navigate to={isAdmin ? '/admin/dashboard' : '/'} replace />

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(email, password)
    } catch (err: unknown) {
      setError(friendlyLoginError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
            <div className="text-center mb-8">
              <div className="inline-flex w-14 h-14 bg-[#FF5400]/10 text-[#FF5400] rounded-2xl items-center justify-center mb-4">
                <LogIn size={24} />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
              <p className="text-gray-500 text-sm mt-1">Sign in to your DriveHub account</p>
            </div>

            {error === EMAIL_NOT_VERIFIED ? (
              <div className="mb-5 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
                <p className="font-semibold mb-1">Email not verified</p>
                <p>We've resent a verification link to your inbox. Click it to activate your account, then sign in here.</p>
                <p className="mt-2 text-xs text-amber-600">Don't see the email? Check your spam folder.</p>
              </div>
            ) : error ? (
              <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5400] focus:border-transparent"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <Link to="/forgot-password" className="text-xs text-[#FF5400] hover:underline font-medium">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 pr-11 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5400] focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#FF5400] hover:bg-[#e04a00] disabled:opacity-60 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-colors mt-2"
              >
                {loading ? <><Loader2 size={16} className="animate-spin" /> Signing in…</> : 'Sign In'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="text-[#FF5400] font-semibold hover:underline">
                Register free
              </Link>
            </p>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
