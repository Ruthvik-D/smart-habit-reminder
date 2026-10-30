import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  Bell,
  CalendarDays,
  ChartColumn,
  CircleCheck,
  ListChecks,
  LayoutDashboard,
  LogOut,
  Settings,
  UserRound,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { signOut } from '../../services/authService'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/habits', label: 'My Habits', icon: ListChecks },
  { to: '/reminders', label: 'Reminders', icon: Bell },
  { to: '/calendar', label: 'Calendar', icon: CalendarDays },
  { to: '/analytics', label: 'Analytics', icon: ChartColumn },
  { to: '/profile', label: 'Profile', icon: UserRound },
  { to: '/settings', label: 'Settings', icon: Settings },
]

function SidebarContent({ onNavigate }) {
  const { user, profile } = useAuth()
  const [signOutError, setSignOutError] = useState('')
  const [signingOut, setSigningOut] = useState(false)

  const displayName = profile?.display_name || user?.email?.split('@')[0] || 'You'
  const initial = displayName.charAt(0).toUpperCase()

  const handleSignOut = async () => {
    setSigningOut(true)
    setSignOutError('')
    try {
      await signOut()
    } catch (err) {
      setSignOutError(err.message)
      setSigningOut(false)
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-6 py-6">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white shadow-soft">
          <CircleCheck className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="text-base font-semibold text-navy-900">Smart Habit Reminder</span>
      </div>

      <nav className="flex-1 space-y-1 px-3" aria-label="Main navigation">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition duration-200 ${
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-navy-600 hover:bg-slate-100 hover:text-navy-900'
              }`
            }
          >
            <Icon className="h-4.5 w-4.5" aria-hidden="true" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-200/80 p-4">
        <div className="flex items-center gap-3 px-2">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy-100 text-sm font-semibold text-navy-800">
            {initial}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-navy-900">{displayName}</p>
            <p className="truncate text-xs text-navy-500">{user?.email}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          disabled={signingOut}
          className="btn-ghost mt-3 w-full justify-start"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          {signingOut ? 'Signing out...' : 'Sign out'}
        </button>
        {signOutError && <p className="mt-2 px-2 text-xs text-rose-700">{signOutError}</p>}
      </div>
    </div>
  )
}

export default function Sidebar({ open, onClose }) {
  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-slate-200/80 bg-white lg:block">
        <SidebarContent />
      </aside>

      <div className={`fixed inset-0 z-50 lg:hidden ${open ? '' : 'pointer-events-none'}`}>
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className={`absolute inset-0 bg-navy-900/40 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
        />
        <aside
          className={`absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-white shadow-lift transition-transform duration-300 ease-out ${open ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <SidebarContent onNavigate={onClose} />
        </aside>
      </div>
    </>
  )
}
