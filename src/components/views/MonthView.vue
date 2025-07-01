<template>
  <div class="month-view">
    <div class="month-header">
      <div
        v-for="day in weekDayNames"
        :key="day"
        class="month-header-day"
      >
        {{ day }}
      </div>
    </div>

    <div class="month-grid">
      <div
        v-for="(week, weekIndex) in monthWeeks"
        :key="weekIndex"
        class="month-week"
      >
        <div
          v-for="day in week"
          :key="day.format('YYYY-MM-DD')"
          class="month-day"
          :class="{
            'current-month': day.month() === currentDate.month(),
            'other-month': day.month() !== currentDate.month(),
            'today': isToday(day),
            'weekend': isWeekend(day)
          }"
          @click="handleDateClick(day)"
          @dragover.prevent="handleDragOver"
          @drop="handleDrop(day)"
        >
          <div class="day-number">
            {{ day.date() }}
          </div>

          <div class="day-events">
            <div
              v-for="event in getEventsForDay(day)"
              :key="event.id"
              class="month-event"
              :style="{
                backgroundColor: getEventColor(event),
                color: getEventTextColor(event)
              }"
              :class="{
                'event-completed': event.status === 'completed'
              }"
              draggable="true"
              @click.stop="handleEventClick({ event, nativeEvent: $event })"
              @dragstart="handleDragStart(event, $event.target)"
            >
              <v-icon
                v-if="event.icon"
                :icon="event.icon"
                size="x-small"
                class="mr-1"
              />
              <span class="event-title">{{ event.title }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import type { Dayjs } from 'dayjs'
  import { VIcon } from 'vuetify/components/VIcon'
  import type {
    CalendarEventInternal,
    CalendarConfig,
    EventClickHandler,
    DateClickHandler,
    EventClickData
  } from '@/types'
  import {
    getMonthWeeks,
    getEventsForDay as utilGetEventsForDay,
    getEventColor,
    getEventTextColor,
    isToday,
    isWeekend
  } from '@/utils'
  import { useDragAndDrop } from '@/composables'

  // Component registration for library usage
  defineOptions({
    components: {
      VIcon
    }
  })

  export interface MonthViewProps {
    events: CalendarEventInternal[]
    currentDate: Dayjs
    config: CalendarConfig
  }

  export interface MonthViewEmits {
    (e: 'event-click', data: EventClickData): void
    (e: 'event-drop', event: CalendarEventInternal, newDate: Dayjs): void
    (e: 'date-click', date: Dayjs): void
  }

  const props = defineProps<MonthViewProps>()
  const emit = defineEmits<MonthViewEmits>()

  const { handleDragStart: dragStart, handleDrop: drop } = useDragAndDrop(
    async (data) => {
      emit('event-drop', data.event, data.newStart)
    }
  )

  const weekDayNames = computed(() => {
    const firstDay = props.currentDate.startOf('week').add(props.config.firstDayOfWeek! - 1, 'day')
    const days: string[] = []
    for (let i = 0; i < 7; i++) {
      days.push(firstDay.add(i, 'day').format('ddd'))
    }
    return days
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
      dragStart(event, target)
    }
  }

  const handleDrop = (date: Dayjs) => {
    drop(date.startOf('day'))
  }

  const handleDragOver = (event: DragEvent) => {
    event.preventDefault()
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

  .month-event {
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 0.75rem;
    line-height: 1.2;
    cursor: pointer;
    display: flex;
    align-items: center;
    transition: opacity 0.2s;
  }

  .month-event:hover {
    opacity: 0.8;
  }

  .month-event.event-completed .event-title {
    text-decoration: line-through;
  }

  .event-title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
  }
</style>
