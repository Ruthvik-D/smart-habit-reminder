import { Link } from 'react-router-dom'
import { Bell, ChartColumn, CircleCheck, Flame, ArrowRight } from 'lucide-react'

const FEATURES = [
  {
    icon: CircleCheck,
    title: 'A checklist that fits your week',
    text: 'Set habits to repeat every day, on chosen weekdays, or once a week. Tick them off in seconds and undo a mistake whenever you need to.',
  },
  {
    icon: Bell,
    title: 'Reminders at the times you choose',
    text: 'Schedule one or more reminder times per habit. Reminders appear as browser notifications while Smart Habit Reminder is open in a tab.',
  },
  {
    icon: ChartColumn,
    title: 'Honest progress, not inflated scores',
    text: 'Track streaks, daily completion, and missed habits on a calendar heatmap, with charts for weekly, monthly, and category trends.',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-canvas text-navy-900">
      <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-canvas/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2.5 rounded-lg">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white">
              <CircleCheck className="h-4.5 w-4.5" aria-hidden="true" />
            </span>
            <span className="text-sm font-semibold">Smart Habit Reminder</span>
          </Link>
          <nav className="flex items-center gap-2">
            <Link to="/login" className="btn-ghost">
              Sign in
            </Link>
            <Link to="/register" className="btn-primary">
              Get started
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-20 pt-16 lg:grid-cols-2 lg:pt-24">
          <div className="animate-slide-up">
            <span className="badge mb-6 gap-1.5 bg-primary-50 text-primary-700">
              <Flame className="h-3.5 w-3.5" aria-hidden="true" />
              Built for steady, realistic routines
            </span>
            <h1 className="text-4xl font-semibold leading-[1.15] sm:text-5xl">
              Small routines, kept consistently.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-navy-500">
              Smart Habit Reminder helps you plan the habits that matter, get nudged at the right time,
              and see your progress clearly, so consistency becomes a normal part of your day.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/register" className="btn-primary px-6 py-3">
                Start tracking free
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link to="/login" className="btn-secondary px-6 py-3">
                I already have an account
              </Link>
            </div>
          </div>

          <div className="animate-fade-in relative">
            <img
              src="https://images.pexels.com/photos/5052858/pexels-photo-5052858.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
              alt="A person writing a plan in a notebook beside a cup of coffee"
              className="h-[380px] w-full rounded-3xl object-cover shadow-lift sm:h-[460px]"
              loading="eager"
            />
            <div className="absolute -bottom-5 left-6 right-6 rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-lift sm:left-auto sm:right-8 sm:w-72">
              <p className="text-xs font-medium uppercase tracking-wide text-navy-400">Reminder</p>
              <p className="mt-1 text-sm font-semibold">Time for your morning walk</p>
              <p className="mt-0.5 text-xs text-navy-500">Mark it done when you finish.</p>
            </div>
          </div>
        </section>

        <section className="border-t border-slate-200/70 bg-white">
          <div className="mx-auto grid max-w-6xl gap-6 px-6 py-20 md:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <article
                key={title}
                className="card p-7 transition duration-200 hover:-translate-y-1 hover:shadow-lift"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h2 className="mt-5 text-lg font-semibold">{title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-navy-500">{text}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="px-6 py-8 text-center text-xs text-navy-500">
        Smart Habit Reminder. Your habits and progress are private to your account.
      </footer>
    </div>
  )
}
