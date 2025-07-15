<template>
  <div
    class="day-event"
    :style="getEventStyle(event)"
    :class="{
      'event-completed': event.status === 'completed',
    }"
    draggable
    @click.stop="handleEventClick({ event, nativeEvent: $event })"
    @dragstart="handleDragStart(event, $event.target!)"
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
</template>

<script setup lang="ts">
  import { CalendarEventInternal, DayEventViewProps } from '@/plugin/types'
  import { formatEventTime, getEventColor, getEventTextColor } from '@/plugin/utils'
  import { CSSProperties } from 'vue'

  const props = defineProps<DayEventViewProps>()

  const getEventStyle = (event: CalendarEventInternal): CSSProperties => {
    const [minHour, minMinute] = (props.config.minTime || '00:00').split(':').map(Number)
    const [maxHour, maxMinute] = (props.config.maxTime || '24:00').split(':').map(Number)

    const gridStart = props.day.hour(minHour).minute(minMinute).second(0)
    const gridEnd = props.day.hour(maxHour).minute(maxMinute).second(0)

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
    const slotHeight = props.dynamicTimeSlots.height

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
</script>

<style lang="css" scoped>
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

  .day-event[draggable='true']:hover {
    transform: scale(1.02);
    transition: transform 0.1s ease;
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
