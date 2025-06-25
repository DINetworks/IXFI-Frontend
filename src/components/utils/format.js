export function formatCurrency(value, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 4
  }).format(value)
}

export function formatNumber(value, maximumFractionDigits = 9) {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: maximumFractionDigits
  }).format(value)
}

export function formatNumberDefault(value) {
  return new Intl.NumberFormat('en-US').format(value)
}

export function formatPercent(value, maximumFractionDigits = 2) {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    maximumFractionDigits: maximumFractionDigits
  }).format(value)
}

export function formatDate(date) {
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function formatDateShort(date) {
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const MIN_SECS = 60
const HOUR_SECS = MIN_SECS * 60
const DAY_SECS = HOUR_SECS * 24
const MONTH_SECS = DAY_SECS * 30

export function calcDurationBefore(availableAfter) {
  const months = Math.floor(availableAfter / MONTH_SECS)
  availableAfter %= MONTH_SECS

  const days = Math.floor(availableAfter / DAY_SECS)
  availableAfter %= DAY_SECS

  const hours = Math.floor(availableAfter / HOUR_SECS)
  availableAfter %= HOUR_SECS

  const mins = Math.floor(availableAfter / MIN_SECS)
  const secs = availableAfter % MIN_SECS

  let timeBefore = 'available after '

  if (months > 0) {
    timeBefore += `${months} month${months > 1 ? 's' : ''}`
    if (days > 0) timeBefore += ` ${days} day${days > 1 ? 's' : ''}`
  } else if (days > 0) {
    timeBefore += `${days} day${days > 1 ? 's' : ''}`
    if (hours > 0) timeBefore += ` ${hours} hour${hours > 1 ? 's' : ''}`
    timeBefore += ' later'
  } else {
    if (hours > 0) timeBefore += `${hours} hour${hours > 1 ? 's' : ''} `
    if (mins > 0) timeBefore += `${mins} min${mins > 1 ? 's' : ''} `
    if (hours === 0 && mins === 0) timeBefore += `${secs} sec${secs > 1 ? 's' : ''} `
    timeBefore += 'later'
  }

  return timeBefore
}
