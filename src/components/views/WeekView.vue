<template>
  <div class="week-view">
    <div
      class="week-header"
      :class="{
        'show-time-grid': config.showTimeGrid,
        'hide-time-grid': !config.showTimeGrid
      }"
    >
      <div
        v-if="config.showTimeGrid"
        class="time-column-header"
      />
      <div
        v-for="day in weekDays"
        :key="day.format('YYYY-MM-DD')"
        class="day-header"
        :class="{
          'today': isToday(day),
          'weekend': isWeekend(day)
        }"
        @click="handleDateClick(day)"
      >
        <div class="day-name">
          {{ day.format('ddd') }}
        </div>
        <div class="day-number">
          {{ day.format('D') }}
        </div>
      </div>
    </div>

    <div
      class="week-body"
      :class="{
        'show-time-grid': config.showTimeGrid,
        'hide-time-grid': !config.showTimeGrid
      }"
    >
      <div
        v-if="config.showTimeGrid"
        class="time-column"
      >
        <div
          v-for="slot in timeSlots"
          :key="`${slot.hour}-${slot.minute}`"
          class="time-slot"
          :style="{ height: `${timeSlotHeight}px`, width: config.showTimeGrid ? '100%' : '1px' }"
        >
          <span
            v-if="config.showTimeGrid"
            class="time-label"
          >{{ slot.label }}</span>
        </div>
      </div>

      <div class="days-container">
        <div
          v-for="day in weekDays"
          :key="day.format('YYYY-MM-DD')"
          class="day-column"
          :class="{
            'today': isToday(day),
            'weekend': isWeekend(day)
          }"
          @click="handleDateClick(day)"
          @dragover.prevent="handleDragOver"
          @drop="handleDrop(day)"
        >
          <div
            v-for="slot in timeSlots"
            :key="`${day.format('YYYY-MM-DD')}-${slot.hour}-${slot.minute}`"
            class="time-slot"
            :style="{ height: `${timeSlotHeight}px` }"
            :class="{ 'time-grid': config.showTimeGrid }"
          />

          <div
            v-for="event in getEventsForDay(day)"
            :key="event.id"
            class="week-event"
            :style="getEventStyle(event, day)"
            :class="{
              'event-completed': event.status === 'completed'
            }"
            draggable="true"
            @click.stop="handleEventClick(event, $event)"
            @dragstart="handleDragStart(event, $event.target)"
          >
            <div class="event-content">
              <v-icon
                v-if="event.icon"
                :icon="event.icon"
                size="small"
                class="mr-1"
              />
              <div class="event-text">
                <div class="event-title">
                  {{ event.title }}
                </div>
                <div
                  v-if="event.subtitle"
                  class="event-subtitle"
                >
                  {{ event.subtitle }}
                </div>
                <div class="event-time">
                  {{ formatEventTime(event) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, CSSProperties } from 'vue'
  import type { Dayjs } from 'dayjs'
  import { VIcon } from 'vuetify/components/VIcon'
  import type {
    CalendarEventInternal,
    CalendarConfig,
    DateClickHandler,
    EventClickData
  } from '@/types'
  import {
    getWeekDays,
    getEventsForDay as utilGetEventsForDay,
    generateTimeSlots,
    getEventColor,
    getEventTextColor,
    formatEventTime,
    isToday,
    isWeekend
  } from '@/utils'
  import { useDragAndDrop, useResponsive } from '@/composables'

  // Component registration for library usage
  defineOptions({
    components: {
      VIcon
    }
  })

  export interface WeekViewProps {
    events: CalendarEventInternal[]
    currentDate: Dayjs
    config: CalendarConfig
  }

  export interface WeekViewEmits {
    (e: 'event-click', data: EventClickData): void
    (e: 'event-drop', event: CalendarEventInternal, newDate: Dayjs): void
    (e: 'date-click', date: Dayjs): void
  }

  const props = defineProps<WeekViewProps>()
  const emit = defineEmits<WeekViewEmits>()

  const { handleDragStart: dragStart, handleDrop: drop } = useDragAndDrop(
    async (data) => {
      emit('event-drop', data.event, data.newStart)
    }
  )

  const { timeSlotHeight } = useResponsive()

  const weekDays = computed(() => {
    return getWeekDays(props.currentDate, props.config.firstDayOfWeek)
  })

  const timeSlots = computed(() => {
    return generateTimeSlots(
      props.config.minTime,
      props.config.maxTime,
      props.config.timeSlotDuration
    )
  })

  const getEventsForDay = (date: Dayjs) => {
    return utilGetEventsForDay(props.events, date)
  }

  const getEventStyle = (event: CalendarEventInternal, day: Dayjs): CSSProperties => {
    const [minHour, minMinute] = (props.config.minTime || '00:00').split(':').map(Number)
    const [maxHour, maxMinute] = (props.config.maxTime || '24:00').split(':').map(Number)
    
    const gridStart = day.hour(minHour).minute(minMinute).second(0)
    const gridEnd = day.hour(maxHour).minute(maxMinute).second(0)
    
    // Clamp event times to the visible grid range
    const eventStart = event.startDate.isBefore(gridStart) ? gridStart : event.startDate
    const eventEnd = event.endDate.isAfter(gridEnd) ? gridEnd : event.endDate
    
    // Skip events that are completely outside the visible range
    if (event.endDate.isBefore(gridStart) || event.startDate.isAfter(gridEnd)) {
      return { display: 'none' }
    }
    
    // Calculate minutes from the grid start time
    const startMinutes = eventStart.diff(gridStart, 'minute')
    const duration = eventEnd.diff(eventStart, 'minute')
    
    const slotDuration = props.config.timeSlotDuration || 60
    const slotHeight = timeSlotHeight.value
    
    const top = Math.max(0, (startMinutes / slotDuration) * slotHeight)
    const height = Math.max((duration / slotDuration) * slotHeight, 20)
    
    return {
      position: 'absolute',
      top: `${top}px`,
      height: `${height}px`,
      left: '4px',
      right: '4px',
      backgroundColor: getEventColor(event),
      color: getEventTextColor(event),
      zIndex: 10
    }
  }

  const handleEventClick = (event: CalendarEventInternal, nativeEvent: MouseEvent) => {
    emit('event-click', { event, nativeEvent })
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
  .week-view {
    height: 100%;
    min-height: 500px;
    display: flex;
    flex-direction: column;
  }

  .show-time-grid {
    grid-template-columns: 60px 1fr;
  }
  .hide-time-grid {
    grid-template-columns: 1fr;
  }

  .week-header.show-time-grid {
    grid-template-columns: 60px repeat(7, 1fr);
  }
  .week-header.hide-time-grid {
    grid-template-columns: repeat(7, 1fr);
  }

  .week-header {
    display: grid;
    border-bottom: 2px solid rgba(0, 0, 0, 0.12);
    background-color: #f5f5f5;
  }

  .time-column-header {
    border-right: 1px solid rgba(0, 0, 0, 0.12);
  }

  .day-header {
    padding: 12px 8px;
    text-align: center;
    cursor: pointer;
    border-right: 1px solid rgba(0, 0, 0, 0.12);
  }

  .day-header:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }

  .day-header.today {
    background-color: rgba(25, 118, 210, 0.04);
  }

  .day-header.weekend {
    background-color: rgba(0, 0, 0, 0.02);
  }

  .day-name {
    font-size: 0.875rem;
    font-weight: 500;
    text-transform: uppercase;
  }

  .day-number {
    font-size: 1.25rem;
    font-weight: 500;
    margin-top: 4px;
  }

  .today .day-number {
    background-color: #1976d2;
    color: white;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 4px auto 0;
  }

  .week-body {
    flex: 1;
    display: grid;
    overflow-y: auto;
    min-height: 0;
  }

  @media (min-width: 1920px) {
    .week-header.show-time-grid {
      grid-template-columns: 80px repeat(7, 1fr);
    }
    .week-body.show-time-grid {
      grid-template-columns: 80px 1fr;
    }
  }

  .time-column {
    border-right: 1px solid rgba(0, 0, 0, 0.12);
    background-color: #fafafa;
    min-height: 100%;
    overflow: hidden;
  }

  .time-slot {
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    position: relative;
    box-sizing: border-box;
  }

  .time-label {
    position: absolute;
    top: -8px;
    right: 8px;
    font-size: 0.75rem;
    color: rgba(0, 0, 0, 0.6);
  }

  .days-container {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    min-height: 100%;
    overflow: hidden;
  }

  .day-column {
    border-right: 1px solid rgba(0, 0, 0, 0.12);
    position: relative;
    cursor: pointer;
    min-height: 100%;
  }

  .day-column .time-slot {
    flex-shrink: 0;
  }

  .day-column:hover {
    background-color: rgba(0, 0, 0, 0.02);
  }

  .day-column.today {
    background-color: rgba(25, 118, 210, 0.02);
  }

  .day-column.weekend {
    background-color: rgba(0, 0, 0, 0.01);
  }

  .day-column .time-slot {
    border-bottom: none;
  }

  .day-column .time-slot.time-grid {
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  }

  .week-event {
    border-radius: 4px;
    padding: 4px 8px;
    font-size: 0.875rem;
    cursor: pointer;
    border: 1px solid rgba(0, 0, 0, 0.1);
    transition: opacity 0.2s, transform 0.1s;
  }

  .week-event:hover {
    opacity: 0.9;
  }

  .week-event.event-completed .event-title {
    text-decoration: line-through;
  }

  .event-content {
    display: flex;
    align-items: flex-start;
    height: 100%;
  }

  .event-text {
    flex: 1;
    min-width: 0;
  }

  .event-title {
    font-weight: 500;
    line-height: 1.2;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .event-subtitle {
    font-size: 0.75rem;
    opacity: 0.8;
    line-height: 1.2;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .event-time {
    font-size: 0.75rem;
    opacity: 0.9;
    margin-top: 2px;
  }
</style>
