import type { CalendarEventInternal, FilterOptions } from '@/types'

export function filterEvents(
  events: CalendarEventInternal[],
  filters: FilterOptions
): CalendarEventInternal[] {
  let filteredEvents = [...events]

  // Text search filter
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase()
    filteredEvents = filteredEvents.filter(event =>
      event.title.toLowerCase().indexOf(searchTerm) !== -1 ||
      (event.subtitle && event.subtitle.toLowerCase().indexOf(searchTerm) !== -1) ||
      (event.description && event.description.toLowerCase().indexOf(searchTerm) !== -1)
    )
  }

  // Status filter
  if (filters.statuses && filters.statuses.length > 0) {
    filteredEvents = filteredEvents.filter(event =>
      filters.statuses!.indexOf(event.status || 'open') !== -1
    )
  }

  // Date range filter
  if (filters.dateRange) {
    const { start, end } = filters.dateRange
    filteredEvents = filteredEvents.filter(event =>
      event.startDate.isBefore(end) && event.endDate.isAfter(start)
    )
  }

  // Custom filter
  if (filters.customFilter) {
    filteredEvents = filteredEvents.filter(filters.customFilter)
  }

  return filteredEvents
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: number | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait) as unknown as number
  }
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T
  if (Array.isArray(obj)) return obj.map(deepClone) as unknown as T
  
  const cloned = {} as T
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloned[key] = deepClone(obj[key])
    }
  }
  return cloned
}
