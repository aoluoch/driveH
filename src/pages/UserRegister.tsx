import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { CheckCircle, CheckCircle2, Eye, EyeOff, Loader2, Mail, UserPlus } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

// ---------------------------------------------------------------------------
// Disposable / temporary email domain blocklist
// ---------------------------------------------------------------------------
const TEMP_EMAIL_DOMAINS = new Set([
  'mailinator.com', 'guerrillamail.com', 'guerrillamail.info', 'guerrillamail.biz',
  'guerrillamail.de', 'guerrillamail.net', 'guerrillamail.org', 'guerrillamailblock.com',
  'tempmail.com', 'tempmail.eu', 'temp-mail.org', 'temp-mail.ru', 'tempr.email',
  'throwaway.email', 'throwam.com', '10minutemail.com', '10minutemail.net',
  '10minutemail.org', 'yopmail.com', 'yopmail.fr', 'maildrop.cc', 'dispostable.com',
  'trashmail.com', 'trashmail.at', 'trashmail.io', 'trashmail.me', 'trashmail.net',
  'trashmail.org', 'trashmail.app', 'trashmailer.com', 'sharklasers.com', 'spam4.me',
  'spamgourmet.com', 'spamgourmet.net', 'spamgourmet.org', 'discard.email',
  'mailnull.com', 'fakeinbox.com', 'fakemailgenerator.com', 'getairmail.com',
  'incognitomail.com', 'incognitomail.net', 'incognitomail.org', 'jourrapide.com',
  'mailexpire.com', 'mailguard.me', 'mailzilla.com', 'mintemail.com',
  'mytrashmail.com', 'pookmail.com', 'rcpt.at', 'sendspamhere.com', 'shiftmail.com',
  'spamavert.com', 'spambog.com', 'spambog.de', 'spambog.ru', 'spamday.com',
  'spamex.com', 'spamfree24.de', 'spamfree24.eu', 'spamfree24.info', 'spamfree24.net',
  'spamfree24.org', 'spaml.com', 'spamstack.net', 'tempinbox.co.uk', 'tempinbox.com',
  'tempomail.fr', 'temporaryemail.net', 'tmailinator.com', 'toomail.biz',
  'trashdevil.com', 'trashdevil.de', 'trashmate.tk', 'wegwerfemail.de',
  'wegwerfmail.de', 'wegwerfmail.net', 'wegwerfmail.org', 'mailtemp.info',
  'emailondeck.com', 'spamgoes.in', 'oneoffmail.com', 'onewaymail.com',
  'mailnew.com', 'objectmail.com', 'prtnx.com', 'put2.net', 'rtrtr.com',
  'safetypost.de', 'sibmail.com', 'spambasket.net', 'spamboxu.com', 'spamcon.org',
  'spamcowboy.com', 'spamcowboy.net', 'spamcowboy.org', 'spamdecoy.net', 'spame.com',
  'spammotel.com', 'spamoff.de', 'spamspot.com', 'spamthisplease.com',
  'tmpmail.net', 'tmpmail.org', 'turual.com', 'twinmail.de', 'tyldd.com',
  'uroid.com', 'veryrealemail.com', 'viditag.com', 'walala.org', 'webm4il.info',
  'whyspam.me', 'wilemail.com', 'wimsg.com', 'mymail-in.net', 'nomail.pw',
  'filzmail.com', 'jetable.com', 'jetable.net', 'jetable.org', 'jetable.fr.nf',
  'meltmail.com', 'nervmich.net', 'netmails.net', 'nwldx.com', 'odnorazovoe.ru',
  'spam.la', 'spaml.de', 'binkmail.com', 'bobmail.info', 'mailmetrash.com',
  'mt2009.com', 'mt2014.com', 'trash-mail.at', 'grr.la',
])

function isDisposableEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase()
  return domain ? TEMP_EMAIL_DOMAINS.has(domain) : false
}

