import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import AuthLayout from '../layouts/AuthLayout'
import Alert from '../components/common/Alert'
import FormField from '../components/common/FormField'
import { signIn } from '../services/authService'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function LoginPage() {
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const notice = location.state?.message

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
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    try {
      await signIn({ email: form.email.trim(), password: form.password })
    } catch (err) {
      setFormError(err.message)
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
      {notice && (
        <div className="mb-5">
          <Alert tone="success">{notice}</Alert>
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
