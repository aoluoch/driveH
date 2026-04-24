import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle2, Loader2, XCircle } from 'lucide-react'
import { verifyEmail } from '../lib/auth'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

export default function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    const userId = searchParams.get('userId')
    const secret = searchParams.get('secret')
    if (!userId || !secret) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus('error')
      setErrorMsg('Invalid verification link. Please check your email and try again.')
      return
    }
    verifyEmail(userId, secret)
      .then(() => setStatus('success'))
      .catch((err) => {
        setStatus('error')
        const msg = err instanceof Error ? err.message : ''
        if (msg.includes('user_invalid_token') || msg.includes('expired') || msg.includes('invalid')) {
          setErrorMsg('This verification link has expired or is no longer valid. Please log in to request a new one.')
        } else {
          setErrorMsg('Verification failed. The link may already have been used.')
        }
      })
  }, [searchParams])

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
            {status === 'loading' && (
              <>
                <Loader2 size={40} className="animate-spin text-[#FF5400] mx-auto mb-4" />
                <h1 className="text-xl font-bold text-gray-900">Verifying your email…</h1>
                <p className="text-gray-500 text-sm mt-2">Please wait a moment.</p>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="inline-flex w-16 h-16 bg-green-100 text-green-500 rounded-full items-center justify-center mb-5">
                  <CheckCircle2 size={32} />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Email Verified!</h1>
                <p className="text-gray-500 text-sm mt-2 mb-6">
                  Your email has been verified. You can now sign in to your DriveHub account.
                </p>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF5400] hover:bg-[#e04a00] text-white font-bold rounded-xl text-sm transition-colors"
                >
                  Sign In
                </Link>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="inline-flex w-16 h-16 bg-red-100 text-red-500 rounded-full items-center justify-center mb-5">
                  <XCircle size={32} />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Verification Failed</h1>
                <p className="text-gray-500 text-sm mt-2 mb-6">{errorMsg}</p>
                <div className="flex flex-col gap-3">
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#FF5400] hover:bg-[#e04a00] text-white font-bold rounded-xl text-sm transition-colors"
                  >
                    Try Signing In
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold rounded-xl text-sm transition-colors"
                  >
                    Back to Register
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
