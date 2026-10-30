import { FREQUENCIES, WEEKDAY_OPTIONS } from '../lib/constants'

export function formatFrequency(habit) {
  if (habit.frequency === 'weekdays') {
    return WEEKDAY_OPTIONS.filter((option) => habit.weekdays.includes(option.value))
      .map((option) => option.label)
      .join(', ')
  }
  return FREQUENCIES.find((option) => option.value === habit.frequency)?.label ?? ''
}
