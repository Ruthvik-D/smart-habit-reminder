import { addMonths, eachDay, startOfDay, startOfMonth, startOfWeek, addDays, toISODate } from './dates'
import { getRangeTotals } from './habitStats'
import { CATEGORIES } from '../lib/constants'

export function getWeeklyRates(habits, index, today) {
  const end = startOfDay(today)
  const start = addDays(end, -6)
  return eachDay(start, end).map((day) => ({
    label: day.toLocaleDateString(undefined, { weekday: 'short' }),
    ...getRangeTotals(habits, index, day, day),
  }))
}

export function getMonthlyRates(habits, index, today, months = 6) {
  const end = startOfDay(today)
  const result = []
  for (let offset = months - 1; offset >= 0; offset -= 1) {
    const monthStart = addMonths(startOfMonth(end), -offset)
    const monthEnd = addMonths(monthStart, 1)
    const to = new Date(monthEnd.getFullYear(), monthEnd.getMonth(), 0)
    const rangeEnd = to > end ? end : to
    result.push({
      label: monthStart.toLocaleDateString(undefined, { month: 'short' }),
      ...getRangeTotals(habits, index, monthStart, rangeEnd),
    })
  }
  return result
}

export function getCategoryRates(habits, index, today, days = 30) {
  const end = startOfDay(today)
  const start = addDays(end, -(days - 1))
  return CATEGORIES.map((category) => {
    const categoryHabits = habits.filter((habit) => habit.category === category)
    const totals = getRangeTotals(categoryHabits, index, start, end)
    return { label: category, habitCount: categoryHabits.length, ...totals }
  }).filter((entry) => entry.habitCount > 0)
}

export function getHabitConsistency(habits, index, today, days = 30) {
  const end = startOfDay(today)
  const start = addDays(end, -(days - 1))
  return habits
    .map((habit) => ({ label: habit.title, category: habit.category, ...getRangeTotals([habit], index, start, end) }))
    .sort((a, b) => (b.rate ?? -1) - (a.rate ?? -1))
}

export function getWeeklyCompletionTrend(completions, today, weeks = 12) {
  const currentWeek = startOfWeek(today)
  const counts = new Map()
  for (const completion of completions) {
    const key = toISODate(startOfWeek(new Date(`${completion.completed_on}T00:00:00`)))
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }
  const result = []
  for (let offset = weeks - 1; offset >= 0; offset -= 1) {
    const weekStart = addDays(currentWeek, -7 * offset)
    result.push({
      label: weekStart.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      completions: counts.get(toISODate(weekStart)) ?? 0,
    })
  }
  return result
}
