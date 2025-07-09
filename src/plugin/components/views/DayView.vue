<template>
  <div class="day-view">
    <div
      class="day-header"
      :class="{
        'show-time-grid': config.showTimeGrid,
        'hide-time-grid': !config.showTimeGrid,
      }"
    >
      <div v-if="config.showTimeGrid" class="time-column-header" />
      <div
        class="day-header-content"
        :class="{
          today: isToday(currentDate),
          weekend: isWeekend(currentDate),
        }"
        @click="handleDateClick({ date: currentDate, nativeEvent: $event })"
      >
        <div class="day-name">
          {{ currentDate.format('dddd') }}
        </div>
        <div class="day-number">
          {{ currentDate.format('D') }}
        </div>
        <div class="day-month">
          {{ currentDate.format('MMMM YYYY') }}
        </div>
      </div>
    </div>

    <div
      class="day-body"
      :class="{
        'show-time-grid': config.showTimeGrid,
        'hide-time-grid': !config.showTimeGrid,
      }"
    >
      <div v-if="config.showTimeGrid" class="time-column">
        <div
          v-for="slot in timeSlots"
          :key="`${slot.hour}-${slot.minute}`"
          class="time-slot"
          :style="{ height: `${timeSlotHeight}px` }"
        >
          <span class="time-label">{{ slot.label }}</span>
        </div>
      </div>

      <div class="day-content">
        <div
          v-for="slot in timeSlots"
          :key="`${currentDate.format('YYYY-MM-DD')}-${slot.hour}-${slot.minute}`"
          class="time-slot"
          :style="{ height: `${timeSlotHeight}px` }"
          :class="{ 'time-grid': config.showTimeGrid }"
          @click="handleTimeSlotClick(slot)"
        />

        <div
          v-for="event in dayEvents"
          :key="event.id"
          class="day-event"
          :style="getEventStyle(event)"
          :class="{
            'event-completed': event.status === 'completed',
          }"
          draggable
          @click.stop="handleEventClick({ event, nativeEvent: $event })"
          @dragstart="handleDragStart(event, $event.target)"
        >
          <div class="event-content">
            <div class="event-header">
              <v-icon v-if="event.icon" :icon="event.icon" size="small" class="mr-2" />
              <div class="event-title">
                {{ event.title }}
              </div>
            </div>

            <div v-if="event.subtitle" class="event-subtitle">
              {{ event.subtitle }}
            </div>

            <div class="event-time">
              {{ formatEventTime(event) }}
            </div>

            <div v-if="event.location" class="event-location">
              <v-icon icon="mdi-map-marker" size="x-small" class="mr-1" />
              {{ event.location }}
            </div>

            <div v-if="event.description" class="event-description">
              {{ event.description }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useDragAndDrop, useResponsive } from '@/plugin/composables'
  import type {
    CalendarEventInternal,
    DateClickHandler,
    DayViewEmits,
    DayViewProps,
    EventClickHandler,
    TimeSlot,
  } from '@/plugin/types'
  import {
    formatEventTime,
    generateTimeSlots,
    getEventColor,
    getEventsForDay,
    getEventTextColor,
    isToday,
    isWeekend,
  } from '@/plugin/utils'
  import { computed, CSSProperties } from 'vue'
  import { VIcon } from 'vuetify/components/VIcon'

  // Component registration for library usage
  defineOptions({
    name: 'DayView',
  })

  const props = defineProps<DayViewProps>()
  const emit = defineEmits<DayViewEmits>()

  const { handleDragStart: dragStart } = useDragAndDrop(async (data) => {
    emit('event-drop', data)
  })

  const { timeSlotHeight } = useResponsive()

  const timeSlots = computed(() => {
    return generateTimeSlots(props.config.minTime, props.config.maxTime, props.config.timeSlotDuration)
  })

  const dayEvents = computed(() => {
    return getEventsForDay(props.events, props.currentDate)
  })

  const getEventStyle = (event: CalendarEventInternal): CSSProperties => {
    const [minHour, minMinute] = (props.config.minTime || '00:00').split(':').map(Number)
    const [maxHour, maxMinute] = (props.config.maxTime || '24:00').split(':').map(Number)

    const gridStart = props.currentDate.hour(minHour).minute(minMinute).second(0)
    const gridEnd = props.currentDate.hour(maxHour).minute(maxMinute).second(0)

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
      left: '8px',
      right: '8px',
      backgroundColor: getEventColor(event),
      color: getEventTextColor(event),
      zIndex: 10,
    }
  }

  const handleEventClick: EventClickHandler = (data) => {
    emit('event-click', data)
  }

  const handleDateClick: DateClickHandler = (date) => {
    emit('date-click', date)
  }

  const handleTimeSlotClick = (slot: TimeSlot) => {
    const slotDate = props.currentDate.hour(slot.hour).minute(slot.minute)
    emit('time-slot-click', { date: slotDate, slot: slot })
  }

  const handleDragStart = (event: CalendarEventInternal, target: EventTarget | null) => {
    if (target instanceof HTMLElement) {
      dragStart(event, target)
    }
  }
</script>

<style scoped>
  .day-view {
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

  .day-header {
    display: grid;
    border-bottom: 2px solid rgba(0, 0, 0, 0.12);
    background-color: #f5f5f5;
  }

  .time-column-header {
    border-right: 1px solid rgba(0, 0, 0, 0.12);
  }

  .day-header-content {
    padding: 16px;
    text-align: center;
    cursor: pointer;
  }

  .day-header-content:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }

  .day-header-content.today {
    background-color: rgba(25, 118, 210, 0.04);
  }

  .day-header-content.weekend {
    background-color: rgba(0, 0, 0, 0.02);
  }

  .day-name {
    font-size: 1rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .day-number {
    font-size: 2rem;
    font-weight: 500;
    margin: 8px 0;
  }

  .today .day-number {
    color: #1976d2;
  }

  .day-month {
    font-size: 0.875rem;
    color: rgba(0, 0, 0, 0.6);
  }

  .day-body {
    flex: 1;
    display: grid;
    overflow-y: auto;
    min-height: 0;
  }

  @media (min-width: 1920px) {
    .show-time-grid {
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

  .day-content {
    position: relative;
    cursor: pointer;
    min-height: 100%;
  }

  .day-content .time-slot {
    flex-shrink: 0;
  }

  .day-content:hover {
    background-color: rgba(0, 0, 0, 0.01);
  }

  .day-content .time-slot {
    border-bottom: none;
  }

  .day-content .time-slot.time-grid {
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  }

  .day-event {
    border-radius: 8px;
    padding: 12px;
    font-size: 0.875rem;
    cursor: pointer;
    border: 1px solid rgba(0, 0, 0, 0.1);
    transition:
      opacity 0.2s,
      transform 0.1s;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .day-event:hover {
    opacity: 0.9;
  }

  .day-event.event-completed .event-title {
    text-decoration: line-through;
  }

  .event-content {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .event-header {
    display: flex;
    align-items: center;
    margin-bottom: 4px;
  }

  .event-title {
    font-weight: 600;
    line-height: 1.2;
    flex: 1;
  }

  .event-subtitle {
    font-size: 0.8rem;
    opacity: 0.9;
    line-height: 1.2;
    margin-bottom: 4px;
  }

  .event-time {
    font-size: 0.8rem;
    opacity: 0.9;
    margin-bottom: 4px;
    font-weight: 500;
  }

  .event-location {
    font-size: 0.75rem;
    opacity: 0.8;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
  }

  .event-description {
    font-size: 0.75rem;
    opacity: 0.8;
    line-height: 1.3;
    flex: 1;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
  }
</style>
