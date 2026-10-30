import { useState } from 'react'
import { Bell, CalendarClock, History, Pencil, Trash2 } from 'lucide-react'
import PageHeader from '../components/common/PageHeader'
import EmptyState from '../components/common/EmptyState'
import Alert from '../components/common/Alert'
import Modal from '../components/common/Modal'
import ConfirmDialog from '../components/common/ConfirmDialog'
import ToggleSwitch from '../components/common/ToggleSwitch'
import ReminderForm from '../components/reminders/ReminderForm'
import NotificationPermissionCard from '../components/reminders/NotificationPermissionCard'
import { useHabitData } from '../hooks/useHabitData'
import { formatDateTime, formatTimeOfDay } from '../utils/dates'
import { getTodaysReminders, getUpcomingReminders, timeToMinutes } from '../utils/reminders'

const HISTORY_LIMIT = 20

export default function RemindersPage() {
  const { habits, reminders, history, completionIndex, saveReminder, toggleReminder, removeReminder } =
    useHabitData()
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [actionError, setActionError] = useState('')

  const now = new Date()
  const habitsById = new Map(habits.map((habit) => [habit.id, habit]))
  const scheduled = reminders
    .filter((reminder) => habitsById.has(reminder.habit_id))
    .map((reminder) => ({ reminder, habit: habitsById.get(reminder.habit_id) }))
    .sort((a, b) => timeToMinutes(a.reminder.remind_at) - timeToMinutes(b.reminder.remind_at))
  const upcoming = getUpcomingReminders(
    getTodaysReminders({ reminders, habits, completionIndex, now }),
    now,
  )
  const recentHistory = history.slice(0, HISTORY_LIMIT)

  const runAction = async (action) => {
    setActionError('')
    try {
      await action()
    } catch (err) {
      setActionError(err.message)
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Stay on schedule"
        title="Reminders"
        description="Choose when each habit should nudge you. Turn reminders on or off without losing their times."
        actions={
          <button
            type="button"
            className="btn-primary"
            onClick={() => setEditing('new')}
            disabled={habits.length === 0}
          >
            Add reminder
          </button>
        }
      />

      {actionError && (
        <div className="mb-6">
          <Alert>{actionError}</Alert>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="card animate-slide-up p-6" aria-labelledby="all-reminders-title">
            <h2 id="all-reminders-title" className="mb-5 text-lg font-semibold">All reminders</h2>
            {habits.length === 0 ? (
              <EmptyState
                icon={Bell}
                title="Create a habit first"
                description="Reminders are attached to habits. Add a habit, then schedule when to be reminded."
              />
            ) : scheduled.length === 0 ? (
              <EmptyState
                icon={Bell}
                title="No reminders yet"
                description="Add a time for a habit and Smart Habit Reminder will notify you while the app is open."
              />
            ) : (
              <ul className="divide-y divide-slate-100">
                {scheduled.map(({ reminder, habit }) => (
                  <li key={reminder.id} className="flex items-center gap-4 py-4">
                    <span className="w-24 shrink-0 text-lg font-semibold tabular-nums text-navy-900">
                      {formatTimeOfDay(reminder.remind_at)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className={`truncate text-sm font-medium ${reminder.is_enabled ? 'text-navy-900' : 'text-navy-400'}`}>
                        {habit.title}
                      </p>
                      <p className="text-xs text-navy-500">{habit.category}</p>
                    </div>
                    <ToggleSwitch
                      checked={reminder.is_enabled}
                      label={`Reminder for ${habit.title} at ${formatTimeOfDay(reminder.remind_at)}`}
                      onChange={() => runAction(() => toggleReminder(reminder))}
                    />
                    <button
                      type="button"
                      className="btn-ghost px-2"
                      onClick={() => setEditing(reminder)}
                      aria-label={`Edit reminder for ${habit.title}`}
                    >
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className="btn-ghost px-2 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                      onClick={() => setDeleting({ reminder, habit })}
                      aria-label={`Delete reminder for ${habit.title}`}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="card animate-slide-up p-6" aria-labelledby="history-title">
            <div className="mb-5 flex items-center gap-2">
              <History className="h-4.5 w-4.5 text-navy-500" aria-hidden="true" />
              <h2 id="history-title" className="text-lg font-semibold">Reminder history</h2>
            </div>
            {recentHistory.length === 0 ? (
              <p className="text-sm text-navy-500">Reminders you receive will be listed here.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {recentHistory.map((entry) => (
                  <li key={entry.id} className="flex items-center justify-between gap-4 py-3">
                    <span className="truncate text-sm text-navy-800">{entry.habits?.title ?? 'Deleted habit'}</span>
                    <span className="shrink-0 text-xs text-navy-500">{formatDateTime(entry.shown_at)}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <div className="space-y-6">
          <NotificationPermissionCard />

          <section className="card animate-slide-up p-6" aria-labelledby="today-reminders-title">
            <div className="mb-5 flex items-center gap-2">
              <CalendarClock className="h-4.5 w-4.5 text-primary-600" aria-hidden="true" />
              <h2 id="today-reminders-title" className="text-lg font-semibold">Coming up today</h2>
            </div>
            {upcoming.length === 0 ? (
              <p className="text-sm text-navy-500">No reminders left for today.</p>
            ) : (
              <ul className="space-y-3">
                {upcoming.map(({ reminder, habit }) => (
                  <li key={reminder.id} className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-4 py-3">
                    <span className="truncate text-sm font-medium text-navy-900">{habit.title}</span>
                    <span className="shrink-0 text-xs font-medium text-primary-700">
                      {formatTimeOfDay(reminder.remind_at)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>

      {editing && (
        <Modal
          title={editing === 'new' ? 'Add reminder' : 'Edit reminder'}
          description="Reminders fire at this time on the days the habit is due."
          onClose={() => setEditing(null)}
        >
          <ReminderForm
            habits={habits}
            reminder={editing === 'new' ? null : editing}
            onCancel={() => setEditing(null)}
            onSubmit={async (values) => {
              await saveReminder(values)
              setEditing(null)
            }}
          />
        </Modal>
      )}

      {deleting && (
        <ConfirmDialog
          title="Delete this reminder?"
          message={`The ${formatTimeOfDay(deleting.reminder.remind_at)} reminder for "${deleting.habit.title}" will be removed.`}
          confirmLabel="Delete reminder"
          onConfirm={() => removeReminder(deleting.reminder.id)}
          onClose={() => setDeleting(null)}
        />
      )}
    </>
  )
}
