import { ref, computed } from 'vue'
import type { Dayjs } from 'dayjs'
import type { CalendarEventInternal, EventDropData, EventDropHandler } from '@/plugin/types'

export function useDragAndDrop(onEventDrop?: EventDropHandler) {
  const draggedEvent = ref<CalendarEventInternal | null>(null)
  const draggedElement = ref<HTMLElement | null>(null)
  const isDragging = ref(false)
  const dropZone = ref<HTMLElement | null>(null)

  const handleDragStart = (event: CalendarEventInternal, element: HTMLElement) => {
    draggedEvent.value = event
    draggedElement.value = element
    isDragging.value = true

    // Add visual feedback
    element.style.opacity = '0.5'
    element.style.cursor = 'grabbing'
  }

  const handleDragEnd = () => {
    if (draggedElement.value) {
      draggedElement.value.style.opacity = '1'
      draggedElement.value.style.cursor = 'grab'
    }

    draggedEvent.value = null
    draggedElement.value = null
    isDragging.value = false
    dropZone.value = null
  }

  const handleDrop = async (newStart: Dayjs, newEnd?: Dayjs) => {
    if (!draggedEvent.value) return

    const event = draggedEvent.value
    const oldStart = event.startDate
    const oldEnd = event.endDate
    const calculatedNewEnd = newEnd || newStart.add(oldEnd.diff(oldStart, 'minute'), 'minute')

    const dropData: EventDropData = {
      event: event,
      newStart: newStart.toDate(),
      newEnd: calculatedNewEnd.toDate(),
      oldStart: oldStart.toDate(),
      oldEnd: oldEnd.toDate(),
    }

    try {
      if (onEventDrop) {
        await onEventDrop(dropData)
      }
    } catch (error) {
      console.error('Failed to drop event:', error)
    } finally {
      handleDragEnd()
    }
  }

  const handleDragOver = (element: HTMLElement) => {
    dropZone.value = element
    element.style.backgroundColor = 'rgba(25, 118, 210, 0.1)'
  }

  const handleDragLeave = (element: HTMLElement) => {
    if (dropZone.value === element) {
      element.style.backgroundColor = ''
      dropZone.value = null
    }
  }

  return {
    draggedEvent: computed(() => draggedEvent.value),
    isDragging: computed(() => isDragging.value),
    handleDragStart,
    handleDragEnd,
    handleDrop,
    handleDragOver,
    handleDragLeave,
  }
}
