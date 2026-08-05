/** Converts API-relative upload paths into URLs served by the backend, not Vite. */
export function fileUrl(value) {
  if (!value || /^https?:\/\//i.test(value)) return value
  const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api'
  const backendUrl = apiUrl.replace(/\/api\/?$/, '')
  return `${backendUrl}${value.startsWith('/') ? value : `/${value}`}`
}
