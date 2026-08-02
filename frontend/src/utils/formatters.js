export function formatCurrency(amount, currency = 'PKR') {
  return new Intl.NumberFormat('en-PK', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount)
}

export function formatPercent(value) {
  return `${Math.round(value)}%`
}

export function truncate(text, max = 60) {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text
}
