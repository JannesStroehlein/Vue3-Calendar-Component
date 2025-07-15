<template>
  <div
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
    @dragstart="handleDragStart(event, $event.target!)"
  >
    <v-icon v-if="event.icon" :icon="event.icon" size="x-small" class="mr-1" />
    <span class="event-title">{{ event.title }}</span>
  </div>
</template>

<script setup lang="ts">
  import { MonthEventViewProps } from '@/plugin/types'
  import { getEventColor, getEventTextColor } from '@/plugin/utils'

  defineProps<MonthEventViewProps>()
</script>

<style lang="css" scoped>
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

  .month-event[draggable='true']:hover {
    transform: scale(1.02);
    transition: transform 0.1s ease;
  }
</style>
