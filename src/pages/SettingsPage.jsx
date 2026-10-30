import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import PageHeader from '../components/common/PageHeader'
import Alert from '../components/common/Alert'
import ToggleSwitch from '../components/common/ToggleSwitch'
import NotificationPermissionCard from '../components/reminders/NotificationPermissionCard'
import { useAuth } from '../hooks/useAuth'
import { updateProfile } from '../services/profileService'
import { signOut } from '../services/authService'

export default function SettingsPage() {
  const { user, profile, refreshProfile } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [signingOut, setSigningOut] = useState(false)

  const remindersEnabled = Boolean(profile?.reminders_enabled)

  const handleToggleReminders = async (nextValue) => {
    setError('')
    setSaving(true)
    try {
      await updateProfile(user.id, { reminders_enabled: nextValue })
      await refreshProfile()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleSignOut = async () => {
    setError('')
    setSigningOut(true)
    try {
      await signOut()
      navigate('/login', { replace: true })
    } catch (err) {
      setError(err.message)
      setSigningOut(false)
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Preferences"
        title="Settings"
        description="Control reminders, notifications, and your session."
      />

      {error && (
        <div className="mb-6 max-w-3xl">
          <Alert>{error}</Alert>
        </div>
      )}

      <div className="grid max-w-3xl gap-6">
        <section className="card animate-slide-up p-6" aria-labelledby="reminder-settings-title">
          <div className="flex items-start justify-between gap-6">
            <div>
              <h2 id="reminder-settings-title" className="text-lg font-semibold">Habit reminders</h2>
              <p className="mt-1 text-sm text-navy-500">
                Turn this off to pause every reminder without deleting your reminder times.
              </p>
            </div>
            <ToggleSwitch
              checked={remindersEnabled}
              disabled={saving}
              label="Enable habit reminders"
              onChange={handleToggleReminders}
            />
          </div>
        </section>

        <NotificationPermissionCard />

        <section className="card animate-slide-up p-6" aria-labelledby="data-title">
          <h2 id="data-title" className="text-lg font-semibold">About your data</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-navy-600">
            <li>Habits, check-ins, reminders, and reminder history are saved to your account.</li>
            <li>Only you can see your data. Other accounts cannot read or change it.</li>
            <li>Reminders are checked while the app is open in a browser tab. They do not arrive when the browser is closed.</li>
          </ul>
        </section>

        <section className="card animate-slide-up p-6" aria-labelledby="session-title">
          <h2 id="session-title" className="text-lg font-semibold">Session</h2>
          <p className="mt-1 text-sm text-navy-500">Sign out of Smart Habit Reminder on this device.</p>
          <button
            type="button"
            className="btn-secondary mt-5"
            onClick={handleSignOut}
            disabled={signingOut}
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            {signingOut ? 'Signing out...' : 'Sign out'}
          </button>
        </section>
      </div>
    </>
  )
}
