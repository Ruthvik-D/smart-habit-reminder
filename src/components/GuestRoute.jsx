import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import LoadingState from './common/LoadingState'

export default function GuestRoute() {
  const { user, loading } = useAuth()
  if (loading) return <LoadingState fullScreen />
  if (user) return <Navigate to="/dashboard" replace />
  return <Outlet />
}
