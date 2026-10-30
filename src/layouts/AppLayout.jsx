import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import { Menu } from 'lucide-react'
import Sidebar from '../components/layout/Sidebar'
import ReminderNotifier from '../components/reminders/ReminderNotifier'
import Alert from '../components/common/Alert'
import LoadingState from '../components/common/LoadingState'
import { useHabitData } from '../hooks/useHabitData'

export default function AppLayout() {
  const { loaded, error, reload } = useHabitData()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-canvas">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 py-3 backdrop-blur lg:hidden">
          <span className="text-sm font-semibold text-navy-900">Smart Habit Reminder</span>
          <button
            type="button"
            className="btn-ghost px-2"
            aria-label="Open navigation"
            onClick={() => setMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
        </header>

        <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          {error && (
            <div className="mb-6">
              <Alert
                action={
                  <button type="button" className="btn-secondary px-3 py-1.5" onClick={reload}>
                    Try again
                  </button>
                }
              >
                {error}
              </Alert>
            </div>
          )}
          {loaded ? <Outlet /> : !error && <LoadingState label="Loading your habits..." />}
        </main>
      </div>

      <ReminderNotifier />
    </div>
  )
}
