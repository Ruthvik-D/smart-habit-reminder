import { CATEGORIES, FREQUENCIES } from '../lib/constants'

const TITLE_MAX = 120
const DESCRIPTION_MAX = 500
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/

export function validateHabitForm(form) {
  const errors = {}
  const title = form.title.trim()

  if (!title) errors.title = 'Please enter a habit name.'
  else if (title.length > TITLE_MAX) errors.title = `Keep the name under ${TITLE_MAX} characters.`

  if (form.description.length > DESCRIPTION_MAX) {
    errors.description = `Keep the description under ${DESCRIPTION_MAX} characters.`
  }

  if (!CATEGORIES.includes(form.category)) errors.category = 'Please choose a category.'

  if (!FREQUENCIES.some((option) => option.value === form.frequency)) {
    errors.frequency = 'Please choose how often this habit repeats.'
  }

  if (form.frequency === 'weekdays' && form.weekdays.length === 0) {
    errors.weekdays = 'Pick at least one day of the week.'
  }

  if (!form.startDate) errors.startDate = 'Please choose a start date.'

  if (form.reminderTime && !TIME_PATTERN.test(form.reminderTime)) {
    errors.reminderTime = 'Please enter a valid time.'
  }

  return errors
}

export function validateReminderForm(form) {
  const errors = {}
  if (!form.habitId) errors.habitId = 'Please choose a habit.'
  if (!TIME_PATTERN.test(form.remindAt)) errors.remindAt = 'Please enter a valid time.'
  return errors
}
