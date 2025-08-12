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
        <!--         <div class="day-number">
          {{ currentDate.format('D') }}
        </div>
        <div class="day-month">
          {{ currentDate.format('MMMM YYYY') }}
        </div> -->
      </div>
    </div>

    <div
      class="day-body"
      :class="{
        'show-time-grid': config.showTimeGrid,
        'hide-time-grid': !config.showTimeGrid,
      }"
      @drop="handleDrop(currentDate.startOf('day'))"
    >
      <div v-if="config.showTimeGrid" class="time-column">
        <div
          v-for="slot in timeSlots"
          :key="`${slot.hour}-${slot.minute}`"
          class="time-slot"
          :style="{ height: `${dynamicTimeSlots.height}px` }"
        >
          <span class="time-label">{{ slot.label }}</span>
        </div>
      </div>

      <div class="day-content" @dragover.prevent="handleDragOver" @dragleave="handleDragLeave">
        <div
          v-for="slot in timeSlots"
          :key="`${currentDate.format('YYYY-MM-DD')}-${slot.hour}-${slot.minute}`"
          class="time-slot"
          :style="{ height: `${dynamicTimeSlots.height}px` }"
          :class="{ 'time-grid': config.showTimeGrid }"
          @click="handleTimeSlotClick(slot)"
          @drop="handleDrop(currentDate.startOf('day').add(slot.hour, 'hour').add(slot.minute, 'minute'))"
          @dragover.prevent="handleTimeSlotDragOver"
          @dragleave="handleTimeSlotDragLeave"
        />

        <div v-for="event in dayEvents" :key="event.id">
          <div v-if="$slots.eventMenu">
            <v-menu>
              <template #activator="{ props: activatorProps }">
                <DayEventView
                  v-bind="activatorProps"
                  :config="config"
                  :read-only="readOnly"
                  :event="event"
                  :day="currentDate"
                  :dynamic-time-slots="dynamicTimeSlots"
                  :handle-drag-start="handleDragStart"
                  :handle-event-click="handleEventClick"
                />
              </template>
              <slot name="eventMenu" :event="event" />
            </v-menu>
          </div>
          <div v-else>
            <DayEventView
              :config="config"
              :read-only="readOnly"
              :event="event"
              :day="currentDate"
              :dynamic-time-slots="dynamicTimeSlots"
              :handle-drag-start="handleDragStart"
              :handle-event-click="handleEventClick"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useDragAndDrop, useDynamicTimeSlots } from '@/plugin/composables'
  import type {
    CalendarEventInternal,
    DateClickHandler,
    DayViewEmits,
    DayViewProps,
    EventClickHandler,
    EventDropData,
    TimeSlot,
  } from '@/plugin/types'
  import { generateTimeSlots, getEventsForDay, isToday, isWeekend } from '@/plugin/utils'
  import { Dayjs } from 'dayjs'
  import { computed, defineComponent } from 'vue'
  import { VMenu } from 'vuetify/components'
  import DayEventView from './DayEventView.vue'

  defineComponent({
    components: {
      VMenu,
    },
  })

  const props = defineProps<DayViewProps>()
  const emit = defineEmits<DayViewEmits>()

  const allowDragAndDrop = computed(() => !props.readOnly)

  // Computed property to access container height
  const availableHeight = computed(() => {
    return props.containerHeight || 500 // Default fallback height
  })

  const timeSlotDuration = computed(() => props.config.timeSlotDuration ?? 60)
  const minTime = computed(() => props.config.minTime || '00:00')
  const maxTime = computed(() => props.config.maxTime || '24:00')
  const dynamicTimeSlots = useDynamicTimeSlots(availableHeight, minTime, maxTime, timeSlotDuration, 60)

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

  const timeSlots = computed(() => {
    return generateTimeSlots(props.config.minTime, props.config.maxTime, props.config.timeSlotDuration)
  })

  const dayEvents = computed(() => {
    return getEventsForDay(props.events, props.currentDate)
  })

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
    if (!allowDragAndDrop.value) return
    if (target instanceof HTMLElement) {
      target.style.opacity = '0.5'
      target.style.transform = 'rotate(3deg)'
      dragStart(event, target)
    }
  }

  const handleDrop = (date: Dayjs) => {
    if (!allowDragAndDrop.value) return
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
    drop(date)
  }

  const handleDragOver = (event: DragEvent) => {
    event.preventDefault()
    if (!allowDragAndDrop.value) return
    const target = event.currentTarget as HTMLElement
    target.classList.add('drag-highlight')
  }

  const handleDragLeave = (event: DragEvent) => {
    const target = event.currentTarget as HTMLElement
    target.classList.remove('drag-highlight')
  }

  const handleTimeSlotDragOver = (event: DragEvent) => {
    event.preventDefault()
    if (!allowDragAndDrop.value) return
    const target = event.currentTarget as HTMLElement
    target.classList.add('drag-highlight-slot')
  }

  const handleTimeSlotDragLeave = (event: DragEvent) => {
    const target = event.currentTarget as HTMLElement
    target.classList.remove('drag-highlight-slot')
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
    overflow-y: hidden;
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

  /* Drag and Drop Highlighting Styles */
  .drag-highlight {
    background-color: rgba(25, 118, 210, 0.1) !important;
    border: 2px dashed rgba(25, 118, 210, 0.5) !important;
  }

  .drag-highlight-slot {
    background-color: rgba(25, 118, 210, 0.08) !important;
    border: 1px solid rgba(25, 118, 210, 0.3) !important;
  }
</style>
