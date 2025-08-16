import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
import type { App } from 'vue'
import CalendarComponent from './components/CalendarComponent.vue'
import CalendarFilters from './components/CalendarFilters.vue'
import CalendarToolbar from './components/CalendarToolbarButtons.vue'
import AgendaView from './components/views/AgendaView.vue'
import DayView from './components/views/DayView.vue'
import MonthView from './components/views/MonthView.vue'
import WeekView from './components/views/WeekView.vue'
import { useLocale } from './composables/useLocale'
import localeEn from './locale/en'
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
    dayjs.extend(isoWeek)

    options.calendarConfig = mergeConfig(options.calendarConfig)
    options.locale = options.locale ?? localeEn

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
export { AgendaView, CalendarComponent, CalendarFilters, CalendarToolbar, DayView, MonthView, WeekView }

// Export types
export * from './types'

// Export composables
export * from './composables'

// Export utilities
export * from './utils'

// Export locales
export * from './locale/de'
export * from './locale/en'
