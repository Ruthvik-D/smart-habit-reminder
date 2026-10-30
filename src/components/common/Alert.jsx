import { CircleCheck, Info, TriangleAlert } from 'lucide-react'

const STYLES = {
  error: { box: 'border-rose-200 bg-rose-50 text-rose-800', Icon: TriangleAlert },
  success: { box: 'border-emerald-200 bg-emerald-50 text-emerald-800', Icon: CircleCheck },
  info: { box: 'border-primary-200 bg-primary-50 text-primary-900', Icon: Info },
}

export default function Alert({ tone = 'error', children, action }) {
  const { box, Icon } = STYLES[tone]
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} className={`animate-fade-in flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${box}`}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <div className="flex-1">{children}</div>
      {action}
    </div>
  )
}
