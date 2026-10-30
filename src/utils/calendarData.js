import { eachDay, startOfDay, startOfMonth, toISODate } from './dates'
import { getDueHabitsOn } from './habitStats'

export function buildMonthCells(monthDate, habits, completionIndex, today) {
  const first = startOfMonth(monthDate)
  const last = new Date(first.getFullYear(), first.getMonth() + 1, 0)
  const todayStart = startOfDay(today)
  const leadingBlanks = (first.getDay() + 6) % 7
  const cells = Array(leadingBlanks).fill(null)

  for (const day of eachDay(first, last)) {
    const items = getDueHabitsOn(habits, completionIndex, day)
    cells.push({
      date: day,
      iso: toISODate(day),
      due: items.length,
      done: items.filter((item) => item.done).length,
      isFuture: day > todayStart,
    })
  }

  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}
