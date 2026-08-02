import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

/** Gate a route to one or more roles, e.g. <RoleRoute roles={['admin']}>. */
export default function RoleRoute({ roles = [], children }) {
  const { user, role, isLoading } = useAuth()
  if (isLoading) return <div className="grid min-h-screen place-items-center text-sm text-ink-soft">Loading your account…</div>
  if (!user) return <Navigate to="/login" replace />
  if (roles.length && !roles.map((item) => item.toUpperCase()).includes(role)) return <Navigate to="/" replace />
  return children
}
