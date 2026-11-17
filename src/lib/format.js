import { url } from '../Redux/server'

const currencyFormatter = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 2,
})

const compactCurrencyFormatter = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
  notation: 'compact',
  maximumFractionDigits: 1,
})

const numberFormatter = new Intl.NumberFormat('de-DE')

const toNumber = (value) => {
  const n = Number(value)
  return Number.isFinite(n) ? n : 0
}

export const formatCurrency = (value) => currencyFormatter.format(toNumber(value))
export const formatCompactCurrency = (value) =>
  compactCurrencyFormatter.format(toNumber(value))
export const formatNumber = (value) => numberFormatter.format(toNumber(value))

export const formatDateTime = (value) => {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const formatRelativeTime = (value) => {
  if (!value) return ''
  const diff = Date.now() - new Date(value).getTime()
  const minutes = Math.round(diff / 60000)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(hours / 24)
  if (days < 7) return `${days}d ago`
  return formatDateTime(value)
}

// Backend returns either absolute URLs (cloud storage) or relative paths.
export const imageUrl = (path) => {
  if (!path || typeof path !== 'string') return undefined
  if (/^(https?:|data:|blob:)/i.test(path)) return path
  return `${url}/${path.replace(/^\/+/, '')}`
}

export const initials = (name = '') =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('') || '?'

export const fullName = (first, last) =>
  [first, last].filter(Boolean).join(' ').trim()

export const averageRating = (total, count) =>
  count > 0 ? (toNumber(total) / count).toFixed(1) : null

// Row number that keeps counting across pages.
export const rowNumber = (page, limit, index) => (page - 1) * limit + index + 1
