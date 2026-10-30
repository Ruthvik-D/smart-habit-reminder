import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { HabitDataProvider } from '../context/HabitDataProvider'
import AppLayout from '../layouts/AppLayout'
import LoadingState from './common/LoadingState'

export default function ProtectedRoute() {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <LoadingState fullScreen label="Loading your workspace..." />
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (!user.email_confirmed_at) {
    return <Navigate to="/verify-email" replace state={{ email: user.email }} />
  }

  return (
    <HabitDataProvider>
      <AppLayout />
    </HabitDataProvider>
  )
}
