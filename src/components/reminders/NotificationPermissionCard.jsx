import { useState } from 'react'
import { Bell, BellOff } from 'lucide-react'
import Alert from '../common/Alert'

export default function NotificationPermissionCard() {
  const supported = typeof window !== 'undefined' && 'Notification' in window
  const [permission, setPermission] = useState(supported ? Notification.permission : 'unsupported')
  const [requesting, setRequesting] = useState(false)
  const [error, setError] = useState('')

  const handleRequest = async () => {
    setRequesting(true)
    setError('')
    try {
      setPermission(await Notification.requestPermission())
    } catch {
      setError('Your browser did not allow us to ask for notification permission.')
    } finally {
      setRequesting(false)
    }
  }

  const status = {
    granted: { label: 'Notifications are on', Icon: Bell, tone: 'text-emerald-700 bg-emerald-50' },
    denied: { label: 'Notifications are blocked', Icon: BellOff, tone: 'text-rose-700 bg-rose-50' },
    default: { label: 'Notifications are not enabled', Icon: BellOff, tone: 'text-amber-700 bg-amber-50' },
    unsupported: { label: 'Notifications are not supported here', Icon: BellOff, tone: 'text-navy-600 bg-slate-100' },
  }[permission]

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold">Browser notifications</h2>
        <span className={`badge gap-1.5 ${status.tone}`}>
          <status.Icon className="h-3.5 w-3.5" aria-hidden="true" />
          {status.label}
        </span>
      </div>

      <p className="mt-3 text-sm text-navy-500">
        Reminders appear as browser notifications only while Smart Habit Reminder is open in a browser tab.
        When the browser is closed, reminders will not appear yet. Background delivery needs push
        notifications, which this version does not include.
      </p>

      {permission === 'default' && (
        <button type="button" className="btn-primary mt-5 w-full" onClick={handleRequest} disabled={requesting}>
          {requesting ? 'Waiting for your answer...' : 'Allow notifications'}
        </button>
      )}
      {permission === 'denied' && (
        <p className="mt-4 text-sm text-navy-600">
          Notifications are blocked for this site. Allow them in your browser&apos;s site settings to receive reminders.
        </p>
      )}
      {error && (
        <div className="mt-4">
          <Alert>{error}</Alert>
        </div>
      )}
    </div>
  )
}
