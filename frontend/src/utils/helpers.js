export function classNames(...values) {
  return values.filter(Boolean).join(' ')
}

export function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')
}

export function debounceAsync(fn, delay = 300) {
  let timer
  return (...args) =>
    new Promise((resolve) => {
      clearTimeout(timer)
      timer = setTimeout(() => resolve(fn(...args)), delay)
    })
}
