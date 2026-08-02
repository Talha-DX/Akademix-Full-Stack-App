import { ROLES } from './constants'

// Very small permission map — expand as real auth/roles land.
const PERMISSIONS = {
  [ROLES.ADMIN]: ['*'],
  [ROLES.TEACHER]: ['attendance:write', 'homework:write', 'exams:write'],
  [ROLES.STUDENT]: ['homework:read', 'results:read'],
}

export function can(role, permission) {
  const granted = PERMISSIONS[role] ?? []
  return granted.includes('*') || granted.includes(permission)
}
