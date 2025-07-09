import CalendarComponent from './components/CalendarComponent.vue'
import CalendarToolbar from './components/CalendarToolbarButtons.vue'
import AgendaView from './components/views/AgendaView.vue'
import DayView from './components/views/DayView.vue'
import MonthView from './components/views/MonthView.vue'
import WeekView from './components/views/WeekView.vue'
import type { App } from 'vue'
import CalendarFilters from './components/CalendarFilters.vue'
import { useLocale } from './composables/useLocale'
import { locale as locale_en } from './locale/en'
import type { CalendarConfig, GlobalSettings } from './types'

const defaultCalendarConfig: CalendarConfig = {
  firstDayOfWeek: 'monday',
  minTime: '00:00',
  maxTime: '24:00',
  timeSlotDuration: 60,
  showWeekNumbers: false,
  showTimeGrid: true,
  timeGridDivisions: 4,
}

export default {
  install(app: App, options: Partial<GlobalSettings> = {}) {
    options.calendarConfig = mergeConfig(options.calendarConfig)
    options.locale = options.locale ?? locale_en

    const componentName = 'CalendarComponent'

    // Register the main component
    app.component(componentName, CalendarComponent)
    app.component('CalendarToolbar', CalendarToolbar)
    app.component('CalendarFilters', CalendarFilters)
    app.component('AgendaView', AgendaView)
    app.component('DayView', DayView)
    app.component('MonthView', MonthView)
    app.component('WeekView', WeekView)

    // Provide global config if specified
    app.provide('calendarGlobalConfig', options.calendarConfig)
    useLocale().setLocale(options.locale)
  },
}

const mergeConfig = (userConfig: Partial<CalendarConfig> = {}): CalendarConfig => {
  return {
    ...defaultCalendarConfig,
    ...userConfig,
  }
}

// Export components
export {
  CalendarComponent,
  CalendarToolbar,
  CalendarFilters,
  AgendaView,
  DayView,
  MonthView,
  WeekView,
}

// Export types
export * from './types'

// Export composables
export * from './composables'

// Export utilities
export * from './utils'

// Export locales
export { locale as localeEn } from './locale/en'
export { locale as localeDe } from './locale/de'
