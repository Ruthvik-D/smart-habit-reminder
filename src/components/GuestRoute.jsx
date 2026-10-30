import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import LoadingState from './common/LoadingState'

export default function GuestRoute() {
  const { user, loading } = useAuth()
  if (loading) return <LoadingState fullScreen />
  if (user && !user.email_confirmed_at) {
    return <Navigate to="/verify-email" replace state={{ email: user.email }} />
  }
  if (user) return <Navigate to="/dashboard" replace />
  return <Outlet />
}
