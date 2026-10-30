import { isCompletedOn, isHabitDueOn } from './habitStats'
import { toISODate, startOfDay } from './dates'

const REMINDER_WINDOW_MINUTES = 15

export function timeToMinutes(time) {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

export function getTodaysReminders({ reminders, habits, completionIndex, now }) {
  const habitsById = new Map(habits.map((habit) => [habit.id, habit]))
  const today = startOfDay(now)
  const todayIso = toISODate(now)

  return reminders
    .filter((reminder) => reminder.is_enabled && habitsById.has(reminder.habit_id))
    .map((reminder) => ({ reminder, habit: habitsById.get(reminder.habit_id) }))
    .filter(({ habit }) => isHabitDueOn(habit, today, completionIndex))
    .map(({ reminder, habit }) => ({
      reminder,
      habit,
      isDone: isCompletedOn(completionIndex, habit.id, todayIso),
    }))
    .sort((a, b) => timeToMinutes(a.reminder.remind_at) - timeToMinutes(b.reminder.remind_at))
}

export function getDueReminders(todaysReminders, shownIds, now) {
  const nowMinutes = now.getHours() * 60 + now.getMinutes()
  return todaysReminders.filter(({ reminder, isDone }) => {
    if (isDone || shownIds.has(reminder.id)) return false
    const elapsed = nowMinutes - timeToMinutes(reminder.remind_at)
    return elapsed >= 0 && elapsed < REMINDER_WINDOW_MINUTES
  })
}

export function getUpcomingReminders(todaysReminders, now) {
  const nowMinutes = now.getHours() * 60 + now.getMinutes()
  return todaysReminders.filter(
    ({ reminder, isDone }) => !isDone && timeToMinutes(reminder.remind_at) >= nowMinutes,
  )
}
