<template>
  <div class="calendar-component">
    <CalendarToolbar
      :current-date="currentDate"
      :current-view="view"
      :loading="loading"
      @view-change="handleViewChange"
      @date-change="handleDateChange"
      @navigate-previous="navigatePrevious"
      @navigate-next="navigateNext"
      @navigate-today="navigateToday"
    />

    <div class="calendar-container">
      <component
        :is="currentViewComponent"
        :key="`${view}-${currentDate.format('YYYY-MM-DD')}`"
        :config="config"
        :events="visibleEvents"
        :current-date="currentDate"
        :view="current_view_model"
        :loading="loading"
        @event-update="handleEventUpdate"
        @event-click="handleEventClick"
        @event-drop="handleEventDrop"
        @date-click="handleDateClick"
      >
        <template v-for="(_, name) in $slots" #[name]="slotProps">
          <slot :name="name" v-bind="slotProps || {}"></slot>
        </template>
      </component>
    </div>
  </div>
</template>

<script setup lang="ts">
  import CalendarToolbar from '@/plugin/components/CalendarToolbarButtons.vue'
  import AgendaView from '@/plugin/components/views/AgendaView.vue'
  import DayView from '@/plugin/components/views/DayView.vue'
  import MonthView from '@/plugin/components/views/MonthView.vue'
  import WeekView from '@/plugin/components/views/WeekView.vue'
  import {
    CalendarConfig,
    CalendarEvent,
    CalendarView,
    type CalendarComponentEmits,
    type CalendarComponentProps,
    type DateChangeHandler,
    type DateClickHandler,
    type EventClickHandler,
    type EventDropHandler,
    type LazyLoadData,
    type ViewChangeHandler,
  } from '@/plugin/types'
  import dayjs, { Dayjs } from 'dayjs'
  import { computed, inject, onMounted, ref, watch } from 'vue'
  import { filterEvents, getEventsInRange, normalizeEvents, weekdayToNumber } from '../utils'

  const globalConfig = inject<CalendarConfig>('calendarGlobalConfig')

  const unmergedProps = defineProps<CalendarComponentProps>()

  const mergedProps = computed(() => ({
    ...globalConfig,
    ...unmergedProps,
    events: unmergedProps.events || [],
    filters: unmergedProps.filters || {},
    view: unmergedProps.view || 'month',
    currentDate: unmergedProps.currentDate || dayjs(),
    lazyLoad: unmergedProps.lazyLoad,
  }))
  watch(
    mergedProps,
    (newProps) => {
      console.log('Merged props updated:', newProps)
    },
    { immediate: true }
  )

  const emit = defineEmits<CalendarComponentEmits>()

  const [event_model] = defineModel<CalendarEvent[]>('events', {
    default: () => [],
  })
  const [current_date_model] = defineModel<Date | string | Dayjs>('currentDate', {
    default: () => dayjs(),
  })
  const [current_view_model] = defineModel<CalendarView>('currentView')

  const loading = ref(false)

  // Helper functions to normalize dates
  const normalizeDateToDayjs = (date: Date | string | Dayjs): Dayjs => {
    if (typeof date === 'string') return dayjs(date)
    if (date instanceof Date) return dayjs(date)
    return date
  }

  const currentDateAsDayjs = computed(() => {
    return normalizeDateToDayjs(current_date_model.value || dayjs())
  })

  // Computed
  const filteredEvents = computed(() => {
    const normalizedEvents = normalizeEvents(mergedProps.value.events || [])
    return filterEvents(normalizedEvents, mergedProps.value.filters || {})
  })

  const visibleDateRange = computed(() => {
    const date = dayjs(mergedProps.value.currentDate || dayjs())
    const firstDayOfTheWeekNumber = weekdayToNumber(mergedProps.value.firstDayOfWeek || 'monday')

    switch (mergedProps.value.view) {
      case 'day':
      case 'agenda':
        return {
          start: date.startOf('day'),
          end: date.endOf('day'),
        }
      case 'week': {
        return {
          start: date.startOf('week').add(firstDayOfTheWeekNumber - 1, 'day'),
          end: date
            .startOf('week')
            .add(firstDayOfTheWeekNumber - 1, 'day')
            .add(6, 'day')
            .endOf('day'),
        }
      }

      case 'month':
      default: {
        const firstDay = date.startOf('month')
        const lastDay = date.endOf('month')
        const startOfFirstWeek = firstDay.startOf('week').add(firstDayOfTheWeekNumber - 1, 'day')
        const endOfLastWeek = lastDay.endOf('week').add(firstDayOfTheWeekNumber - 1, 'day')
        return {
          start: startOfFirstWeek,
          end: endOfLastWeek,
        }
      }
    }
  })

  const visibleEvents = computed(() => {
    const range = visibleDateRange.value
    return getEventsInRange(filteredEvents.value, range.start, range.end)
  })

  // Computed with defaults for template
  const currentDate = computed(() => {
    return currentDateAsDayjs.value
  })

  const view = computed(() => {
    return current_view_model.value || mergedProps.value.view || 'month'
  })

  // Actions
  function setCurrentDate(date: Date | string | Dayjs) {
    current_date_model.value = date
  }

  function setCurrentView(view: CalendarView) {
    current_view_model.value = view
  }

  function addEvents(newEvents: CalendarEvent[]) {
    const normalizedEvents = normalizeEvents(newEvents)
    event_model.value.push(...normalizedEvents)
  }

  async function loadEventsForRange(start: Dayjs, end: Dayjs) {
    if (!mergedProps.value.lazyLoad) return

    loading.value = true
    try {
      const data: LazyLoadData = {
        start: start.toDate(),
        end: end.toDate(),
        view: mergedProps.value.view || 'month',
      }
      const newEvents = await mergedProps.value.lazyLoad(data)
      addEvents(newEvents)
    } catch (error) {
      console.error('Failed to load events:', error)
    } finally {
      loading.value = false
    }
  }

  function navigatePrevious() {
    const current = currentDateAsDayjs.value
    switch (current_view_model.value) {
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
    const current = currentDateAsDayjs.value
    switch (current_view_model.value) {
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

  // Computed properties
  const currentViewComponent = computed(() => {
    const view = current_view_model.value
    switch (view) {
      case 'month':
        return MonthView
      case 'week':
        return WeekView
      case 'day':
        return DayView
      case 'agenda':
        return AgendaView
      default:
        return MonthView
    }
  })

  // Event handlers
  const handleEventClick: EventClickHandler = (data) => {
    emit('event-click', data)
  }

  const handleEventDrop: EventDropHandler = async (data) => {
    emit('event-drop', data)
  }

  const handleDateClick: DateClickHandler = (date) => {
    emit('date-click', date)
  }

  const handleViewChange: ViewChangeHandler = (data) => {
    setCurrentView(data.newView)
    emit('view-change', data)
  }

  const handleDateChange: DateChangeHandler = (date) => {
    setCurrentDate(date.newDate)
    emit('date-change', date)
  }

  const handleEventUpdate = (eventId: string, updates: Partial<CalendarEvent>) => {
    const eventIndex = event_model.value.findIndex((e) => e.id === eventId)
    if (eventIndex !== -1) {
      const updatedEvent = { ...event_model.value[eventIndex], ...updates }
      event_model.value[eventIndex] = updatedEvent
    }
  }

  // Watchers
  watch(
    () => mergedProps.value.events,
    (newEvents) => {
      if (newEvents) {
        const normalizedEvents = normalizeEvents(newEvents)
        event_model.value = normalizedEvents
      }
    },
    { immediate: true }
  )

  watch(
    () => mergedProps.value.view,
    (newView) => {
      if (newView) {
        setCurrentView(newView)
      }
    },
    { immediate: true }
  )

  watch(
    () => mergedProps.value.currentDate,
    (newDate) => {
      if (newDate) {
        const date = typeof newDate === 'string' ? dayjs(newDate) : newDate instanceof Date ? dayjs(newDate) : newDate
        setCurrentDate(date)
      }
    },
    { immediate: true }
  )

  // Auto-load events when date range changes (for lazy loading)
  watch(
    () => visibleDateRange,
    async (range) => {
      if (mergedProps.value.lazyLoad && event_model.value.length === 0) {
        await loadEventsForRange(range.value.start, range.value.end)
      }
    },
    { immediate: true }
  )

  onMounted(() => {
    // Initialize the store with props
    if (mergedProps.value.events?.length) {
      const normalizedEvents = normalizeEvents(mergedProps.value.events)
      event_model.value = normalizedEvents
    }
  })
</script>

<style scoped>
  .calendar-component {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
  }

  .calendar-container {
    flex: 1;
    overflow: hidden;
    min-height: 0;
    position: relative;
  }
</style>
