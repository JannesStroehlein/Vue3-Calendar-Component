import { computed } from 'vue'
import { useDisplay } from 'vuetify'
import type { CalendarView } from '@/types'

export function useResponsive() {
  const { mobile, width, sm, md, lg, xl, xxl } = useDisplay()

  const tablet = computed(() => sm.value || md.value)
  const desktop = computed(() => lg.value || xl.value || xxl.value)

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
    } else if (width.value > 1920) {
      // Very wide screens - increase height to prevent squashing
      return 80
    } else {
      return 60
    }
  })

  const isWideScreen = computed(() => width.value > 1920)

  return {
    mobile,
    tablet,
    desktop,
    isWideScreen,
    recommendedView,
    eventDisplayMode,
    showSidebar,
    timeSlotHeight
  }
}
