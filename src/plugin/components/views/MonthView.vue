<template>
  <div class="month-view">
    <div class="month-header">
      <div v-for="day in weekDayNames" :key="day" class="month-header-day">
        {{ day }}
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
            <div
              v-for="event in getEventsForDay(day)"
              :key="event.id"
              class="month-event"
              :style="{
                backgroundColor: getEventColor(event),
                color: getEventTextColor(event),
              }"
              :class="{
                'event-completed': event.status === 'completed',
              }"
              draggable="true"
              @click.stop="handleEventClick({ event, nativeEvent: $event })"
              @dragstart="handleDragStart(event, $event.target)"
            >
              <v-icon v-if="event.icon" :icon="event.icon" size="x-small" class="mr-1" />
              <span class="event-title">{{ event.title }}</span>
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
    getEventColor,
    getEventTextColor,
    getMonthWeeks,
    isToday,
    isWeekend,
    getEventsForDay as utilGetEventsForDay,
    weekdayToNumber,
  } from '@/plugin/utils'
  import type { Dayjs } from 'dayjs'
  import { computed } from 'vue'
  import { VIcon } from 'vuetify/components/VIcon'

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

  const weekDayNames = computed(() => {
    const localizedCurrentDate = createLocalizedDayjs(props.currentDate)

    // Start of the week based on the configured first day
    const firstDay = localizedCurrentDate
      // dayjs uses 0-6 for Sunday-Saturday and this is locale independent
      .add(localizedCurrentDate.get('day'), 'day')
      .add(weekdayToNumber(props.config.firstDayOfWeek!) + 1, 'day')
    const days: string[] = []
    for (let i = 0; i < 7; i++) {
      days.push(createLocalizedDayjs(firstDay.add(i, 'day')).format('ddd'))
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

  /* Drag and Drop Highlighting Styles */
  .drag-highlight {
    background-color: rgba(25, 118, 210, 0.1) !important;
    border: 2px dashed rgba(25, 118, 210, 0.5) !important;
  }

  .month-event[draggable='true']:hover {
    transform: scale(1.02);
    transition: transform 0.1s ease;
  }
</style>
