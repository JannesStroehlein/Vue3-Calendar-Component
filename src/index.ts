// Main plugin export
export { default } from './plugin'

// Export types
export * from './plugin/types'

// Export components individually
export { default as CalendarComponent } from './plugin/components/CalendarComponent.vue'
export { default as CalendarToolbarButtons } from './plugin/components/CalendarToolbarButtons.vue'
export { default as CalendarFilters } from './plugin/components/CalendarFilters.vue'
export { default as AgendaView } from './plugin/components/views/AgendaView.vue'
export { default as DayView } from './plugin/components/views/DayView.vue'
export { default as MonthView } from './plugin/components/views/MonthView.vue'
export { default as WeekView } from './plugin/components/views/WeekView.vue'

// Export composables
export * from './plugin/composables'

// Export utilities
export * from './plugin/utils'

// Note: Locale files are now exported as separate chunks
// Import them individually: import enLocale from 'vue3-calendar-component/locale/en'
