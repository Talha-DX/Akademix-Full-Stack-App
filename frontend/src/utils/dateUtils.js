export function formatDate(date, locale = 'en-GB') {
  const d = date instanceof Date ? date : new Date(date)
  return d.toLocaleDateString(locale, { day: '2-digit', month: 'short', year: 'numeric' })
}

export function today() {
  return new Date().toISOString().slice(0, 10)
}

export function isSameDay(a, b) {
  const da = new Date(a)
  const db = new Date(b)
  return da.toDateString() === db.toDateString()
}