// ---------------------------------------------------------------------------
// Password strength
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Form validation
// ---------------------------------------------------------------------------
function validateForm(
  name: string,
  email: string,
  password: string,
  confirm: string,
): Record<string, string> {
  const errors: Record<string, string> = {}

  const trimmedName = name.trim()
  if (!trimmedName) {
    errors.name = 'Full name is required.'
  } else if (trimmedName.length < 2) {
    errors.name = 'Name must be at least 2 characters.'
  } else if (trimmedName.length > 100) {
    errors.name = 'Name is too long (max 100 characters).'
  } else if (!/^[A-Za-z\s'-]+$/.test(trimmedName)) {
    errors.name = 'Name can only contain letters, spaces, hyphens, and apostrophes.'
  }

  if (!email) {
    errors.email = 'Email address is required.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    errors.email = 'Please enter a valid email address.'
  } else if (isDisposableEmail(email)) {
    errors.email = 'Temporary or disposable email addresses are not allowed.'
  }

  if (!password) {
    errors.password = 'Password is required.'
  } else if (password.length < 8) {
    errors.password = 'Password must be at least 8 characters.'
  } else if (!/[A-Z]/.test(password)) {
    errors.password = 'Password must contain at least one uppercase letter.'
  } else if (!/[a-z]/.test(password)) {
    errors.password = 'Password must contain at least one lowercase letter.'
  } else if (!/[0-9]/.test(password)) {
    errors.password = 'Password must contain at least one number.'
  } else if (!/[^A-Za-z0-9]/.test(password)) {
    errors.password = 'Password must contain at least one special character (e.g. !@#$%).'
  }

  if (!confirm) {
    errors.confirm = 'Please confirm your password.'
  } else if (password !== confirm) {
    errors.confirm = 'Passwords do not match.'
  }

  return errors
}

function friendlyRegisterError(err: unknown): string {
  const msg = err instanceof Error ? err.message : ''
  if (msg.includes('user_already_exists') || msg.includes('already exists')) return 'An account with this email already exists.'
  if (msg.includes('user_password_policy_violation') || msg.includes('password policy')) return 'Password does not meet the requirements.'
  if (msg.includes('fetch') || msg.includes('network') || msg.includes('Failed to fetch')) return 'Connection failed. Check your internet and try again.'
  return 'Registration failed. Please try again.'
}

export default function UserRegister() {
  const { register, user, loading: authLoading } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [registered, setRegistered] = useState(false)

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 size={32} className="animate-spin text-[#FF5400]" />
      </div>
    )
  }

  if (user) return <Navigate to="/" replace />

  const strength = getPasswordStrength(password)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errors = validateForm(name, email, password, confirm)
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return
    setSubmitError(null)
    setLoading(true)
    try {
      await register(name.trim(), email.trim(), password)
      setRegistered(true)
    } catch (err: unknown) {
      setSubmitError(friendlyRegisterError(err))
    } finally {
      setLoading(false)
    }
  }

  // ---- Success state -------------------------------------------------------
  if (registered) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
              <div className="inline-flex w-16 h-16 bg-green-100 text-green-500 rounded-full items-center justify-center mb-5">
                <Mail size={28} />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Check your inbox!</h1>
              <p className="text-gray-500 text-sm mt-2">We sent a verification link to</p>
              <p className="font-semibold text-gray-900 text-sm mt-1 mb-4">{email}</p>
              <p className="text-gray-400 text-xs mb-6">
                Click the link in the email to verify your account, then sign in. Don't see it? Check your spam folder.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF5400] hover:bg-[#e04a00] text-white font-bold rounded-xl text-sm transition-colors"
              >
                Go to Sign In
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // ---- Registration form ---------------------------------------------------
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

            {submitError && (
              <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                {submitError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Full name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setFieldErrors((p) => ({ ...p, name: '' })) }}
                  placeholder="John Doe"
                  className={`w-full px-4 py-3 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5400] focus:border-transparent ${fieldErrors.name ? 'border-red-400' : 'border-gray-200'}`}
                />
                {fieldErrors.name && <p className="mt-1 text-xs text-red-500">{fieldErrors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setFieldErrors((p) => ({ ...p, email: '' })) }}
                  placeholder="you@example.com"
                  className={`w-full px-4 py-3 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5400] focus:border-transparent ${fieldErrors.email ? 'border-red-400' : 'border-gray-200'}`}
                />
                {fieldErrors.email && <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm password</label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirm}
                    onChange={(e) => { setConfirm(e.target.value); setFieldErrors((p) => ({ ...p, confirm: '' })) }}
                    placeholder="Re-enter your password"
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
                {loading ? <><Loader2 size={16} className="animate-spin" /> Creating account…</> : 'Create Account'}
              </button>

              <p className="text-center text-xs text-gray-400">
                By registering, you agree to our{' '}
                <Link to="/terms" className="underline hover:text-gray-600">Terms of Service</Link>
                {' '}and{' '}
                <Link to="/privacy" className="underline hover:text-gray-600">Privacy Policy</Link>.
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
