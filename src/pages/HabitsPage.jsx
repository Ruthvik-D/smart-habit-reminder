import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ListChecks, Plus } from 'lucide-react'
import PageHeader from '../components/common/PageHeader'
import EmptyState from '../components/common/EmptyState'
import ConfirmDialog from '../components/common/ConfirmDialog'
import HabitCard from '../components/habits/HabitCard'
import { useHabitData } from '../hooks/useHabitData'
import { CATEGORIES } from '../lib/constants'
import { computeHabitStreaks } from '../utils/habitStats'

export default function HabitsPage() {
  const { habits, completionIndex, removeHabit } = useHabitData()
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [habitToDelete, setHabitToDelete] = useState(null)

  const streaks = useMemo(
    () =>
      new Map(
        habits.map((habit) => [habit.id, computeHabitStreaks(habit, completionIndex, new Date())]),
      ),
    [habits, completionIndex],
  )

  const visibleHabits = habits.filter(
    (habit) => categoryFilter === 'All' || habit.category === categoryFilter,
  )

  return (
    <>
      <PageHeader
        eyebrow="Your routines"
        title="My Habits"
        description="Create, refine, and retire the habits you are working on."
        actions={
          <Link to="/habits/new" className="btn-primary">
            <Plus className="h-4 w-4" aria-hidden="true" />
            New habit
          </Link>
        }
      />

      {habits.length === 0 ? (
        <EmptyState
          icon={ListChecks}
          title="No habits yet"
          description="Start with one small habit you can do every day. You can add more later."
          action={
            <Link to="/habits/new" className="btn-primary">
              Create your first habit
            </Link>
          }
        />
      ) : (
        <>
          <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
            {['All', ...CATEGORIES].map((category) => (
              <button
                key={category}
                type="button"
                aria-pressed={categoryFilter === category}
                onClick={() => setCategoryFilter(category)}
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition duration-200 ${
                  categoryFilter === category
                    ? 'bg-navy-900 text-white'
                    : 'bg-white text-navy-600 ring-1 ring-slate-200 hover:ring-slate-400'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {visibleHabits.length === 0 ? (
            <p className="py-12 text-center text-sm text-navy-500">No habits in this category yet.</p>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {visibleHabits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  streak={streaks.get(habit.id)}
                  onDelete={setHabitToDelete}
                />
              ))}
            </div>
          )}
        </>
      )}

      {habitToDelete && (
        <ConfirmDialog
          title="Delete this habit?"
          message={`"${habitToDelete.title}" and its completion history and reminders will be permanently removed.`}
          confirmLabel="Delete habit"
          onConfirm={() => removeHabit(habitToDelete.id)}
          onClose={() => setHabitToDelete(null)}
        />
      )}
    </>
  )
}
