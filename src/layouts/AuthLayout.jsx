import { Link } from 'react-router-dom'
import { CircleCheck } from 'lucide-react'

export default function AuthLayout({ title, subtitle, footer, children }) {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <header className="px-6 py-6">
        <Link to="/" className="inline-flex items-center gap-2.5 rounded-lg text-navy-900">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white">
            <CircleCheck className="h-4.5 w-4.5" aria-hidden="true" />
          </span>
          <span className="text-sm font-semibold">Smart Habit Reminder</span>
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 pb-12">
        <div className="animate-slide-up w-full max-w-md">
          <div className="card p-8">
            <h1 className="text-2xl font-semibold">{title}</h1>
            <p className="mt-2 text-sm text-navy-500">{subtitle}</p>
            <div className="mt-8">{children}</div>
          </div>
          <div className="mt-6 text-center text-sm text-navy-500">{footer}</div>
        </div>
      </main>
    </div>
  )
}
