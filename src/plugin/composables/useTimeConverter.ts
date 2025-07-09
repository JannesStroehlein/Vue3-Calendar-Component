import { computed, Ref } from 'vue'

/**
 * Helper composable to convert time strings to a more usable format.
 * This can be used to convert time strings like "08:00" to a Date object
 * @param timeRef - Reference to a time string in "HH:mm" format
 * @returns A computed reference that returns the total minutes from the start of the day
 */
export function useTimeConverter(timeRef: Ref<string>) {
  const convertedTimeRef = computed(() => {
    const [hours, minutes] = timeRef.value.split(':').map(Number)
    const minutesInDay = hours * 60 + minutes // Convert to total minutes
    return minutesInDay
  })

  return convertedTimeRef
}
