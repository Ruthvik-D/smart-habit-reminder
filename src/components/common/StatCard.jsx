export default function StatCard({ icon: Icon, label, value, detail, tone = 'primary' }) {
  const tones = {
    primary: 'bg-primary-50 text-primary-600',
    success: 'bg-emerald-50 text-emerald-600',
    warning: 'bg-amber-50 text-amber-600',
    navy: 'bg-navy-50 text-navy-700',
  }
  return (
    <div className="card animate-slide-up p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-lift">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-navy-500">{label}</p>
        <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${tones[tone]}`}>
          <Icon className="h-4.5 w-4.5" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-3 text-2xl font-semibold text-navy-900">{value}</p>
      {detail && <p className="mt-1 text-xs text-navy-500">{detail}</p>}
    </div>
  )
}
