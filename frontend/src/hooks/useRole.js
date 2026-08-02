import { useAuth } from './useAuth'

export function useRole() {
  const { role } = useAuth()
  return role
}
