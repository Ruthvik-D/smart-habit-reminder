import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CATEGORIES, FREQUENCIES, WEEKDAY_OPTIONS } from '../../lib/constants'
import { validateHabitForm } from '../../utils/habitValidation'
import Alert from '../common/Alert'
import FormField from '../common/FormField'

export default function HabitForm({ initialValues, submitLabel, onSubmit, submitError }) {
  const [form, setForm] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }))
  }

  const toggleWeekday = (weekday) => {
    setForm((current) => ({
      ...current,
      weekdays: current.weekdays.includes(weekday)
        ? current.weekdays.filter((day) => day !== weekday)
        : [...current.weekdays, weekday],
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = validateHabitForm(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    try {
      await onSubmit(form)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
      {submitError && <Alert>{submitError}</Alert>}

      <FormField label="Habit name" htmlFor="title" error={errors.title}>
        <input
          id="title"
          type="text"
          maxLength={120}
          className="input"
          placeholder="e.g. Read for 20 minutes"
          value={form.title}
          onChange={updateField('title')}
        />
      </FormField>

      <FormField
        label="Description"
        htmlFor="description"
        error={errors.description}
        hint="Optional. Why this habit matters to you."
      >
        <textarea
          id="description"
          rows={3}
          maxLength={500}
          className="input resize-none"
          value={form.description}
          onChange={updateField('description')}
        />
      </FormField>

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField label="Category" htmlFor="category" error={errors.category}>
          <select id="category" className="input" value={form.category} onChange={updateField('category')}>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Start date" htmlFor="startDate" error={errors.startDate}>
          <input
            id="startDate"
            type="date"
            className="input"
            value={form.startDate}
            onChange={updateField('startDate')}
          />
        </FormField>
      </div>

      <fieldset>
        <legend className="label">How often?</legend>
        <div className="grid gap-3 sm:grid-cols-3" role="radiogroup" aria-label="Frequency">
          {FREQUENCIES.map((option) => {
            const selected = form.frequency === option.value
            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setForm((current) => ({ ...current, frequency: option.value }))}
                className={`rounded-xl border px-4 py-3 text-left transition duration-200 ${
                  selected
                    ? 'border-primary-500 bg-primary-50 ring-4 ring-primary-500/10'
                    : 'border-slate-300 bg-white hover:border-slate-400'
                }`}
              >
                <span className="block text-sm font-medium text-navy-900">{option.label}</span>
                <span className="mt-0.5 block text-xs text-navy-500">{option.hint}</span>
              </button>
            )
          })}
        </div>
        {errors.frequency && <p className="mt-1.5 text-xs text-rose-700">{errors.frequency}</p>}

        {form.frequency === 'weekdays' && (
          <div className="animate-fade-in mt-4">
            <p className="mb-2 text-sm font-medium text-navy-800">Days</p>
            <div className="flex flex-wrap gap-2">
              {WEEKDAY_OPTIONS.map((day) => {
                const selected = form.weekdays.includes(day.value)
                return (
                  <button
                    key={day.value}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => toggleWeekday(day.value)}
                    className={`h-10 w-14 rounded-xl text-sm font-medium transition duration-200 ${
                      selected
                        ? 'bg-primary-600 text-white shadow-soft'
                        : 'border border-slate-300 bg-white text-navy-700 hover:border-primary-400'
                    }`}
                  >
                    {day.label}
                  </button>
                )
              })}
            </div>
            {errors.weekdays && <p className="mt-1.5 text-xs text-rose-700">{errors.weekdays}</p>}
          </div>
        )}
      </fieldset>

      <FormField
        label="Preferred reminder time"
        htmlFor="reminderTime"
        error={errors.reminderTime}
        hint="Optional. Sets the first reminder for this habit. Add more on the Reminders page."
      >
        <input
          id="reminderTime"
          type="time"
          className="input sm:w-48"
          value={form.reminderTime}
          onChange={updateField('reminderTime')}
        />
      </FormField>

      <div className="flex flex-col-reverse gap-3 border-t border-slate-200/80 pt-6 sm:flex-row sm:justify-end">
        <Link to="/habits" className="btn-secondary">
          Cancel
        </Link>
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  )
}
