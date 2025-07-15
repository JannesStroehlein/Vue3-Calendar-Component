<template>
  <div
    class="week-event"
    :style="getEventStyle(event, day)"
    :class="{
      'event-completed': event.status === 'completed',
    }"
    draggable="true"
    @click.stop="handleEventClick({ event, nativeEvent: $event })"
    @dragstart="handleDragStart(event, $event.target!)"
  >
    <div class="event-content">
      <div class="event-text">
        <span v-if="event.icon">
          <v-icon :icon="event.icon" size="small" class="mr-1" />
        </span>
        <span class="event-title">
          {{ event.title }}
        </span>
        <div v-if="event.subtitle" class="event-subtitle">
          {{ event.subtitle }}
        </div>
        <div class="event-time">
          {{ formatEventTime(event) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { formatEventTime, getEventColor, getEventTextColor } from '@/plugin/utils'

  import { CalendarEventInternal, WeekEventViewProps } from '@/plugin/types'
  import { Dayjs } from 'dayjs'
  import { CSSProperties } from 'vue'

  const props = defineProps<WeekEventViewProps>()

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
    const slotHeight = props.dynamicTimeSlots.height

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
      zIndex: 10,
    }
  }
</script>

<style lang="css" scoped>
  .week-event {
    border-radius: 4px;
    padding: 4px 8px;
    font-size: 0.875rem;
    cursor: pointer;
    border: 1px solid rgba(0, 0, 0, 0.1);
    transition:
      opacity 0.2s,
      transform 0.1s;
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
  .week-event[draggable='true']:hover {
    transform: scale(1.02);
    transition: transform 0.1s ease;
  }
</style>
