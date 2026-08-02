export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export function isRequired(value) {
  return value !== undefined && value !== null && String(value).trim() !== ''
}

export function minLength(value, n) {
  return String(value ?? '').length >= n
}
