import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle2, Eye, EyeOff, KeyRound, Loader2, XCircle } from 'lucide-react'
import { updatePasswordRecovery } from '../lib/auth'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

function getPasswordStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[a-z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  if (score <= 2) return { score, label: 'Weak', color: 'text-red-500' }
  if (score === 3) return { score, label: 'Fair', color: 'text-yellow-500' }
  if (score === 4) return { score, label: 'Good', color: 'text-blue-500' }
  return { score, label: 'Strong', color: 'text-green-600' }
}

function validatePassword(pw: string, confirm: string): Record<string, string> {
  const errors: Record<string, string> = {}
  if (!pw) {
    errors.password = 'Password is required.'
  } else if (pw.length < 8) {
    errors.password = 'Password must be at least 8 characters.'
  } else if (!/[A-Z]/.test(pw)) {
    errors.password = 'Password must contain at least one uppercase letter.'
  } else if (!/[a-z]/.test(pw)) {
    errors.password = 'Password must contain at least one lowercase letter.'
  } else if (!/[0-9]/.test(pw)) {
    errors.password = 'Password must contain at least one number.'
  } else if (!/[^A-Za-z0-9]/.test(pw)) {
    errors.password = 'Password must contain at least one special character (e.g. !@#$%).'
  }
  if (!confirm) {
    errors.confirm = 'Please confirm your new password.'
  } else if (pw !== confirm) {
    errors.confirm = 'Passwords do not match.'
  }
  return errors
}

function friendlyError(err: unknown): string {
  const msg = err instanceof Error ? err.message : ''
  if (msg.includes('user_invalid_token') || msg.includes('expired') || msg.includes('invalid')) {
    return 'This reset link has expired or already been used. Please request a new one.'
  }
  if (msg.includes('user_password_policy_violation')) return 'Password does not meet the requirements.'
  if (msg.includes('fetch') || msg.includes('network') || msg.includes('Failed to fetch')) return 'Connection failed. Check your internet and try again.'
  return 'Failed to reset password. Please try again.'
}

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const userId = searchParams.get('userId')
  const secret = searchParams.get('secret')
  const strength = getPasswordStrength(password)

  if (!userId || !secret) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
              <div className="inline-flex w-16 h-16 bg-red-100 text-red-500 rounded-full items-center justify-center mb-5">
                <XCircle size={32} />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Invalid Link</h1>
              <p className="text-gray-500 text-sm mt-2 mb-6">
                This password reset link is missing required information. Please request a new one.
              </p>
              <Link
                to="/forgot-password"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF5400] hover:bg-[#e04a00] text-white font-bold rounded-xl text-sm transition-colors"
              >
                Request New Link
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errors = validatePassword(password, confirm)
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return
    setSubmitError(null)
    setLoading(true)
    try {
      await updatePasswordRecovery(userId!, secret!, password)
      setSuccess(true)
    } catch (err: unknown) {
      setSubmitError(friendlyError(err))
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
              <div className="inline-flex w-16 h-16 bg-green-100 text-green-500 rounded-full items-center justify-center mb-5">
                <CheckCircle2 size={32} />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Password Reset!</h1>
              <p className="text-gray-500 text-sm mt-2 mb-6">
                Your password has been updated successfully. You can now sign in with your new password.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF5400] hover:bg-[#e04a00] text-white font-bold rounded-xl text-sm transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">

            <div className="text-center mb-8">
              <div className="inline-flex w-14 h-14 bg-[#FF5400]/10 text-[#FF5400] rounded-2xl items-center justify-center mb-4">
                <KeyRound size={24} />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Set a new password</h1>
              <p className="text-gray-500 text-sm mt-1">Choose a strong password for your account.</p>
            </div>

            {submitError && (
              <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                {submitError}
                {submitError.includes('expired') && (
                  <Link to="/forgot-password" className="block mt-2 font-semibold text-[#FF5400] hover:underline">
                    Request a new reset link →
                  </Link>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>

              {/* New password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">New password</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setFieldErrors((p) => ({ ...p, password: '' })) }}
                    placeholder="Min. 8 characters"
                    className={`w-full px-4 py-3 pr-11 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5400] focus:border-transparent ${fieldErrors.password ? 'border-red-400' : 'border-gray-200'}`}
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
                  <div className="mt-2 space-y-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-colors ${
                            i <= strength.score
                              ? strength.score <= 2 ? 'bg-red-400'
                                : strength.score === 3 ? 'bg-yellow-400'
                                : strength.score === 4 ? 'bg-blue-400'
                                : 'bg-green-500'
                              : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <p className={`text-xs font-medium ${strength.color}`}>
                      {strength.label} — needs uppercase, lowercase, number & special character
                    </p>
                  </div>
                )}
                {fieldErrors.password && <p className="mt-1 text-xs text-red-500">{fieldErrors.password}</p>}
              </div>

              {/* Confirm password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm new password</label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirm}
                    onChange={(e) => { setConfirm(e.target.value); setFieldErrors((p) => ({ ...p, confirm: '' })) }}
                    placeholder="Re-enter your new password"
                    className={`w-full px-4 py-3 pr-11 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5400] focus:border-transparent ${fieldErrors.confirm ? 'border-red-400' : 'border-gray-200'}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                {confirm && password && confirm === password && !fieldErrors.confirm && (
                  <p className="mt-1 text-xs text-green-600 font-medium flex items-center gap-1">
                    <CheckCircle2 size={12} /> Passwords match
                  </p>
                )}
                {fieldErrors.confirm && <p className="mt-1 text-xs text-red-500">{fieldErrors.confirm}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#FF5400] hover:bg-[#e04a00] disabled:opacity-60 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-colors mt-2"
              >
                {loading ? <><Loader2 size={16} className="animate-spin" /> Updating password…</> : 'Set New Password'}
              </button>
            </form>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
