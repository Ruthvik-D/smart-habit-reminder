import { addDays, eachDay, parseISODate, startOfDay, startOfWeek, toISODate } from './dates'

export function buildCompletionIndex(completions) {
  const index = new Map()
  for (const completion of completions) {
    if (!index.has(completion.habit_id)) index.set(completion.habit_id, new Set())
    index.get(completion.habit_id).add(completion.completed_on)
  }
  return index
}

export function isCompletedOn(index, habitId, isoDate) {
  return index.get(habitId)?.has(isoDate) ?? false
}

function isCompletedInWeekBefore(index, habit, date) {
  const weekStart = startOfWeek(date)
  for (let day = weekStart; day < date; day = addDays(day, 1)) {
    if (isCompletedOn(index, habit.id, toISODate(day))) return true
  }
  return false
}

export function isHabitDueOn(habit, date, index) {
  const day = startOfDay(date)
  if (day < startOfDay(parseISODate(habit.start_date))) return false
  if (habit.frequency === 'daily') return true
  if (habit.frequency === 'weekdays') return habit.weekdays.includes(day.getDay())
  return !isCompletedInWeekBefore(index, habit, day)
}

export function getDueHabitsOn(habits, index, date) {
  const isoDate = toISODate(date)
  return habits
    .filter((habit) => isHabitDueOn(habit, date, index))
    .map((habit) => ({ habit, done: isCompletedOn(index, habit.id, isoDate) }))
}

export function calculateRate(due, done) {
  return due > 0 ? Math.round((done / due) * 100) : null
}

export function getRangeTotals(habits, index, from, to) {
  let due = 0
  let done = 0
  for (const day of eachDay(from, to)) {
    for (const item of getDueHabitsOn(habits, index, day)) {
      due += 1
      if (item.done) done += 1
    }
  }
  return { due, done, rate: calculateRate(due, done) }
}

// Periods are days for daily/weekday habits and weeks for weekly habits.
// The last period is the current one; an unfinished current period does not break a streak.
function getHabitPeriods(habit, index, today) {
  const done = []
  const start = startOfDay(parseISODate(habit.start_date))
  if (habit.frequency === 'weekly') {
    for (let weekStart = startOfWeek(start); weekStart <= today; weekStart = addDays(weekStart, 7)) {
      const weekHasCompletion = eachDay(weekStart, addDays(weekStart, 6)).some((day) =>
        isCompletedOn(index, habit.id, toISODate(day)),
      )
      done.push(weekHasCompletion)
    }
    return done
  }
  for (const day of eachDay(start, today)) {
    if (habit.frequency === 'weekdays' && !habit.weekdays.includes(day.getDay())) continue
    done.push(isCompletedOn(index, habit.id, toISODate(day)))
  }
  return done
}

export function computeHabitStreaks(habit, index, today) {
  const periods = getHabitPeriods(habit, index, startOfDay(today))
  let current = 0
  let cursor = periods.length - 1
  if (cursor >= 0 && !periods[cursor]) cursor -= 1
  while (cursor >= 0 && periods[cursor]) {
    current += 1
    cursor -= 1
  }

  let longest = 0
  let run = 0
  for (const isDone of periods) {
    run = isDone ? run + 1 : 0
    longest = Math.max(longest, run)
  }
  return { current, longest }
}
