import { computed, Ref } from 'vue'
import { useTimeConverter } from './useTimeConverter'
import { DynamicTimeSlots } from '../types'

/**
 * Custom composable to dynamically calculate time slot height based on available height and time slot duration.
 * @param availableHeightRef - Reference to the available height in pixels
 * @param numberOfSlots - Reference to the number of time slots to display
 * @param headerHeight - Optional header height to subtract from available height (default is 60px)
 * @returns A computed reference that provides the dynamic height for each time slot in pixels.
 */
export function useDynamicTimeSlots(
  availableHeightRef: Ref<number>,
  minTimeRef: Ref<string>,
  maxTimeRef: Ref<string>,
  slotDurationRef: Ref<number>,
  headerHeight: number = 60
) : Ref<DynamicTimeSlots> {
  const dynamicTimeSlotHeight = computed(() => {
    const minTime = useTimeConverter(minTimeRef)
    const maxTime = useTimeConverter(maxTimeRef)

    const numberOfSlots = computed(() => {
      const totalMinutes = maxTime.value - minTime.value
      return Math.ceil(totalMinutes / slotDurationRef.value) // Calculate total slots based on duration
    })

    const availableBodyHeight = availableHeightRef.value - headerHeight
    const dynamicHeight = computed(() => {
      if (availableBodyHeight <= 0) {
        return 30 // Fallback to minimum height if available height is zero or negative
      }
      return Math.max(30, Math.floor(availableBodyHeight / numberOfSlots.value)) // Minimum 30px per slot
    })

    return {
      height: dynamicHeight.value,
      numberOfSlots: numberOfSlots.value,
      minTime: minTime.value,
      maxTime: maxTime.value,
    }
  })

  return dynamicTimeSlotHeight
}
