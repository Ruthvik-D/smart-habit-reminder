import { ChevronLeft, ChevronRight } from 'lucide-react'
import { formatMonthYear } from '../../utils/dates'

const WEEKDAY_HEADERS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function getCellTone(cell) {
  if (cell.isFuture) return 'bg-white text-slate-300 ring-1 ring-slate-100'
  if (cell.due === 0) return 'bg-slate-100 text-navy-400'
  if (cell.done === cell.due) return 'bg-emerald-500 text-white'
  if (cell.done === 0) return 'bg-rose-100 text-rose-800'
  return cell.done / cell.due >= 0.5 ? 'bg-emerald-200 text-emerald-900' : 'bg-amber-100 text-amber-900'
}

const LEGEND = [
  { label: 'All done', className: 'bg-emerald-500' },
  { label: 'Partly done', className: 'bg-amber-100' },
  { label: 'Missed', className: 'bg-rose-100' },
  { label: 'Not due', className: 'bg-slate-100' },
]

export default function MonthHeatmap({ monthDate, cells, selectedIso, todayIso, canGoNext, onPrev, onNext, onSelect }) {
  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold">{formatMonthYear(monthDate)}</h2>
        <div className="flex items-center gap-2">
          <button type="button" className="btn-secondary px-2.5 py-2" onClick={onPrev} aria-label="Previous month">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button type="button" className="btn-secondary px-2.5 py-2" onClick={onNext} disabled={!canGoNext} aria-label="Next month">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-xs font-medium text-navy-500">
        {WEEKDAY_HEADERS.map((header) => (
          <span key={header} className="pb-1">{header}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {cells.map((cell, index) => {
          if (!cell) return <span key={`blank-${index}`} aria-hidden="true" />
          const isSelected = cell.iso === selectedIso
          const isToday = cell.iso === todayIso
          const label = `${cell.date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}: ${
            cell.due === 0 ? 'nothing due' : `${cell.done} of ${cell.due} done`
          }`
          return (
            <button
              key={cell.iso}
              type="button"
              aria-label={label}
              aria-pressed={isSelected}
              disabled={cell.isFuture}
              onClick={() => onSelect(cell.iso)}
              className={`relative flex aspect-square flex-col items-center justify-center rounded-xl text-sm font-medium transition duration-200 hover:scale-[1.04] disabled:cursor-not-allowed disabled:hover:scale-100 ${getCellTone(cell)} ${
                isSelected ? 'ring-2 ring-navy-900 ring-offset-2' : ''
              }`}
            >
              {cell.date.getDate()}
              {isToday && <span className="absolute bottom-1.5 h-1 w-1 rounded-full bg-primary-600" aria-hidden="true" />}
            </button>
          )
        })}
      </div>

      <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs text-navy-500">
        {LEGEND.map((item) => (
          <span key={item.label} className="flex items-center gap-2">
            <span className={`h-3 w-3 rounded-md ${item.className}`} aria-hidden="true" />
            {item.label}
          </span>
        ))}
      </div>
    </div>
  )
}
