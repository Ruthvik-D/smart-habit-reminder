import { Link } from 'react-router-dom'
import { Flame, Pencil, Trash2 } from 'lucide-react'
import { CATEGORY_COLORS } from '../../lib/constants'
import { formatFrequency } from '../../utils/habitLabels'

export default function HabitCard({ habit, streak, onDelete }) {
  return (
    <article className="card animate-slide-up flex flex-col p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-lift">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="inline-flex items-center gap-2 text-xs font-medium text-navy-500">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: CATEGORY_COLORS[habit.category] }}
              aria-hidden="true"
            />
            {habit.category}
          </span>
          <h3 className="mt-2 truncate text-base font-semibold">{habit.title}</h3>
        </div>
        <span className="badge shrink-0 gap-1 bg-amber-50 text-amber-700" title="Current streak">
          <Flame className="h-3.5 w-3.5" aria-hidden="true" />
          {streak.current}
        </span>
      </div>

      {habit.description && (
        <p className="mt-3 line-clamp-2 text-sm text-navy-500">{habit.description}</p>
      )}

      <p className="mt-4 text-xs text-navy-500">
        {formatFrequency(habit)} · Longest streak {streak.longest}
      </p>

      <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4">
        <Link to={`/habits/${habit.id}/edit`} className="btn-secondary flex-1 px-3 py-2">
          <Pencil className="h-4 w-4" aria-hidden="true" />
          Edit
        </Link>
        <button
          type="button"
          onClick={() => onDelete(habit)}
          className="btn-ghost text-rose-600 hover:bg-rose-50 hover:text-rose-700"
          aria-label={`Delete ${habit.title}`}
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          Delete
        </button>
      </div>
    </article>
  )
}
