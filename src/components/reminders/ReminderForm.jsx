import { useState } from 'react'
import Alert from '../common/Alert'
import FormField from '../common/FormField'
import { validateReminderForm } from '../../utils/habitValidation'

export default function ReminderForm({ habits, reminder, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    habitId: reminder?.habit_id ?? habits[0]?.id ?? '',
    remindAt: reminder?.remind_at.slice(0, 5) ?? '08:00',
  })
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = validateReminderForm(form)
    setErrors(nextErrors)
    setSubmitError('')
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    try {
      await onSubmit({ reminderId: reminder?.id, habitId: form.habitId, remindAt: form.remindAt })
    } catch (err) {
      setSubmitError(err.message)
      setSubmitting(false)
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
      {submitError && <Alert>{submitError}</Alert>}

      <FormField label="Habit" htmlFor="reminderHabit" error={errors.habitId}>
        <select
          id="reminderHabit"
          className="input"
          value={form.habitId}
          disabled={Boolean(reminder)}
          onChange={(event) => setForm((current) => ({ ...current, habitId: event.target.value }))}
        >
          {habits.map((habit) => (
            <option key={habit.id} value={habit.id}>
              {habit.title}
            </option>
          ))}
        </select>
      </FormField>

      <FormField label="Time" htmlFor="reminderTime" error={errors.remindAt}>
        <input
          id="reminderTime"
          type="time"
          className="input sm:w-48"
          value={form.remindAt}
          onChange={(event) => setForm((current) => ({ ...current, remindAt: event.target.value }))}
        />
      </FormField>

      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
        <button type="button" className="btn-secondary" onClick={onCancel} disabled={submitting}>
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? 'Saving...' : reminder ? 'Save reminder' : 'Add reminder'}
        </button>
      </div>
    </form>
  )
}
