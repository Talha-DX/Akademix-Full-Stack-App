import { useAuthContext } from '../context/AuthContext'

// Thin convenience wrapper so pages import from hooks/ instead of context/.
export function useAuth() {
  return useAuthContext()
}
