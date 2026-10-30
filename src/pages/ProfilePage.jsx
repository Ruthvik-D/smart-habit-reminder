import { useState } from 'react'
import PageHeader from '../components/common/PageHeader'
import Alert from '../components/common/Alert'
import FormField from '../components/common/FormField'
import { useAuth } from '../hooks/useAuth'
import { updateProfile } from '../services/profileService'
import { updatePassword } from '../services/authService'
import { validatePasswordForm, validateProfileForm } from '../utils/accountValidation'

function DisplayNameForm({ user, profile, refreshProfile }) {
  const [displayName, setDisplayName] = useState(profile?.display_name ?? '')
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState({ tone: '', message: '' })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = validateProfileForm({ displayName })
    setErrors(nextErrors)
    setStatus({ tone: '', message: '' })
    if (Object.keys(nextErrors).length > 0) return

    setSaving(true)
    try {
      await updateProfile(user.id, { display_name: displayName.trim() })
      await refreshProfile()
      setStatus({ tone: 'success', message: 'Your name has been updated.' })
    } catch (err) {
      setStatus({ tone: 'error', message: err.message })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
      {status.message && <Alert tone={status.tone}>{status.message}</Alert>}
      <FormField label="Display name" htmlFor="displayName" error={errors.displayName}>
        <input
          id="displayName"
          className="input"
          value={displayName}
          maxLength={80}
          onChange={(event) => setDisplayName(event.target.value)}
        />
      </FormField>
      <FormField label="Email" htmlFor="email" hint="Your sign-in email. It cannot be changed here.">
        <input id="email" className="input bg-slate-50 text-navy-500" value={user.email ?? ''} readOnly />
      </FormField>
      <div className="flex justify-end">
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Saving...' : 'Save name'}
        </button>
      </div>
    </form>
  )
}

function PasswordForm() {
  const [form, setForm] = useState({ password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState({ tone: '', message: '' })
  const [saving, setSaving] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = validatePasswordForm(form)
    setErrors(nextErrors)
    setStatus({ tone: '', message: '' })
    if (Object.keys(nextErrors).length > 0) return

    setSaving(true)
    try {
      await updatePassword(form.password)
      setForm({ password: '', confirmPassword: '' })
      setStatus({ tone: 'success', message: 'Your password has been changed.' })
    } catch (err) {
      setStatus({ tone: 'error', message: err.message })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
      {status.message && <Alert tone={status.tone}>{status.message}</Alert>}
      <FormField label="New password" htmlFor="newPassword" error={errors.password} hint="At least 8 characters.">
        <input
          id="newPassword"
          name="password"
          type="password"
          autoComplete="new-password"
          className="input"
          value={form.password}
          onChange={handleChange}
        />
      </FormField>
      <FormField label="Confirm new password" htmlFor="confirmPassword" error={errors.confirmPassword}>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          className="input"
          value={form.confirmPassword}
          onChange={handleChange}
        />
      </FormField>
      <div className="flex justify-end">
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Updating...' : 'Change password'}
        </button>
      </div>
    </form>
  )
}

export default function ProfilePage() {
  const { user, profile, refreshProfile } = useAuth()

  return (
    <>
      <PageHeader
        eyebrow="Your account"
        title="Profile"
        description="Update how your name appears and keep your account secure."
      />

      <div className="grid max-w-3xl gap-6">
        <section className="card animate-slide-up p-6" aria-labelledby="name-title">
          <h2 id="name-title" className="mb-5 text-lg font-semibold">Personal details</h2>
          <DisplayNameForm key={profile?.display_name ?? ''} user={user} profile={profile} refreshProfile={refreshProfile} />
        </section>

        <section className="card animate-slide-up p-6" aria-labelledby="password-title">
          <h2 id="password-title" className="mb-5 text-lg font-semibold">Change password</h2>
          <PasswordForm />
        </section>
      </div>
    </>
  )
}
