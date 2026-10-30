import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../layouts/AuthLayout'
import Alert from '../components/common/Alert'
import LoadingState from '../components/common/LoadingState'
import {
  VERIFICATION_LINK_EXPIRED_MESSAGE,
  VERIFICATION_LINK_INVALID_MESSAGE,
  completeVerifiedSession,
  verifyEmailToken,
} from '../services/authService'
import { clearPendingEmail, readCallbackParams } from '../utils/verification'

export default function AuthCallbackPage() {
  const navigate = useNavigate()
  const [checking, setChecking] = useState(true)
  const [error, setError] = useState('')
  const handled = useRef(false)

  useEffect(() => {
    if (handled.current) return
    handled.current = true
    const params = readCallbackParams(window.location.search, window.location.hash)

    const finish = () => {
      clearPendingEmail()
      navigate('/dashboard', { replace: true })
    }
    const fail = (message) => {
      setError(message)
      setChecking(false)
    }

    const run = async () => {
      if (params.kind === 'token') {
        window.history.replaceState(window.history.state, '', window.location.pathname)
        try {
          await verifyEmailToken(params)
          finish()
        } catch (err) {
          fail(err.message)
        }
        return
      }
      if (params.kind === 'error') {
        fail(params.errorCode === 'otp_expired' ? VERIFICATION_LINK_EXPIRED_MESSAGE : VERIFICATION_LINK_INVALID_MESSAGE)
        return
      }
      try {
        await completeVerifiedSession()
        finish()
      } catch {
        fail(VERIFICATION_LINK_INVALID_MESSAGE)
      }
    }
    run()
  }, [navigate])

  return (
    <AuthLayout
      title={checking ? 'Verifying your email' : "We couldn't verify your email"}
      subtitle={checking ? 'This only takes a moment.' : 'Your account is not active yet.'}
    >
      {checking && <LoadingState label="Checking your verification link..." />}
      {!checking && (
        <div className="space-y-6">
          <Alert>{error}</Alert>
          <div className="space-y-3">
            <Link to="/verify-email" className="btn-primary w-full">
              Request a new verification email
            </Link>
            <Link to="/login" className="btn-secondary w-full">
              Back to sign in
            </Link>
          </div>
        </div>
      )}
    </AuthLayout>
  )
}
