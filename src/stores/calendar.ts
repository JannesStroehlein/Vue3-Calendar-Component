import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import dayjs, { type Dayjs } from 'dayjs'
import type {
  CalendarEvent,
  CalendarEventInternal,
  CalendarView,
  CalendarConfig,
  FilterOptions,
  LazyLoadHandler,
  LazyLoadData
} from '@/types'
import { normalizeEvents, filterEvents, getEventsInRange } from '@/utils'

export const useCalendarStore = defineStore('calendar', () => {
  // State
  const currentDate = ref<Dayjs>(dayjs())
  const currentView = ref<CalendarView>('month')
  const events = ref<CalendarEventInternal[]>([])
  const config = ref<CalendarConfig>({
    firstDayOfWeek: 1,
    timeSlotDuration: 60,
    minTime: '00:00',
    maxTime: '24:00',
    showWeekNumbers: false,
    showTimeGrid: true,
    timeGridDivisions: 4,
    locale: 'en',
    dateFormat: 'YYYY-MM-DD',
    timeFormat: 'HH:mm',
    weekFormat: 'YYYY-[W]WW',
    monthFormat: 'YYYY-MM'
  })
  const filters = ref<FilterOptions>({})
  const loading = ref(false)
  const lazyLoadHandler = ref<LazyLoadHandler | null>(null)

  // Computed
  const filteredEvents = computed(() => {
    return filterEvents(events.value, filters.value)
  })

  const visibleDateRange = computed(() => {
    const date = currentDate.value
    
    switch (currentView.value) {
      case 'day':
      case 'agenda':
        return {
          start: date.startOf('day'),
          end: date.endOf('day')
        }
      case 'week':
        return {
          start: date.startOf('week').add(config.value.firstDayOfWeek! - 1, 'day'),
          end: date.startOf('week').add(config.value.firstDayOfWeek! - 1, 'day').add(6, 'day').endOf('day')
        }
      case 'month':
      default:
        const firstDay = date.startOf('month')
        const lastDay = date.endOf('month')
        const startOfFirstWeek = firstDay.startOf('week').add(config.value.firstDayOfWeek! - 1, 'day')
        const endOfLastWeek = lastDay.endOf('week').add(config.value.firstDayOfWeek! - 1, 'day')
        return {
          start: startOfFirstWeek,
          end: endOfLastWeek
        }
    }
  })

  const visibleEvents = computed(() => {
    const range = visibleDateRange.value
    return getEventsInRange(filteredEvents.value, range.start, range.end)
  })

  // Actions
  function setCurrentDate(date: Dayjs) {
    currentDate.value = date
  }

  function setCurrentView(view: CalendarView) {
    currentView.value = view
  }

  function setConfig(newConfig: Partial<CalendarConfig>) {
    config.value = { ...config.value, ...newConfig }
  }

  function setFilters(newFilters: FilterOptions) {
    filters.value = newFilters
  }

  function addEvent(event: CalendarEvent) {
    const normalizedEvent = normalizeEvents([event])[0]
    events.value.push(normalizedEvent)
  }

  function addEvents(newEvents: CalendarEvent[]) {
    const normalizedEvents = normalizeEvents(newEvents)
    events.value.push(...normalizedEvents)
  }

  function updateEvent(eventId: string, updates: Partial<CalendarEvent>) {
    const index = events.value.findIndex(e => e.id === eventId)
    if (index !== -1) {
      const updatedEvent = { ...events.value[index], ...updates }
      events.value[index] = normalizeEvents([updatedEvent])[0]
    }
  }

  function removeEvent(eventId: string) {
    const index = events.value.findIndex(e => e.id === eventId)
    if (index !== -1) {
      events.value.splice(index, 1)
    }
  }

  function clearEvents() {
    events.value = []
  }

  function setEvents(newEvents: CalendarEvent[]) {
    events.value = normalizeEvents(newEvents)
  }

  function setLazyLoadHandler(handler: LazyLoadHandler | null) {
    lazyLoadHandler.value = handler
  }

  async function loadEventsForRange(start: Dayjs, end: Dayjs) {
    if (!lazyLoadHandler.value) return

    loading.value = true
    try {
      const data: LazyLoadData = {
        start,
        end,
        view: currentView.value
      }
      const newEvents = await lazyLoadHandler.value(data)
      addEvents(newEvents)
    } catch (error) {
      console.error('Failed to load events:', error)
    } finally {
      loading.value = false
    }
  }

  function navigateToDate(date: Dayjs) {
    setCurrentDate(date)
  }

  function navigatePrevious() {
    const current = currentDate.value
    switch (currentView.value) {
      case 'day':
      case 'agenda':
        setCurrentDate(current.subtract(1, 'day'))
        break
      case 'week':
        setCurrentDate(current.subtract(1, 'week'))
        break
      case 'month':
        setCurrentDate(current.subtract(1, 'month'))
        break
    }
  }

  function navigateNext() {
    const current = currentDate.value
    switch (currentView.value) {
      case 'day':
      case 'agenda':
        setCurrentDate(current.add(1, 'day'))
        break
      case 'week':
        setCurrentDate(current.add(1, 'week'))
        break
      case 'month':
        setCurrentDate(current.add(1, 'month'))
        break
    }
  }

  function navigateToday() {
    setCurrentDate(dayjs())
  }

  return {
    // State
    currentDate,
    currentView,
    events,
    config,
    filters,
    loading,
    lazyLoadHandler,
    
    // Computed
    filteredEvents,
    visibleDateRange,
    visibleEvents,
    
    // Actions
    setCurrentDate,
    setCurrentView,
    setConfig,
    setFilters,
    addEvent,
    addEvents,
    updateEvent,
    removeEvent,
    clearEvents,
    setEvents,
    setLazyLoadHandler,
    loadEventsForRange,
    navigateToDate,
    navigatePrevious,
    navigateNext,
    navigateToday
  }
})
