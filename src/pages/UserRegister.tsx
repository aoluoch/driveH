import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CheckCircle, Eye, EyeOff, Loader2, UserPlus } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

export default function UserRegister() {
  const { register, user } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (user) {
    navigate('/')
    return null
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    setError(null)
    setLoading(true)
    try {
      await register(name, email, password)
      navigate('/')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.')
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
            <div className="text-center mb-8">
              <div className="inline-flex w-14 h-14 bg-[#FF5400]/10 text-[#FF5400] rounded-2xl items-center justify-center mb-4">
                <UserPlus size={24} />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
              <p className="text-gray-500 text-sm mt-1">Join DriveHub and start browsing cars</p>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-1 gap-2 mb-6 p-4 bg-gray-50 rounded-xl">
              {[
                'Save your favourite cars',
                'Get notified on price drops',
                'Quick contact to sellers',
              ].map((benefit) => (
                <div key={benefit} className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle size={14} className="text-[#FF5400] flex-shrink-0" />
                  {benefit}
                </div>
              ))}
            </div>

            {error && (
              <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5400] focus:border-transparent"
                />
              </div>

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
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 8 characters"
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
                {password && (
                  <div className={`mt-1.5 text-xs font-medium ${password.length >= 8 ? 'text-green-600' : 'text-red-500'}`}>
                    {password.length >= 8 ? '✓ Strong enough' : `${8 - password.length} more characters needed`}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#FF5400] hover:bg-[#e04a00] disabled:opacity-60 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-colors mt-2"
              >
                {loading ? <><Loader2 size={16} className="animate-spin" /> Creating account…</> : 'Create Account'}
              </button>

              <p className="text-center text-xs text-gray-400">
                By registering, you agree to our{' '}
                <Link to="/" className="underline hover:text-gray-600">Terms of Service</Link>
                {' '}and{' '}
                <Link to="/" className="underline hover:text-gray-600">Privacy Policy</Link>.
              </p>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-[#FF5400] font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
