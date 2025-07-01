import { computed } from 'vue'
import { useDisplay } from 'vuetify'
import type { CalendarView } from '@/types'

export function useResponsive() {
  const { mobile, tablet, desktop } = useDisplay()

  const recommendedView = computed((): CalendarView => {
    if (mobile.value) {
      return 'agenda'
    } else if (tablet.value) {
      return 'week'
    } else {
      return 'month'
    }
  })

  const eventDisplayMode = computed(() => {
    if (mobile.value) {
      return 'compact'
    } else if (tablet.value) {
      return 'normal'
    } else {
      return 'detailed'
    }
  })

  const showSidebar = computed(() => {
    return desktop.value
  })

  const timeSlotHeight = computed(() => {
    if (mobile.value) {
      return 40
    } else if (tablet.value) {
      return 50
    } else {
      return 60
    }
  })

  return {
    mobile,
    tablet,
    desktop,
    recommendedView,
    eventDisplayMode,
    showSidebar,
    timeSlotHeight
  }
}
