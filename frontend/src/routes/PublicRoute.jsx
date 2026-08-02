import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

/** Sends a logged-in user away from public-only pages like /login. */
export default function PublicRoute({ children }) {
  const { user } = useAuth()
  if (user) return <Navigate to="/" replace />
  return children
}
