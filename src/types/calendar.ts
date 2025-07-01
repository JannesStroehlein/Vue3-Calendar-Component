import type { Dayjs } from 'dayjs'

export type CalendarView = 'month' | 'week' | 'day' | 'agenda'

export type EventStatus = 'open' | 'planned' | 'completed' | 'overdue' | 'cancelled'

export interface CalendarEvent {
  id: string
  title: string
  start: string | Date | Dayjs
  end?: string | Date | Dayjs
  allDay?: boolean
  color?: string
  backgroundColor?: string
  borderColor?: string
  textColor?: string
  icon?: string
  status?: EventStatus
  subtitle?: string
  description?: string
  location?: string
  recurring?: RecurringRule
  data?: Record<string, any>
}

export interface RecurringRule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
  interval?: number
  count?: number
  until?: string | Date | Dayjs
  byDay?: number[]
  byMonth?: number[]
}

export interface CalendarEventInternal extends CalendarEvent {
  startDate: Dayjs
  endDate: Dayjs
  isAllDay: boolean
}

export interface TimeSlot {
  hour: number
  minute: number
  label: string
}

export interface CalendarDay {
  date: Dayjs
  events: CalendarEventInternal[]
  isCurrentMonth: boolean
  isToday: boolean
  isWeekend: boolean
}

export interface CalendarWeek {
  days: CalendarDay[]
  weekNumber: number
}

export interface CalendarMonth {
  weeks: CalendarWeek[]
  name: string
  year: number
  month: number
}

export interface EventClickData {
  event: CalendarEventInternal
  nativeEvent: MouseEvent
}

export interface EventDropData {
  event: CalendarEventInternal
  newStart: Dayjs
  newEnd: Dayjs
  oldStart: Dayjs
  oldEnd: Dayjs
}

export interface DateRangeData {
  start: Dayjs
  end: Dayjs
}

export interface FilterOptions {
  search?: string
  statuses?: EventStatus[]
  dateRange?: DateRangeData
  customFilter?: (event: CalendarEventInternal) => boolean
}

export interface CalendarConfig {
  firstDayOfWeek?: number
  timeSlotDuration?: number
  minTime?: string
  maxTime?: string
  showWeekNumbers?: boolean
  showTimeGrid?: boolean
  timeGridDivisions?: number
  locale?: string
  dateFormat?: string
  timeFormat?: string
  weekFormat?: string
  monthFormat?: string
}

export interface LazyLoadData {
  start: Dayjs
  end: Dayjs
  view: CalendarView
}

export type EventClickHandler = (data: EventClickData) => void
export type EventDropHandler = (data: EventDropData) => void | Promise<void>
export type DateClickHandler = (date: Dayjs) => void
export type LazyLoadHandler = (data: LazyLoadData) => Promise<CalendarEvent[]> | CalendarEvent[]
export type ViewChangeHandler = (view: CalendarView, date: Dayjs) => void
export type DateChangeHandler = (date: Dayjs) => void
