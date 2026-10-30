import { useCallback, useEffect, useRef, useState } from 'react'
import { Bell, X } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useHabitData } from '../../hooks/useHabitData'
import { formatTimeOfDay, toISODate } from '../../utils/dates'
import { getDueReminders, getTodaysReminders } from '../../utils/reminders'

const CHECK_INTERVAL_MS = 30_000
const TOAST_DURATION_MS = 8_000

function showBrowserNotification(title, body) {
  if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return
  new Notification(title, { body })
}

function ReminderToast({ id, title, body, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(id), TOAST_DURATION_MS)
    return () => clearTimeout(timer)
  }, [id, onDismiss])

  return (
    <div
      role="status"
      className="animate-slide-up flex w-80 max-w-[calc(100vw-2rem)] items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-lift"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
        <Bell className="h-4.5 w-4.5" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-navy-900">{title}</p>
        <p className="mt-0.5 text-xs text-navy-500">{body}</p>
      </div>
      <button type="button" onClick={() => onDismiss(id)} className="btn-ghost -mr-2 -mt-1 px-2" aria-label="Dismiss reminder">
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

export default function ReminderNotifier() {
  const { profile } = useAuth()
  const { loaded, habits, reminders, completionIndex, shownTodayIds, recordReminderShown } = useHabitData()
  const [toasts, setToasts] = useState([])
  const attemptedRef = useRef(new Set())
  const toastCounterRef = useRef(0)

  const remindersEnabled = Boolean(profile?.reminders_enabled)

  const dismissToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  useEffect(() => {
    if (!remindersEnabled || !loaded) return undefined

    const addToast = (title, body) => {
      toastCounterRef.current += 1
      const id = toastCounterRef.current
      setToasts((current) => [...current, { id, title, body }])
    }

    const fire = ({ reminder, habit }) => {
      const todayIso = toISODate(new Date())
      const attemptKey = `${reminder.id}-${todayIso}`
      if (attemptedRef.current.has(attemptKey)) return
      attemptedRef.current.add(attemptKey)

      const title = `Time for ${habit.title}`
      const body = `Scheduled for ${formatTimeOfDay(reminder.remind_at)}. Mark it done when you finish.`
      showBrowserNotification(title, body)
      addToast(title, body)

      recordReminderShown(reminder).catch((err) => addToast('Reminder history', err.message))
    }

    const check = () => {
      const now = new Date()
      const todaysReminders = getTodaysReminders({ reminders, habits, completionIndex, now })
      getDueReminders(todaysReminders, shownTodayIds, now).forEach(fire)
    }

    check()
    const intervalId = setInterval(check, CHECK_INTERVAL_MS)
    return () => clearInterval(intervalId)
  }, [remindersEnabled, loaded, habits, reminders, completionIndex, shownTodayIds, recordReminderShown])

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3">
      {toasts.map((toast) => (
        <ReminderToast
          key={toast.id}
          id={toast.id}
          title={toast.title}
          body={toast.body}
          onDismiss={dismissToast}
        />
      ))}
    </div>
  )
}
