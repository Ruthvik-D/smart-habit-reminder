export default function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const entry = payload[0].payload
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs shadow-soft">
      <p className="font-semibold text-navy-900">{entry.tooltipTitle ?? label}</p>
      <p className="mt-0.5 text-navy-600">
        {entry.due > 0 ? `${entry.done} of ${entry.due} done (${entry.rate ?? 0}%)` : 'Nothing was due'}
      </p>
    </div>
  )
}
