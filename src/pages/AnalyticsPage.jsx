import PageHeader from '../components/common/PageHeader'
import Alert from '../components/common/Alert'
import EmptyState from '../components/common/EmptyState'
import LoadingState from '../components/common/LoadingState'
import { WeeklyCompletionChart, MonthlyPerformanceChart } from '../components/analytics/PerformanceCharts'
import {
  CategoryPerformanceChart,
  CompletionTrendChart,
  HabitConsistencyChart,
} from '../components/analytics/BreakdownCharts'
import { useHabitData } from '../hooks/useHabitData'
import { startOfDay } from '../utils/dates'
import {
  getCategoryRates,
  getHabitConsistency,
  getMonthlyRates,
  getWeeklyCompletionTrend,
  getWeeklyRates,
} from '../utils/analyticsData'
import { ChartColumn } from 'lucide-react'

function ChartCard({ title, description, children }) {
  return (
    <section className="card animate-slide-up p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-navy-500">{description}</p>
      </div>
      {children}
    </section>
  )
}

export default function AnalyticsPage() {
  const { habits, completions, completionIndex, loaded, error } = useHabitData()
  const today = startOfDay(new Date())

  if (error) {
    return (
      <>
        <PageHeader eyebrow="Your progress" title="Analytics" />
        <Alert>{error}</Alert>
      </>
    )
  }

  if (!loaded) {
    return (
      <>
        <PageHeader eyebrow="Your progress" title="Analytics" />
        <LoadingState label="Loading your analytics..." />
      </>
    )
  }

  return (
    <>
      <PageHeader
        eyebrow="Your progress"
        title="Analytics"
        description="Every chart is calculated from the habits and check-ins you have recorded."
      />

      {habits.length === 0 ? (
        <EmptyState
          icon={ChartColumn}
          title="No data to analyze yet"
          description="Add habits and check them off each day. Your trends will appear here."
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard title="Last 7 days" description="Share of due habits completed each day.">
            <WeeklyCompletionChart data={getWeeklyRates(habits, completionIndex, today)} />
          </ChartCard>

          <ChartCard title="Monthly performance" description="Completion rate for each of the last six months.">
            <MonthlyPerformanceChart data={getMonthlyRates(habits, completionIndex, today)} />
          </ChartCard>

          <ChartCard title="Categories" description="Completion rate by category over the last 30 days.">
            <CategoryPerformanceChart data={getCategoryRates(habits, completionIndex, today)} />
          </ChartCard>

          <ChartCard title="Habit consistency" description="Completion rate for each habit over the last 30 days.">
            <HabitConsistencyChart data={getHabitConsistency(habits, completionIndex, today)} />
          </ChartCard>

          <section className="card animate-slide-up p-6 lg:col-span-2">
            <div className="mb-5">
              <h2 className="text-lg font-semibold">Check-ins per week</h2>
              <p className="text-sm text-navy-500">Total habit check-ins in each of the last 12 weeks.</p>
            </div>
            <CompletionTrendChart data={getWeeklyCompletionTrend(completions, today)} />
          </section>
        </div>
      )}
    </>
  )
}
