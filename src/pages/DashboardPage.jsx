import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Activity, Bell, CircleCheck, Flame, ListChecks, Percent, Trophy } from 'lucide-react'
import PageHeader from '../components/common/PageHeader'
import StatCard from '../components/common/StatCard'
import Alert from '../components/common/Alert'
import EmptyState from '../components/common/EmptyState'
import TodayChecklist from '../components/dashboard/TodayChecklist'
import { WeeklyCompletionChart } from '../components/analytics/PerformanceCharts'
import { useAuth } from '../hooks/useAuth'
import { useHabitData } from '../hooks/useHabitData'
import { formatLongDate, formatDateTime, formatTimeOfDay, getGreeting, addDays, startOfDay, toISODate } from '../utils/dates'
import { calculateRate, computeHabitStreaks, getDueHabitsOn } from '../utils/habitStats'
import { getUpcomingReminders, getTodaysReminders } from '../utils/reminders'
import { getWeeklyRates } from '../utils/analyticsData'

const ACTIVITY_LIMIT = 6
const UPCOMING_LIMIT = 4

export default function DashboardPage() {
  const { user, profile } = useAuth()
  const { habits, completions, reminders, completionIndex, toggleCompletion } = useHabitData()
  const [pendingIds, setPendingIds] = useState(() => new Set())
  const [actionError, setActionError] = useState('')

  const now = new Date()
  const today = startOfDay(now)
  const todayIso = toISODate(now)
  const yesterday = addDays(today, -1)

  const checklist = getDueHabitsOn(habits, completionIndex, today)
  const completedToday = checklist.filter((item) => item.done).length
  const dailyRate = calculateRate(checklist.length, completedToday) ?? 0

  const streaks = habits.map((habit) => computeHabitStreaks(habit, completionIndex, today))
  const bestCurrent = Math.max(0, ...streaks.map((streak) => streak.current))
  const bestLongest = Math.max(0, ...streaks.map((streak) => streak.longest))

  const missedYesterday = getDueHabitsOn(habits, completionIndex, yesterday)
    .filter((item) => !item.done)
    .map((item) => item.habit)

  const upcomingReminders = getUpcomingReminders(
    getTodaysReminders({ reminders, habits, completionIndex, now }),
    now,
  ).slice(0, UPCOMING_LIMIT)

  const habitsById = new Map(habits.map((habit) => [habit.id, habit]))
  const recentActivity = [...completions]
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, ACTIVITY_LIMIT)
    .map((completion) => ({ ...completion, habit: habitsById.get(completion.habit_id) }))
    .filter((completion) => completion.habit)

  const weeklyRates = getWeeklyRates(habits, completionIndex, today)
  const firstName = (profile?.display_name || user?.email?.split('@')[0] || '').split(' ')[0]

  const handleToggle = async (habit, done) => {
    setActionError('')
    setPendingIds((current) => new Set(current).add(habit.id))
    try {
      await toggleCompletion(habit.id, todayIso, done)
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
        eyebrow={formatLongDate(now)}
        title={`${getGreeting(now)}${firstName ? `, ${firstName}` : ''}`}
        description={
          habits.length === 0
            ? 'Add your first habit to start tracking your progress.'
            : `You have ${checklist.length - completedToday} habit${checklist.length - completedToday === 1 ? '' : 's'} left to complete today.`
        }
        actions={
          <Link to="/habits/new" className="btn-primary">
            Add habit
          </Link>
        }
      />

      <section className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5" aria-label="Summary">
        <StatCard icon={ListChecks} label="Active habits" value={habits.length} />
        <StatCard
          icon={CircleCheck}
          label="Completed today"
          value={`${completedToday} / ${checklist.length}`}
          tone="success"
        />
        <StatCard icon={Percent} label="Today's completion" value={`${dailyRate}%`} tone="success" />
        <StatCard icon={Flame} label="Current streak" value={`${bestCurrent} day${bestCurrent === 1 ? '' : 's'}`} detail="Best across habits" tone="warning" />
        <StatCard icon={Trophy} label="Longest streak" value={`${bestLongest} day${bestLongest === 1 ? '' : 's'}`} detail="Best ever across habits" tone="navy" />
      </section>

      {actionError && (
        <div className="mt-6">
          <Alert>{actionError}</Alert>
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <section className="card animate-slide-up p-6 lg:col-span-2" aria-labelledby="checklist-title">
          <div className="mb-5 flex items-center justify-between">
            <h2 id="checklist-title" className="text-lg font-semibold">Today&apos;s checklist</h2>
            <span className="text-sm text-navy-500">
              {completedToday} of {checklist.length} done
            </span>
          </div>
          <div className="mb-5 h-2 overflow-hidden rounded-full bg-slate-100" aria-hidden="true">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-700 ease-out"
              style={{ width: `${dailyRate}%` }}
            />
          </div>
          <TodayChecklist items={checklist} pendingIds={pendingIds} onToggle={handleToggle} />
        </section>

        <section className="card animate-slide-up p-6" aria-labelledby="upcoming-title">
          <div className="mb-5 flex items-center gap-2">
            <Bell className="h-4.5 w-4.5 text-primary-600" aria-hidden="true" />
            <h2 id="upcoming-title" className="text-lg font-semibold">Upcoming reminders</h2>
          </div>
          {upcomingReminders.length === 0 ? (
            <p className="text-sm text-navy-500">No more reminders scheduled for today.</p>
          ) : (
            <ul className="space-y-3">
              {upcomingReminders.map(({ reminder, habit }) => (
                <li key={reminder.id} className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-4 py-3">
                  <span className="truncate text-sm font-medium text-navy-900">{habit.title}</span>
                  <span className="shrink-0 text-xs font-medium text-primary-700">
                    {formatTimeOfDay(reminder.remind_at)}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <Link to="/reminders" className="mt-4 inline-block text-sm font-medium text-primary-600 hover:text-primary-700">
            Manage reminders
          </Link>
        </section>

        <section className="card animate-slide-up p-6 lg:col-span-2" aria-labelledby="weekly-title">
          <div className="mb-5">
            <h2 id="weekly-title" className="text-lg font-semibold">Weekly completion</h2>
            <p className="text-sm text-navy-500">Share of due habits completed each day this week.</p>
          </div>
          <WeeklyCompletionChart data={weeklyRates} />
        </section>

        <section className="card animate-slide-up p-6" aria-labelledby="missed-title">
          <div className="mb-5 flex items-center gap-2">
            <Activity className="h-4.5 w-4.5 text-amber-600" aria-hidden="true" />
            <h2 id="missed-title" className="text-lg font-semibold">Missed yesterday</h2>
          </div>
          {missedYesterday.length === 0 ? (
            <p className="text-sm text-navy-500">Nothing was missed yesterday. Keep it up.</p>
          ) : (
            <ul className="space-y-2">
              {missedYesterday.map((habit) => (
                <li key={habit.id} className="flex items-center gap-2 text-sm text-navy-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" aria-hidden="true" />
                  {habit.title}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card animate-slide-up p-6 lg:col-span-3" aria-labelledby="activity-title">
          <h2 id="activity-title" className="mb-5 text-lg font-semibold">Recent activity</h2>
          {recentActivity.length === 0 ? (
            <EmptyState
              icon={Activity}
              title="No activity yet"
              description="Completed habits will appear here so you can see your recent progress."
            />
          ) : (
            <ul className="divide-y divide-slate-100">
              {recentActivity.map((completion) => (
                <li key={`${completion.habit_id}-${completion.completed_on}`} className="flex items-center justify-between gap-4 py-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                      <CircleCheck className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <p className="truncate text-sm text-navy-800">
                      Completed <span className="font-medium text-navy-900">{completion.habit.title}</span>
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-navy-500">{formatDateTime(completion.created_at)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  )
}
