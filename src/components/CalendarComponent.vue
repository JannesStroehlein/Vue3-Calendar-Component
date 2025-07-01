<template>
  <div class="calendar-copilot">
    <CalendarToolbar
      :current-date="store.currentDate"
      :current-view="store.currentView"
      :loading="store.loading"
      @view-change="handleViewChange"
      @date-change="handleDateChange"
      @navigate-previous="store.navigatePrevious"
      @navigate-next="store.navigateNext"
      @navigate-today="store.navigateToday"
    />

    <CalendarFilters
      v-if="showFilters"
      :filters="store.filters"
      @filters-change="handleFiltersChange"
    />

    <div class="calendar-container">
      <component
        :is="currentViewComponent"
        :events="store.visibleEvents"
        :current-date="store.currentDate"
        :config="store.config"
        @event-click="handleEventClick"
        @event-drop="handleEventDrop"
        @date-click="handleDateClick"
      />
    </div>

    <CalendarEventDialog
      v-if="selectedEvent"
      :event="selectedEvent"
      :open="showEventDialog"
      @close="closeEventDialog"
      @update="handleEventUpdate"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, watch, ref } from 'vue'
  import dayjs, { type Dayjs } from 'dayjs'
  import { useCalendarStore } from '@/stores'
  import type {
    CalendarEvent,
    CalendarView,
    CalendarConfig,
    FilterOptions,
    EventClickHandler,
    EventDropHandler,
    DateClickHandler,
    LazyLoadHandler,
    ViewChangeHandler,
    DateChangeHandler,
    EventClickData,
    EventDropData,
    CalendarEventInternal
  } from '@/types'
  import CalendarToolbar from './CalendarToolbar.vue'
  import CalendarFilters from './CalendarFilters.vue'
  import CalendarEventDialog from './CalendarEventDialog.vue'
  import MonthView from './views/MonthView.vue'
  import WeekView from './views/WeekView.vue'
  import DayView from './views/DayView.vue'
  import AgendaView from './views/AgendaView.vue'

  export interface CalendarComponentProps {
    events?: CalendarEvent[]
    view?: CalendarView
    currentDate?: string | Date | Dayjs
    config?: Partial<CalendarConfig>
    filters?: FilterOptions
    showFilters?: boolean
    lazyLoad?: LazyLoadHandler
  }

  export interface CalendarComponentEmits {
    (e: 'event-click', data: EventClickData): void
    (e: 'event-drop', data: EventDropData): void
    (e: 'date-click', date: Dayjs): void
    (e: 'view-change', view: CalendarView, date: Dayjs): void
    (e: 'date-change', date: Dayjs): void
  }

  const props = withDefaults(defineProps<CalendarComponentProps>(), {
    events: () => [],
    view: 'month',
    showFilters: false
  })

  const emit = defineEmits<CalendarComponentEmits>()

  const store = useCalendarStore()
  const selectedEvent = ref<CalendarEventInternal | null>(null)
  const showEventDialog = ref(false)
  
  // Expose showFilters to template
  const showFilters = computed(() => props.showFilters)

  // Computed properties
  const currentViewComponent = computed(() => {
    switch (store.currentView) {
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
    selectedEvent.value = data.event
    showEventDialog.value = true
    emit('event-click', data)
  }

  const handleEventDrop: EventDropHandler = async (data) => {
    emit('event-drop', data)
  }

  const handleDateClick: DateClickHandler = (date) => {
    emit('date-click', date)
  }

  const handleViewChange: ViewChangeHandler = (view, date) => {
    store.setCurrentView(view)
    emit('view-change', view, date)
  }

  const handleDateChange: DateChangeHandler = (date) => {
    store.setCurrentDate(date)
    emit('date-change', date)
  }

  const handleFiltersChange = (newFilters: FilterOptions) => {
    store.setFilters(newFilters)
  }

  const closeEventDialog = () => {
    showEventDialog.value = false
    selectedEvent.value = null
  }

  const handleEventUpdate = (eventId: string, updates: Partial<CalendarEvent>) => {
    store.updateEvent(eventId, updates)
    closeEventDialog()
  }

  // Watchers
  watch(
    () => props.events,
    (newEvents) => {
      if (newEvents) {
        store.setEvents(newEvents)
      }
    },
    { immediate: true }
  )

  watch(
    () => props.view,
    (newView) => {
      if (newView) {
        store.setCurrentView(newView)
      }
    },
    { immediate: true }
  )

  watch(
    () => props.currentDate,
    (newDate) => {
      if (newDate) {
        const date = typeof newDate === 'string' ? dayjs(newDate) : 
                     newDate instanceof Date ? dayjs(newDate) : newDate
        store.setCurrentDate(date)
      }
    },
    { immediate: true }
  )

  watch(
    () => props.config,
    (newConfig) => {
      if (newConfig) {
        store.setConfig(newConfig)
      }
    },
    { immediate: true, deep: true }
  )

  watch(
    () => props.filters,
    (newFilters) => {
      if (newFilters) {
        store.setFilters(newFilters)
      }
    },
    { immediate: true, deep: true }
  )

  watch(
    () => props.lazyLoad,
    (handler) => {
      store.setLazyLoadHandler(handler || null)
    },
    { immediate: true }
  )

  // Auto-load events when date range changes (for lazy loading)
  watch(
    () => store.visibleDateRange,
    async (range) => {
      if (props.lazyLoad && store.events.length === 0) {
        await store.loadEventsForRange(range.start, range.end)
      }
    },
    { immediate: true }
  )

  onMounted(() => {
    // Initialize the store with props
    if (props.events?.length) {
      store.setEvents(props.events)
    }
  })
</script>

<style scoped>
  .calendar-copilot {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
  }

  .calendar-container {
    flex: 1;
    overflow: hidden;
  }
</style>
