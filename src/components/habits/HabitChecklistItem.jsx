import { Check } from 'lucide-react'
import { formatFrequency } from '../../utils/habitLabels'

export default function HabitChecklistItem({ habit, done, pending, onToggle }) {
  return (
    <li className="flex items-center gap-4 rounded-xl border border-slate-200/80 bg-white px-4 py-3 transition duration-200 hover:border-slate-300">
      <button
        type="button"
        onClick={onToggle}
        disabled={pending}
        aria-pressed={done}
        aria-label={done ? `Undo ${habit.title}` : `Mark ${habit.title} as done`}
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition duration-200 active:scale-90 disabled:cursor-wait disabled:opacity-60 ${
          done ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-300 text-transparent hover:border-primary-500'
        }`}
      >
        <Check className="h-4 w-4" strokeWidth={3} aria-hidden="true" />
      </button>
      <div className="min-w-0 flex-1">
        <p className={`truncate text-sm font-medium transition-colors ${done ? 'text-navy-400 line-through' : 'text-navy-900'}`}>
          {habit.title}
        </p>
        <p className="truncate text-xs text-navy-500">
          {habit.category} · {formatFrequency(habit)}
        </p>
      </div>
    </li>
  )
}
