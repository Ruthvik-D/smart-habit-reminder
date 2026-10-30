import { useState } from 'react'
import { Link } from 'react-router-dom'
import AuthLayout from '../layouts/AuthLayout'
import Alert from '../components/common/Alert'
import FormField from '../components/common/FormField'
import { signIn } from '../services/authService'
import { setPendingEmail } from '../utils/verification'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [unverifiedEmail, setUnverifiedEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = {}
    if (!EMAIL_PATTERN.test(form.email.trim())) nextErrors.email = 'Please enter a valid email address.'
    if (!form.password) nextErrors.password = 'Please enter your password.'
    setErrors(nextErrors)
    setFormError('')
    setUnverifiedEmail('')
    if (Object.keys(nextErrors).length > 0) return

    const email = form.email.trim()
    setSubmitting(true)
    try {
      await signIn({ email, password: form.password })
    } catch (err) {
      if (err.code === 'email_not_confirmed') {
        setPendingEmail(email)
        setUnverifiedEmail(email)
      } else {
        setFormError(err.message)
      }
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to see today's habits and reminders."
      footer={
        <>
          New here?{' '}
          <Link to="/register" className="font-medium text-primary-600 hover:text-primary-700">
            Create an account
          </Link>
        </>
      }
    >
      {unverifiedEmail && (
        <div className="mb-5">
          <Alert tone="info">
            Please verify your email before signing in. Check your inbox and spam folder for the link.{' '}
            <Link
              to="/verify-email"
              state={{ email: unverifiedEmail }}
              className="font-medium underline underline-offset-2"
            >
              Resend verification email
            </Link>
          </Alert>
        </div>
      )}
      {formError && (
        <div className="mb-5">
          <Alert>{formError}</Alert>
        </div>
      )}
      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        <FormField label="Email" htmlFor="email" error={errors.email}>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className="input"
            value={form.email}
            onChange={updateField('email')}
            placeholder="you@example.com"
          />
        </FormField>
        <FormField label="Password" htmlFor="password" error={errors.password}>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            className="input"
            value={form.password}
            onChange={updateField('password')}
          />
        </FormField>
        <button type="submit" className="btn-primary w-full" disabled={submitting}>
          {submitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </AuthLayout>
  )
}
