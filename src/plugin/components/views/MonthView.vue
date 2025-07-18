<template>
  <div class="month-view">
    <div class="month-header">
      <div v-for="day in weekDays" :key="`days-col-header-${day.format('YYYY-MM-DD')}`" class="month-header-day">
        {{ createLocalizedDayjs(day).format('ddd') }}
      </div>
    </div>

    <div class="month-grid">
      <div v-for="(week, weekIndex) in monthWeeks" :key="weekIndex" class="month-week">
        <div
          v-for="day in week"
          :key="day.format('YYYY-MM-DD')"
          class="month-day"
          :class="{
            'current-month': day.month() === currentDate.month(),
            'other-month': day.month() !== currentDate.month(),
            today: isToday(day),
            weekend: isWeekend(day),
          }"
          @click="handleDateClick({ date: day, nativeEvent: $event })"
          @dragover.prevent="handleDragOver"
          @dragleave="handleDragLeave"
          @drop="handleDrop(day)"
        >
          <div class="day-number">
            {{ day.date() }}
          </div>

          <div class="day-events">
            <div v-for="event in getEventsForDay(day)" :key="event.id">
              <!-- If the eventMenu slot is specified, add a menu -->
              <div v-if="$slots.eventMenu">
                <v-menu>
                  <template #activator="{ props: activatorProps }">
                    <MonthEventView
                      v-bind="activatorProps"
                      :config="config"
                      :event="event"
                      :day="day"
                      :handle-event-click="handleEventClick"
                      :handle-drag-start="handleDragStart"
                    />
                  </template>
                  <slot name="eventMenu" :event="event" />
                </v-menu>
              </div>
              <div v-else>
                <MonthEventView
                  :config="config"
                  :event="event"
                  :day="day"
                  :handle-event-click="handleEventClick"
                  :handle-drag-start="handleDragStart"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useDragAndDrop, useTimeConverter } from '@/plugin/composables'
  import { useLocale } from '@/plugin/composables/useLocale'
  import type {
    CalendarEventInternal,
    DateClickHandler,
    EventClickHandler,
    EventDropData,
    MonthViewEmits,
    MonthViewProps,
  } from '@/plugin/types'
  import {
    getMonthWeeks,
    getWeekDays,
    isToday,
    isWeekend,
    getEventsForDay as utilGetEventsForDay,
  } from '@/plugin/utils'
  import type { Dayjs } from 'dayjs'
  import { computed, defineComponent } from 'vue'
  import MonthEventView from './MonthEventView.vue'
  import { VMenu } from 'vuetify/components'

  defineComponent({
    components: {
      MonthEventView,
      VMenu,
    },
  })

  const minTimeRef = computed(() => props.config.minTime || '00:00')
  const minTime = useTimeConverter(minTimeRef)

  const props = defineProps<MonthViewProps>()
  const emit = defineEmits<MonthViewEmits>()

  const { createLocalizedDayjs } = useLocale()

  const { handleDragStart: dragStart, handleDrop: drop } = useDragAndDrop(async (data: any) => {
    emit('event-drop', {
      event: data.event,
      date: data.date,
      newEnd: data.newEnd,
      newStart: data.newStart,
      oldEnd: data.oldEnd,
      oldStart: data.oldStart,
    } as EventDropData)
  })

  const weekDays = computed(() => {
    return getWeekDays(props.currentDate, props.config.firstDayOfWeek)
  })

  const monthWeeks = computed(() => {
    return getMonthWeeks(props.currentDate, props.config.firstDayOfWeek)
  })

  const getEventsForDay = (date: Dayjs) => {
    return utilGetEventsForDay(props.events, date).slice(0, 3) // Limit to 3 events per day
  }

  const handleEventClick: EventClickHandler = (data) => {
    emit('event-click', data)
  }

  const handleDateClick: DateClickHandler = (date) => {
    emit('date-click', date)
  }

  const handleDragStart = (event: CalendarEventInternal, target: EventTarget | null) => {
    if (target instanceof HTMLElement) {
      target.style.opacity = '0.5'
      target.style.transform = 'rotate(3deg)'
      dragStart(event, target)
    }
  }

  const handleDrop = (date: Dayjs) => {
    // Clear all drag highlights
    document.querySelectorAll('.drag-highlight').forEach((el) => {
      el.classList.remove('drag-highlight')
    })
    // Reset dragged element styling
    document.querySelectorAll('[style*="opacity: 0.5"]').forEach((el) => {
      const element = el as HTMLElement
      element.style.opacity = ''
      element.style.transform = ''
    })
    drop(date.startOf('day').add(minTime.value, 'minute'))
  }

  const handleDragOver = (event: DragEvent) => {
    event.preventDefault()
    const target = event.currentTarget as HTMLElement
    target.classList.add('drag-highlight')
  }

  const handleDragLeave = (event: DragEvent) => {
    const target = event.currentTarget as HTMLElement
    target.classList.remove('drag-highlight')
  }
</script>

<style scoped>
  .month-view {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .month-header {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
    background-color: #f5f5f5;
  }

  .month-header-day {
    padding: 12px 8px;
    text-align: center;
    font-weight: 500;
    text-transform: uppercase;
    font-size: 0.875rem;
  }

  .month-grid {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .month-week {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    flex: 1;
  }

  .month-day {
    border-right: 1px solid rgba(0, 0, 0, 0.12);
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
    padding: 8px;
    min-height: 120px;
    cursor: pointer;
    position: relative;
  }

  .month-day:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }

  .month-day.other-month {
    background-color: #fafafa;
    color: rgba(0, 0, 0, 0.38);
  }

  .month-day.today {
    background-color: rgba(25, 118, 210, 0.04);
  }

  .month-day.weekend {
    background-color: rgba(0, 0, 0, 0.02);
  }

  .day-number {
    font-weight: 500;
    margin-bottom: 4px;
  }

  .today .day-number {
    background-color: #1976d2;
    color: white;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.875rem;
  }

  .day-events {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  /* Drag and Drop Highlighting Styles */
  .drag-highlight {
    background-color: rgba(25, 118, 210, 0.1) !important;
    border: 2px dashed rgba(25, 118, 210, 0.5) !important;
  }
</style>
