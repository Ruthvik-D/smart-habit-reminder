import { useMemo, useState } from 'react'
import { CalendarCheck, Percent } from 'lucide-react'
import PageHeader from '../components/common/PageHeader'
import Alert from '../components/common/Alert'
import StatCard from '../components/common/StatCard'
import MonthHeatmap from '../components/calendar/MonthHeatmap'
import DayDetailPanel from '../components/calendar/DayDetailPanel'
import { useHabitData } from '../hooks/useHabitData'
import { buildMonthCells } from '../utils/calendarData'
import { addMonths, formatLongDate, parseISODate, startOfDay, startOfMonth, toISODate } from '../utils/dates'
import { calculateRate, getDueHabitsOn, getRangeTotals } from '../utils/habitStats'

export default function CalendarPage() {
  const { habits, completionIndex, loaded, error, toggleCompletion } = useHabitData()
  const today = startOfDay(new Date())
  const todayIso = toISODate(today)
  const [monthDate, setMonthDate] = useState(() => startOfMonth(today))
  const [selectedIso, setSelectedIso] = useState(todayIso)
  const [pendingIds, setPendingIds] = useState(() => new Set())
  const [actionError, setActionError] = useState('')

  const currentMonthStart = startOfMonth(today)
  const canGoNext = monthDate < currentMonthStart
  const isCurrentMonth = monthDate.getTime() === currentMonthStart.getTime()

  const cells = useMemo(
    () => buildMonthCells(monthDate, habits, completionIndex, today),
    [monthDate, habits, completionIndex, today],
  )

  const monthSummary = useMemo(() => {
    const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0)
    const rangeEnd = isCurrentMonth ? today : monthEnd
    const { due, done } = getRangeTotals(habits, completionIndex, monthDate, rangeEnd)
    return { due, done, rate: calculateRate(due, done) }
  }, [habits, completionIndex, monthDate, isCurrentMonth, today])

  const selectedDate = parseISODate(selectedIso)
  const selectedItems = getDueHabitsOn(habits, completionIndex, selectedDate)
  const selectedIsFuture = selectedDate > today

  const goToMonth = (date) => {
    setMonthDate(startOfMonth(date))
    setSelectedIso(toISODate(startOfMonth(date)))
  }

  const handleToggle = async (habit, done) => {
    setActionError('')
    setPendingIds((current) => new Set(current).add(habit.id))
    try {
      await toggleCompletion(habit.id, selectedIso, done)
    } catch (err) {
      setActionError(err.message)
    } finally {
      setPendingIds((current) => {
        const next = new Set(current)
        next.delete(habit.id)
        return next
      })
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Look back"
        title="Calendar"
        description="See which days you kept up with your habits. Select any past day to review or update it."
      />

      {error && (
        <div className="mb-6">
          <Alert>{error}</Alert>
        </div>
      )}
      {actionError && (
        <div className="mb-6">
          <Alert>{actionError}</Alert>
        </div>
      )}

      <section className="mb-6 grid grid-cols-2 gap-4" aria-label="Month summary">
        <StatCard
          icon={CalendarCheck}
          label="Habits completed"
          value={`${monthSummary.done} / ${monthSummary.due}`}
          detail={isCurrentMonth ? 'So far this month' : 'Across the month'}
          tone="success"
        />
        <StatCard
          icon={Percent}
          label="Completion rate"
          value={monthSummary.rate === null ? '--' : `${monthSummary.rate}%`}
          tone="navy"
        />
      </section>

      {!loaded ? null : habits.length === 0 ? (
        <section className="card p-6 text-sm text-navy-500">
          Add a habit to start filling in your calendar.
        </section>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <section className="card animate-slide-up p-6 lg:col-span-2" aria-label="Monthly heatmap">
            <MonthHeatmap
              monthDate={monthDate}
              cells={cells}
              selectedIso={selectedIso}
              todayIso={todayIso}
              canGoNext={canGoNext}
              onPrev={() => goToMonth(addMonths(monthDate, -1))}
              onNext={() => goToMonth(addMonths(monthDate, 1))}
              onSelect={setSelectedIso}
            />
          </section>

          <section className="card animate-slide-up p-6" aria-label="Selected day">
            <DayDetailPanel
              dateLabel={formatLongDate(selectedDate)}
              items={selectedItems}
              isFuture={selectedIsFuture}
              pendingIds={pendingIds}
              onToggle={handleToggle}
            />
          </section>
        </div>
      )}
    </>
  )
}
