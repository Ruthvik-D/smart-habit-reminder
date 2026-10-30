import { useEffect, useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import AuthLayout from '../layouts/AuthLayout'
import Alert from '../components/common/Alert'
import FormField from '../components/common/FormField'
import { useAuth } from '../hooks/useAuth'
import { resendVerificationEmail } from '../services/authService'
import {
  getPendingEmail,
  getResendCooldownEnd,
  setPendingEmail,
  startResendCooldown,
} from '../utils/verification'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function VerifyEmailPage() {
  const { user } = useAuth()
  const location = useLocation()
  const [email, setEmail] = useState(() => location.state?.email || getPendingEmail())
  const [emailInput, setEmailInput] = useState('')
  const [status, setStatus] = useState(null)
  const [sending, setSending] = useState(false)
  const [cooldownEnd, setCooldownEnd] = useState(getResendCooldownEnd)
  const [now, setNow] = useState(() => Date.now())
  const secondsLeft = Math.max(0, Math.ceil((cooldownEnd - now) / 1000))
  const cooling = secondsLeft > 0

  useEffect(() => {
    if (email) setPendingEmail(email)
  }, [email])

  useEffect(() => {
    if (!cooling) return undefined
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [cooling])

  if (user?.email_confirmed_at) return <Navigate to="/dashboard" replace />

  const handleResend = async (event) => {
    event.preventDefault()
    const target = (email || emailInput).trim()
    if (!EMAIL_PATTERN.test(target)) {
      setStatus({ tone: 'error', text: 'Please enter a valid email address.' })
      return
    }

    setSending(true)
    setStatus(null)
    try {
      await resendVerificationEmail(target)
      setEmail(target)
      setStatus({
        tone: 'success',
        text: 'If an account exists for this address, a new verification link is on its way.',
      })
    } catch (err) {
      setStatus({ tone: 'error', text: err.message })
    } finally {
      startResendCooldown()
      setCooldownEnd(getResendCooldownEnd())
      setSending(false)
    }
  }

  return (
    <AuthLayout
      title="Verify your email"
      subtitle="One more step before you can open your habit dashboard."
      footer={
        <>
          Entered the wrong email?{' '}
          <Link to="/register" className="font-medium text-primary-600 hover:text-primary-700">
            Create a new account
          </Link>
        </>
      }
    >
      {status && (
        <div className="mb-5">
          <Alert tone={status.tone}>{status.text}</Alert>
        </div>
      )}

      <div className="space-y-6">
        {email ? (
          <p className="text-sm text-navy-600">
            We sent a verification link to{' '}
            <span className="break-all font-medium text-navy-900">{email}</span>.
          </p>
        ) : (
          <form onSubmit={handleResend} noValidate>
            <FormField label="Email" htmlFor="verifyEmail" hint="Enter the address you registered with.">
              <input
                id="verifyEmail"
                type="email"
                autoComplete="email"
                className="input"
                value={emailInput}
                onChange={(event) => setEmailInput(event.target.value)}
                placeholder="you@example.com"
              />
            </FormField>
          </form>
        )}

        <ul className="space-y-2 text-sm text-navy-500">
          <li>Open the link in that email on this device.</li>
          <li>Check your spam or junk folder if it has not arrived within a few minutes.</li>
        </ul>

        <div className="space-y-3">
          <button
            type="button"
            onClick={handleResend}
            className="btn-primary w-full"
            disabled={sending || cooling}
          >
            {sending ? 'Sending...' : cooling ? `Resend available in ${secondsLeft}s` : 'Resend verification email'}
          </button>
          <Link to="/login" className="btn-secondary w-full">
            Back to sign in
          </Link>
        </div>
      </div>
    </AuthLayout>
  )
}
