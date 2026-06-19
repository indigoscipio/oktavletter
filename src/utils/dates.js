export function toDateInputValue(date = new Date()) {
  const value = new Date(date)
  value.setMinutes(value.getMinutes() - value.getTimezoneOffset())
  return value.toISOString().slice(0, 10)
}

export function dateInputToIso(value) {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day).toISOString()
}

export function formatDate(value) {
  const date = parseDate(value)
  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export function isFutureDate(value) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const date = parseDate(value)
  date.setHours(0, 0, 0, 0)

  return date > today
}

export function isReadyToOpen(letter) {
  return !letter.openedAt && parseDate(letter.openDate) <= new Date()
}

export function getLetterState(letter) {
  if (letter.openedAt) return 'opened'
  if (isReadyToOpen(letter)) return 'ready'
  return 'waiting'
}

export function getDaysUntil(value) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const target = parseDate(value)
  target.setHours(0, 0, 0, 0)

  return Math.ceil((target - today) / 86400000)
}

function parseDate(value) {
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split('-').map(Number)
    return new Date(year, month - 1, day)
  }

  return new Date(value)
}
