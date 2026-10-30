import HabitChecklistItem from '../habits/HabitChecklistItem'

export default function DayDetailPanel({ dateLabel, items, isFuture, pendingIds, onToggle }) {
  const doneCount = items.filter((item) => item.done).length
  const missedCount = items.length - doneCount

  return (
    <div>
      <h2 className="text-lg font-semibold">{dateLabel}</h2>
      {isFuture ? (
        <p className="mt-1 text-sm text-navy-500">Future days can be completed when they arrive.</p>
      ) : (
        <p className="mt-1 text-sm text-navy-500">
          {items.length === 0
            ? 'Nothing was scheduled for this day.'
            : `${doneCount} done${missedCount > 0 ? `, ${missedCount} missed` : ''}. Tap a habit to change it.`}
        </p>
      )}

      {items.length > 0 && (
        <ul className="mt-5 space-y-3">
          {items.map(({ habit, done }) => (
            <HabitChecklistItem
              key={habit.id}
              habit={habit}
              done={done}
              pending={isFuture || pendingIds.has(habit.id)}
              onToggle={() => onToggle(habit, done)}
            />
          ))}
        </ul>
      )}
    </div>
  )
}
