import { Dayjs } from 'dayjs'
import { CalendarLocale } from './i18n'
export * from './i18n'

// ----------------------------------------------------------------------------------
//  Global configuration for the calendar plugin
// ----------------------------------------------------------------------------------

export interface GlobalSettings {
  /**
   * Global configuration for the calendar component.
   * This configuration will be merged with the default calendar configuration.
   */
  calendarConfig: Partial<CalendarConfig>
  /**
   * Locale for the calendar component.
   */
  locale: CalendarLocale
}

// ----------------------------------------------------------------------------------
//  Props
// ----------------------------------------------------------------------------------

interface CalendarComponentPropsBase {
  config: CalendarConfig
  /**
   * If set to true, drag and drop will be disabled
   */
  readOnly?: boolean
}

/**
 * Interface shared across all calendar components.
 * This interface defines the common properties that can be used to configure the calendar.
 */
export interface CalendarConfig {
  firstDayOfWeek?: WeekDay
  /**
   * Controls how the time grid in the week and day views is subdivided.
   * This defines the duration of each time row in minutes.
   * @example `30` for 30 minutes, `60` for 1 hour, etc
   */
  timeSlotDuration?: number
  /**
   * The lower bound of the time grid in the week and day views.
   * This defines the earliest time that can be displayed in the calendar.
   * @example "08:00" for 8 AM or "20:00" for 8 PM
   */
  minTime?: string
  /**
   * The upper bound of the time grid in the week and day views.
   * This defines the latest time that can be displayed in the calendar.
   * @example "18:00" for 6 PM or "23:59" for 11:59 PM
   */
  maxTime?: string
  /**
   * Whether to show week numbers in the calendar.
   * If true, week numbers will be displayed in the month and week view.
   */
  showWeekNumbers?: boolean
  /**
   * Whether to show the time grid in the week and day views.
   * If set to false, the gridlines and times will be hidden.
   */
  showTimeGrid?: boolean
  timeGridDivisions?: number
}

export interface ViewProps extends CalendarComponentPropsBase {
  events: CalendarEventInternal[]
  currentDate: Dayjs
  containerHeight?: number
}

export interface CalendarComponentProps extends CalendarComponentPropsBase {
  events?: CalendarEvent[]
  view?: CalendarView
  currentDate?: string | Date | Dayjs
  filters?: FilterOptions
  /**
   * Callback to notify the app that the date range has changed and thus new events should be loaded.
   * This is useful for lazy loading events when the user navigates to a different date range
   */
  lazyLoad?: LazyLoadHandler
}

export interface CalendarFiltersProps {
  filters: FilterOptions
}

export interface CalendarToolbarButtonsProps {
  currentDate: Dayjs
  currentView: CalendarView
  loading?: boolean
}

export interface MonthEventViewProps extends CalendarComponentPropsBase {
  event: CalendarEventInternal
  day: Dayjs
  handleEventClick: EventClickHandler
  handleDragStart: (event: CalendarEventInternal, target: EventTarget) => void
}

export interface WeekEventViewProps extends CalendarComponentPropsBase {
  event: CalendarEventInternal
  day: Dayjs
  dynamicTimeSlots: DynamicTimeSlots
  handleEventClick: EventClickHandler
  handleDragStart: (event: CalendarEventInternal, target: EventTarget) => void
}

export interface DayEventViewProps extends CalendarComponentPropsBase {
  event: CalendarEventInternal
  day: Dayjs
  dynamicTimeSlots: DynamicTimeSlots
  handleEventClick: EventClickHandler
  handleDragStart: (event: CalendarEventInternal, target: EventTarget) => void
}

export type WeekViewProps = ViewProps
export type MonthViewProps = ViewProps
export type DayViewProps = ViewProps
export type AgendaViewProps = ViewProps

// ----------------------------------------------------------------------------------
//  Emits
// ----------------------------------------------------------------------------------

export interface SharedCalendarEmits {
  (e: 'event-click', data: EventClickData): void
  (e: 'event-drop', data: EventDropData): void
  (e: 'date-click', data: DateClickData): void
}

export interface CalendarComponentEmits extends SharedCalendarEmits {
  (e: 'view-change', data: ViewChangeData): void
  (e: 'date-change', data: DateChangeData): void
}

export type MonthViewEmits = SharedCalendarEmits
export type WeekViewEmits = SharedCalendarEmits

export interface DayViewEmits extends SharedCalendarEmits {
  (e: 'time-slot-click', data: TimeSlotClickData): void
}

export interface CalendarFiltersEmits {
  (e: 'filters-change', data: FiltersChangeData): void
}

export interface CalendarToolbarEmits {
  (e: 'view-change', data: ViewChangeData): void
  (e: 'date-change', data: DateChangeData): void
  (e: 'navigate-previous'): void
  (e: 'navigate-next'): void
  (e: 'navigate-today'): void
}

// ----------------------------------------------------------------------------------
//  Data Models
// ----------------------------------------------------------------------------------

export type WeekDay = 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday'
export type CalendarView = 'month' | 'week' | 'day' | 'agenda'
export type EventStatus = 'open' | 'planned' | 'completed' | 'overdue' | 'cancelled'

export interface CalendarEvent {
  id: string
  title: string
  start: string | Date | any
  end?: string | Date | any
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
  until?: string | Date | any
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
  date: Date
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

export interface DateRangeData {
  start: Date
  end: Date
}

export interface FilterOptions {
  search?: string
  statuses?: EventStatus[]
  dateRange?: DateRangeData
  customFilter?: (event: CalendarEventInternal) => boolean
}

export interface LazyLoadData {
  start: Date
  end: Date
  view: CalendarView
}

// ----------------------------------------------------------------------------------
//  Event Data Interfaces
// ----------------------------------------------------------------------------------

export interface DateClickData {
  date: Dayjs
  nativeEvent: MouseEvent
}

export interface EventClickData {
  event: CalendarEventInternal
  nativeEvent: MouseEvent
}

export interface EventDropData {
  event: CalendarEventInternal
  newStart: Date
  newEnd: Date
  oldStart: Date
  oldEnd: Date
}

export interface TimeSlotClickData {
  date: Dayjs
  slot: TimeSlot
}

export interface ViewChangeData {
  newView: CalendarView
  oldView: CalendarView
  currentDate: Dayjs
}

export interface DateChangeData {
  newDate: Dayjs
  oldDate: Dayjs
}

export interface FiltersChangeData {
  filters: FilterOptions
}

export type EventClickHandler = (data: EventClickData) => void
export type EventDropHandler = (data: EventDropData) => void | Promise<void>
export type DateClickHandler = (data: DateClickData) => void
export type LazyLoadHandler = (data: LazyLoadData) => CalendarEvent[] | Promise<CalendarEvent[]>
export type ViewChangeHandler = (data: ViewChangeData) => void
export type DateChangeHandler = (data: DateChangeData) => void

// ----------------------------------------------------------------------------------
//  Utilities
// ----------------------------------------------------------------------------------

export interface DynamicTimeSlots {
  height: number
  numberOfSlots: number
  minTime: number
  maxTime: number
}
