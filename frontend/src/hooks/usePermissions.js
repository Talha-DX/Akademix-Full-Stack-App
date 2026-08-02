import { useAuth } from './useAuth'
import { can } from '../utils/permissions'

export function usePermissions() {
  const { role } = useAuth()
  return {
    can: (permission) => can(role, permission),
  }
}
