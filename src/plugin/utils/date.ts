import dayjs, { type Dayjs } from 'dayjs'
import duration from 'dayjs/plugin/duration'
import isoWeek from 'dayjs/plugin/isoWeek'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import relativeTime from 'dayjs/plugin/relativeTime'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import type { CalendarEvent, CalendarEventInternal, TimeSlot, WeekDay } from '../types'

// Configure dayjs plugins
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(isoWeek)
dayjs.extend(weekOfYear)
dayjs.extend(duration)
dayjs.extend(relativeTime)
dayjs.extend(localizedFormat)

export function normalizeEvent(event: CalendarEvent): CalendarEventInternal {
  const startDate = dayjs(event.start)
  const endDate = event.end ? dayjs(event.end) : startDate.add(1, 'hour')

  return {
    ...event,
    startDate,
    endDate,
    isAllDay: event.allDay || false,
  }
}

export function normalizeEvents(events: CalendarEvent[]): CalendarEventInternal[] {
  return events.map(normalizeEvent)
}

export function getEventsInRange(events: CalendarEventInternal[], start: Dayjs, end: Dayjs): CalendarEventInternal[] {
  return events.filter((event) => {
    return event.startDate.isBefore(end) && event.endDate.isAfter(start)
  })
}

export function getEventsForDay(events: CalendarEventInternal[], date: Dayjs): CalendarEventInternal[] {
  const dayStart = date.startOf('day')
  const dayEnd = date.endOf('day')

  return getEventsInRange(events, dayStart, dayEnd)
}

export function generateTimeSlots(
  minTime: string = '00:00',
  maxTime: string = '24:00',
  duration: number = 60
): TimeSlot[] {
  const slots: TimeSlot[] = []
  const [minHour, minMinute] = minTime.split(':').map(Number)
  const [maxHour, maxMinute] = maxTime.split(':').map(Number)

  let current = dayjs().hour(minHour).minute(minMinute).second(0)
  const end = dayjs().hour(maxHour).minute(maxMinute).second(0)

  while (current.isBefore(end)) {
    slots.push({
      hour: current.hour(),
      minute: current.minute(),
      label: current.format('HH:mm'),
    })
    current = current.add(duration, 'minute')
  }

  return slots
}

export function getWeekDays(date: Dayjs, firstDayOfWeek: WeekDay = 'monday'): Dayjs[] {
  let startOfWeek = date.startOf('isoWeek').isoWeekday(weekdayToIsoWeekday(firstDayOfWeek))
  if (firstDayOfWeek !== 'monday') {
    startOfWeek = startOfWeek.subtract(1, 'week')
  }

  const days: Dayjs[] = []
  for (let i = 0; i < 7; i++) {
    days.push(startOfWeek.add(i, 'day'))
  }
  return days
}

export function getMonthWeeks(date: Dayjs, firstDayOfWeek: WeekDay = 'monday'): Dayjs[][] {
  const firstDay = date.startOf('month')
  let firstDayOfFirstWeekInMonth = firstDay.isoWeekday(weekdayToIsoWeekday(firstDayOfWeek))
  if (firstDayOfFirstWeekInMonth.isAfter(firstDay)) {
    firstDayOfFirstWeekInMonth = firstDayOfFirstWeekInMonth.subtract(1, 'week')
  }
  const lastDay = date.endOf('month')

  const weeks: Dayjs[][] = []
  let current = firstDayOfFirstWeekInMonth

  while (current.isBefore(lastDay) || current.isSame(lastDay, 'day')) {
    const week: Dayjs[] = []
    for (let i = 0; i < 7; i++) {
      week.push(current.add(i, 'day'))
    }
    weeks.push(week)
    current = current.add(7, 'day')
  }

  return weeks
}

export function formatEventTime(event: CalendarEventInternal, format?: string): string {
  if (event.isAllDay) {
    return 'All day'
  }

  const timeFormat = format || 'HH:mm'
  const start = event.startDate.format(timeFormat)
  const end = event.endDate.format(timeFormat)

  return `${start} - ${end}`
}

export function getEventDuration(event: CalendarEventInternal): number {
  return event.endDate.diff(event.startDate, 'minute')
}

export function isEventOverlapping(event1: CalendarEventInternal, event2: CalendarEventInternal): boolean {
  return event1.startDate.isBefore(event2.endDate) && event1.endDate.isAfter(event2.startDate)
}

export function sortEventsByStartTime(events: CalendarEventInternal[]): CalendarEventInternal[] {
  return [...events].sort((a, b) => a.startDate.valueOf() - b.startDate.valueOf())
}

export function getEventColor(event: CalendarEventInternal): string {
  if (event.color) return event.color
  if (event.backgroundColor) return event.backgroundColor

  // Default colors based on status
  switch (event.status) {
    case 'completed':
      return '#4caf50'
    case 'cancelled':
      return '#f44336'
    case 'overdue':
      return '#ff5722'
    case 'planned':
      return '#2196f3'
    case 'open':
    default:
      return '#9e9e9e'
  }
}

export function getEventTextColor(event: CalendarEventInternal): string {
  if (event.textColor) return event.textColor

  const bgColor = getEventColor(event)
  // Simple contrast calculation
  const hex = bgColor.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000

  return brightness > 128 ? '#000000' : '#ffffff'
}

export function isToday(date: Dayjs): boolean {
  return date.isSame(dayjs(), 'day')
}

export function isWeekend(date: Dayjs): boolean {
  const day = date.isoWeekday()

  return day === 6 || day === 7
}

export function weekdayToIsoWeekday(day: WeekDay): number {
  switch (day) {
    case 'monday':
      return 1
    case 'tuesday':
      return 2
    case 'wednesday':
      return 3
    case 'thursday':
      return 4
    case 'friday':
      return 5
    case 'saturday':
      return 6
    case 'sunday':
      return 7
    default:
      return -1 // Invalid day
  }
}

export function weekdayToNumber(day: WeekDay) {
  switch (day) {
    case 'sunday':
      return 0
    case 'monday':
      return 1
    case 'tuesday':
      return 2
    case 'wednesday':
      return 3
    case 'thursday':
      return 4
    case 'friday':
      return 5
    case 'saturday':
      return 6
    default:
      return -1 // Invalid day
  }
}
