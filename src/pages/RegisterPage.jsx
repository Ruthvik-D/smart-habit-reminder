import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../layouts/AuthLayout'
import Alert from '../components/common/Alert'
import FormField from '../components/common/FormField'
import { signUp } from '../services/authService'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_PASSWORD_LENGTH = 6

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ displayName: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }))
  }

  const validate = () => {
    const nextErrors = {}
    if (!form.displayName.trim()) nextErrors.displayName = 'Please enter your name.'
    if (!EMAIL_PATTERN.test(form.email.trim())) nextErrors.email = 'Please enter a valid email address.'
    if (form.password.length < MIN_PASSWORD_LENGTH) {
      nextErrors.password = `Use at least ${MIN_PASSWORD_LENGTH} characters.`
    }
    if (form.confirmPassword !== form.password) nextErrors.confirmPassword = 'Passwords do not match.'
    return nextErrors
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    setFormError('')
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    try {
      const data = await signUp({
        email: form.email.trim(),
        password: form.password,
        displayName: form.displayName.trim(),
      })
      if (!data.session) {
        navigate('/login', {
          replace: true,
          state: { message: 'Your account is ready. Sign in to continue.' },
        })
      }
    } catch (err) {
      setFormError(err.message)
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start building habits you can keep, with reminders that fit your day."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-700">
            Sign in
          </Link>
        </>
      }
    >
      {formError && (
        <div className="mb-5">
          <Alert>{formError}</Alert>
        </div>
      )}
      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        <FormField label="Your name" htmlFor="displayName" error={errors.displayName}>
          <input
            id="displayName"
            type="text"
            autoComplete="name"
            className="input"
            value={form.displayName}
            onChange={updateField('displayName')}
          />
        </FormField>
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
        <FormField
          label="Password"
          htmlFor="password"
          error={errors.password}
          hint={`At least ${MIN_PASSWORD_LENGTH} characters.`}
        >
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            className="input"
            value={form.password}
            onChange={updateField('password')}
          />
        </FormField>
        <FormField label="Confirm password" htmlFor="confirmPassword" error={errors.confirmPassword}>
          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            className="input"
            value={form.confirmPassword}
            onChange={updateField('confirmPassword')}
          />
        </FormField>
        <button type="submit" className="btn-primary w-full" disabled={submitting}>
          {submitting ? 'Creating account...' : 'Create account'}
        </button>
      </form>
    </AuthLayout>
  )
}
