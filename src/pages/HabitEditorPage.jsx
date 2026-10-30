import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, SearchX } from 'lucide-react'
import PageHeader from '../components/common/PageHeader'
import EmptyState from '../components/common/EmptyState'
import HabitForm from '../components/habits/HabitForm'
import { useHabitData } from '../hooks/useHabitData'
import { CATEGORIES } from '../lib/constants'
import { toISODate } from '../utils/dates'

const DEFAULT_WEEKDAYS = [1, 2, 3, 4, 5]

export default function HabitEditorPage() {
  const { habitId } = useParams()
  const navigate = useNavigate()
  const { habits, reminders, saveHabit } = useHabitData()
  const [submitError, setSubmitError] = useState('')

  const isEditing = Boolean(habitId)
  const habit = isEditing ? habits.find((item) => item.id === habitId) : null

  if (isEditing && !habit) {
    return (
      <EmptyState
        icon={SearchX}
        title="This habit could not be found"
        description="It may have been deleted. Head back to your habit list to pick another one."
        action={
          <Link to="/habits" className="btn-primary">
            Back to My Habits
          </Link>
        }
      />
    )
  }

  const preferredReminder = habit && reminders.find((reminder) => reminder.habit_id === habit.id)
  const initialValues = {
    title: habit?.title ?? '',
    description: habit?.description ?? '',
    category: habit?.category ?? CATEGORIES[0],
    frequency: habit?.frequency ?? 'daily',
    weekdays: habit?.weekdays?.length ? habit.weekdays : DEFAULT_WEEKDAYS,
    startDate: habit?.start_date ?? toISODate(new Date()),
    reminderTime: preferredReminder?.remind_at.slice(0, 5) ?? '',
  }

  const handleSubmit = async (form) => {
    setSubmitError('')
    try {
      await saveHabit({ habitId, values: form, reminderTime: form.reminderTime })
      navigate('/habits')
    } catch (err) {
      setSubmitError(err.message)
    }
  }

  return (
    <>
      <Link to="/habits" className="btn-ghost -ml-3 mb-4 text-navy-500">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        My Habits
      </Link>
      <PageHeader
        title={isEditing ? 'Edit habit' : 'New habit'}
        description={
          isEditing
            ? 'Update the details or schedule. Your completion history is kept.'
            : 'Give your habit a clear name and a schedule you can keep.'
        }
      />

      <div className="card animate-slide-up mx-auto max-w-3xl p-6 sm:p-8">
        <HabitForm
          key={habitId ?? 'new'}
          initialValues={initialValues}
          submitLabel={isEditing ? 'Save changes' : 'Create habit'}
          onSubmit={handleSubmit}
          submitError={submitError}
        />
      </div>
    </>
  )
}
