import { CheckCheck } from 'lucide-react'
import EmptyState from '../common/EmptyState'
import HabitChecklistItem from '../habits/HabitChecklistItem'

export default function TodayChecklist({ items, pendingIds, onToggle }) {
  if (items.length === 0) {
    return (
      <EmptyState
        icon={CheckCheck}
        title="Nothing is scheduled today"
        description="Enjoy the free day, or add a habit that fits today's schedule."
      />
    )
  }

  return (
    <ul className="space-y-3">
      {items.map(({ habit, done }) => (
        <HabitChecklistItem
          key={habit.id}
          habit={habit}
          done={done}
          pending={pendingIds.has(habit.id)}
          onToggle={() => onToggle(habit, done)}
        />
      ))}
    </ul>
  )
}
