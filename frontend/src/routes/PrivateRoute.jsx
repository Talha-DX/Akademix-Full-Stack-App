import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

/** Redirects to /login unless someone is signed in. */
export default function PrivateRoute({ children }) {
  const { user, isLoading } = useAuth()
  if (isLoading) return <div className="grid min-h-screen place-items-center text-sm text-ink-soft">Loading your account…</div>
  if (!user) return <Navigate to="/login" replace />
  return children
}
