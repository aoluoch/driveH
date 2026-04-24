import { useState } from 'react'
import { Link } from 'react-router-dom'
import { KeyRound, Loader2, Mail } from 'lucide-react'
import { createPasswordRecovery } from '../lib/auth'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

function friendlyError(err: unknown): string {
  const msg = err instanceof Error ? err.message : ''
  if (msg.includes('user_not_found')) return 'No account found with that email address.'
  if (msg.includes('rate_limit') || msg.includes('too_many')) return 'Too many requests. Please wait a few minutes and try again.'
  if (msg.includes('fetch') || msg.includes('network') || msg.includes('Failed to fetch')) return 'Connection failed. Check your internet and try again.'
  return 'Something went wrong. Please try again.'
}

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setError(null)
    setLoading(true)
    try {
      await createPasswordRecovery(email.trim())
      setSent(true)
    } catch (err: unknown) {
      setError(friendlyError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">

            {sent ? (
              <div className="text-center">
                <div className="inline-flex w-16 h-16 bg-green-100 text-green-500 rounded-full items-center justify-center mb-5">
                  <Mail size={28} />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Check your inbox</h1>
                <p className="text-gray-500 text-sm mt-2">We sent a password reset link to</p>
                <p className="font-semibold text-gray-900 text-sm mt-1 mb-4">{email}</p>
                <p className="text-gray-400 text-xs mb-6">
                  Click the link to set a new password. The link expires in 1 hour. Check your spam folder if you don't see it.
                </p>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF5400] hover:bg-[#e04a00] text-white font-bold rounded-xl text-sm transition-colors"
                >
                  Back to Sign In
                </Link>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <div className="inline-flex w-14 h-14 bg-[#FF5400]/10 text-[#FF5400] rounded-2xl items-center justify-center mb-4">
                    <KeyRound size={24} />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900">Forgot your password?</h1>
                  <p className="text-gray-500 text-sm mt-1">
                    Enter your email and we'll send you a reset link.
                  </p>
                </div>

                {error && (
                  <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                    {error}
                  </div>
                )}

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

                  <button
                    type="submit"
                    disabled={loading || !email.trim()}
                    className="w-full py-3.5 bg-[#FF5400] hover:bg-[#e04a00] disabled:opacity-60 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-colors mt-2"
                  >
                    {loading ? <><Loader2 size={16} className="animate-spin" /> Sending…</> : 'Send Reset Link'}
                  </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-6">
                  Remember your password?{' '}
                  <Link to="/login" className="text-[#FF5400] font-semibold hover:underline">
                    Sign in
                  </Link>
                </p>
              </>
            )}

          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
